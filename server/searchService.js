'use strict';

const express = require('express');
const es = require('elasticsearch');
const fd = require('./facetDefinitions');

const esConfig = () => {
    const bonsai_url = process.env.BONSAI_URL;
    return {
        host: bonsai_url || 'localhost:9200'
    };
};

const client = new es.Client(esConfig());

const SORT_BY_PRICE_LOW_TO_HIGH = 0;
const SORT_BY_PRICE_HIGH_TO_LOW = 1;
const SORT_BY_AVERAGE_RATING = 2;
const SORT_BY_REVIEW_COUNT = 3;

const outTermFilterFor = field => f => {
    if (f.terms && f.terms[field]) return false;
    return true;
};

const outRangeFilterFor = field => f => {
    if (f.range && f.range[field]) return false;
    return true;
};

const addTermAggregation = (aggs, activeFilters, name, field) => {
    const otherActiveFilters = activeFilters.filter(outTermFilterFor(field));
    aggs[name] = {
        filter: {
            bool: {
                filter: otherActiveFilters
            }
        },
        aggs: {
            [name]: {
                terms: {
                    field
                }
            }
        }
    };
};

const addRangeAggregation = (aggs, activeFilters, name, field, ranges) => {
    const otherActiveFilters = activeFilters.filter(outRangeFilterFor(field));
    aggs[name] = {
        filter: {
            bool: {
                filter: otherActiveFilters
            }
        },
        aggs: {
            [name]: {
                range: {
                    field,
                    ranges
                }
            }
        }
    };
};

const addAggregations = (request, filters) => {
    filters = filters || [];
    request.body.aggs = {
        global: {
            global: {},
            aggs: {}
        }
    };
    const aggs = request.body.aggs.global.aggs;
    fd.FACET_DEFINITIONS.forEach(fd => {
        if (fd.isRange) {
            addRangeAggregation(aggs, filters, fd.aggregationName, fd.fieldName, fd.ranges);
        } else {
            addTermAggregation(aggs, filters, fd.aggregationName, fd.fieldName);
        }
    });
    return request;
};

const defaultDisplayNameFormatter = bucket => bucket.key;

const bucketToCommonFacetValue = (filter, bucket, index, displayNameFormatter) => ({
    index: index,
    displayName: (displayNameFormatter || defaultDisplayNameFormatter)(bucket),
    key: bucket.key,
    count: bucket.doc_count,
    selected: !!(filter && filter.keys.find(k => k === bucket.key))
});

const bucketToTermsFacetValue = (filter, displayNameFormatter) => (bucket, index) =>
    bucketToCommonFacetValue(filter, bucket, index, displayNameFormatter);

const bucketToRangeFacetValue = (filter, displayNameFormatter) => (bucket, index) => {
    const facetValue = bucketToCommonFacetValue(filter, bucket, index, displayNameFormatter);
    facetValue.from = bucket.from;
    facetValue.to = bucket.to;
    return facetValue;
};

const bucketsToTermsFacetValues = (filter, buckets, displayNameFormatter) =>
    buckets.map(bucketToTermsFacetValue(filter, displayNameFormatter));

const bucketsToRangeFacetValues = (filter, buckets, displayNameFormatter) =>
    buckets
        .filter(bucket => bucket.doc_count)
        .map(bucketToRangeFacetValue(filter, displayNameFormatter));

const aggToTermsFacet = (filters, agg, facetId, displayName, displayNameFormatter) => {
    const filter = filters.find(f => f.facetId === facetId);
    return {
        facetId,
        isRange: false,
        displayName,
        facetValues: bucketsToTermsFacetValues(filter, agg.buckets, displayNameFormatter)
    };
};

const aggToRangeFacet = (filters, agg, facetId, displayName, displayNameFormatter) => {
    const filter = filters.find(f => f.facetId === facetId);
    return {
        facetId,
        isRange: true,
        displayName,
        facetValues: bucketsToRangeFacetValues(filter, agg.buckets, displayNameFormatter)
    };
};

const hitToResult = hit => hit._source;

const elasticsearchHitsToMyResults = hits => ({
    total: hits.total,
    products: hits.hits.map(hitToResult)
});

const elasticsearchAggsToMyFacets = (aggs, filters) => {
    const myFacets = fd.FACET_DEFINITIONS.map(fd => {
        const agg = aggs[fd.aggregationName][fd.aggregationName];
        const aggToFacetFn = fd.isRange ? aggToRangeFacet : aggToTermsFacet;
        return aggToFacetFn(filters, agg, fd.facetId, fd.displayName, fd.displayNameFormatter);
    });
    return Array.prototype.concat.apply([], myFacets);
};

const elasticsearchResponseToMyResponse = (response, filters) => ({
    results: elasticsearchHitsToMyResults(response.hits),
    facets: elasticsearchAggsToMyFacets(response.aggregations.global, filters)
});

const myFilterToTermsFilter = filter => {
    const fieldName = fd.FACET_IDS_TO_FIELD_NAMES[filter.facetId];
    return {
        terms: {
            [fieldName]: filter.keys
        }
    };
};

const myFilterToRangeFilter = filter => {
    const fieldName = fd.FACET_IDS_TO_FIELD_NAMES[filter.facetId];
    const f = {
        range: {
            [fieldName]: {}
        }
    };
    if (filter.from) {
        f.range[fieldName].gte = filter.from;
    }
    if (filter.to) {
        f.range[fieldName].lt = filter.to;
    }
    return f;
};

const myFilterToElasticsearchFilter = filter => {
    switch (filter.type) {
        case 'terms': return myFilterToTermsFilter(filter);
        case 'range': return myFilterToRangeFilter(filter);
        default: return null;
    }
};

const myFiltersToElasticsearchFilters = filters =>
    filters
        .map(myFilterToElasticsearchFilter)
        .filter(f => f);

const mySortByToElasticsearchSort = sortBy => {
    switch (sortBy) {
        case SORT_BY_PRICE_LOW_TO_HIGH: return { 'Price': { order: "asc" } };
        case SORT_BY_PRICE_HIGH_TO_LOW: return { 'Price': { order: "desc" } };
        case SORT_BY_AVERAGE_RATING: return { 'RatingValue': { order: "desc" } };
        case SORT_BY_REVIEW_COUNT: return { 'ReviewCount': { order: "desc" } };
        default: return null;
    }
};

const search = (req, res) => {
    const pageSize = Number(req.body.pageSize);
    const currentPage = Number(req.body.currentPage);
    const sortBy = Number(req.body.sortBy) || 0;
    const searchText = req.body.searchText || "";
    const filters = req.body.filters || [];
    const esFilters = myFiltersToElasticsearchFilters(filters);
    const request = {
        index: 'products',
        type: 'washers',
        body: {
            query: {
                match_all: {}
            },
            _source: [
                'Code',
                'FitTypeName',
                'Brand',
                'Colour',
                'Price',
                'FullTitle',
                'EnergyRating',
                'Image',
                'ReviewCount',
                'RatingValue'
            ]
        }
    };
    if (pageSize && currentPage) {
        request.body.size = pageSize;
        request.body.from = pageSize * (currentPage - 1);
    }
    const sort = mySortByToElasticsearchSort(sortBy);
    if (sort) {
        request.body.sort = sort;
    }
    if (searchText) {
        request.body.query = {
            query_string: {
                query: searchText
            }
        };
    }
    if (esFilters.length) {
        request.body.query = {
            bool: {
                filter: esFilters
            }
        };
    }
    client.search(addAggregations(request, esFilters))
        .then(response => {
            const myResponse = elasticsearchResponseToMyResponse(response, filters);
            return sendJsonResponse(res, 200, myResponse);
        })
        .catch(err => {
            if (err.displayName && err.statusCode) {
                console.error(`ERROR: ${err.displayName} (${err.statusCode}) ${err.message}`);
            } else {
                console.error(`ERROR: ${err.message}`);
            }
            sendStatusResponse(res, 500, err.message);
        });
};

const sendJsonResponse = (res, status, content) => res.status(status).json(content);
const sendStatusResponse = (res, status, content) => res.status(status).send(content);

const router = express.Router();
router.post('/search', search);

module.exports = router;
