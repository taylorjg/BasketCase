'use strict';

const express = require('express');
const es = require('elasticsearch');

const esConfig = () => {
    const bonsai_url = process.env.BONSAI_URL;
    return {
        host: bonsai_url || 'localhost:9200'
    };
};

const client = new es.Client(esConfig());

const FACET_ID_FIT_TYPE = 1;
const FACET_ID_BRAND = 2;
const FACET_ID_COLOUR = 3;
const FACET_ID_PRICE = 4;

const FIELD_NAME_FIT_TYPE = 'FitTypeName.keyword';
const FIELD_NAME_BRAND = 'Brand.keyword';
const FIELD_NAME_COLOUR = 'Colour.keyword';
const FIELD_NAME_PRICE = 'Price';

const DISPLAY_NAME_FIT_TYPE = 'Fit Type';
const DISPLAY_NAME_BRAND = 'Brand';
const DISPLAY_NAME_COLOUR = 'Colour';
const DISPLAY_NAME_PRICE = 'Price';

const FACET_IDS_TO_FIELD_NAMES = {
    [FACET_ID_FIT_TYPE]: FIELD_NAME_FIT_TYPE,
    [FACET_ID_BRAND]: FIELD_NAME_BRAND,
    [FACET_ID_COLOUR]: FIELD_NAME_COLOUR,
    [FACET_ID_PRICE]: FIELD_NAME_PRICE,
};

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
    addTermAggregation(aggs, filters, 'fitType', FIELD_NAME_FIT_TYPE);
    addTermAggregation(aggs, filters, 'brand', FIELD_NAME_BRAND);
    addTermAggregation(aggs, filters, 'colour', FIELD_NAME_COLOUR);
    addRangeAggregation(aggs, filters, 'price', FIELD_NAME_PRICE, [
        { 'to': 200 },
        { 'from': 200, 'to': 250 },
        { 'from': 250, 'to': 300 },
        { 'from': 300, 'to': 350 },
        { 'from': 350, 'to': 400 },
        { 'from': 400, 'to': 450 },
        { 'from': 450, 'to': 500 },
        { 'from': 500, 'to': 550 },
        { 'from': 550, 'to': 600 },
        { 'from': 600, 'to': 650 },
        { 'from': 650 }
    ]);
    return request;
};

const defaultDisplayNameFormatter = bucket => bucket.key;

const formatPriceKey = bucket => {
    const gotFrom = Number.isInteger(bucket.from);
    const gotTo = Number.isInteger(bucket.to);
    if (gotFrom && gotTo) {
        return `&pound;${bucket.from} - &pound;${bucket.to}`;
    }
    if (gotFrom) {
        return `&pound;${bucket.from} or more`;
    }
    if (gotTo) {
        return `&pound;${bucket.to} or less`;
    }
    return bucket.key;
};

const bucketToCommonFacetValue = (bucket, index, displayNameFormatter) => ({
    id: index,
    displayName: (displayNameFormatter || defaultDisplayNameFormatter)(bucket),
    key: bucket.key,
    count: bucket.doc_count
});

const bucketToTermsFacetValue = displayNameFormatter => (bucket, index) =>
    bucketToCommonFacetValue(bucket, index, displayNameFormatter);

const bucketToRangeFacetValue = displayNameFormatter => (bucket, index) => {
    const facet = bucketToCommonFacetValue(bucket, index, displayNameFormatter);
    facet.from = bucket.from;
    facet.to = bucket.to;
    return facet;
};

const bucketsToTermsFacetValues = (buckets, displayNameFormatter) =>
    buckets.map(bucketToTermsFacetValue(displayNameFormatter));

const bucketsToRangeFacetValues = (buckets, displayNameFormatter) =>
    buckets
        .filter(bucket => bucket.doc_count)
        .map(bucketToRangeFacetValue(displayNameFormatter));

const aggToTermsFacet = (agg, id, displayName, displayNameFormatter) => ({
    id,
    isRange: false,
    displayName,
    facetValues: bucketsToTermsFacetValues(agg.buckets, displayNameFormatter)
});

const aggToRangeFacet = (agg, id, displayName, displayNameFormatter) => ({
    id,
    isRange: true,
    displayName,
    facetValues: bucketsToRangeFacetValues(agg.buckets, displayNameFormatter)
});

const hitToResult = hit => hit._source;

const elasticsearchHitsToMyResults = (pageSize, currentPage, searchText, hits) => ({
    total: hits.total,
    pageSize,
    currentPage,
    searchText,
    products: hits.hits.map(hitToResult)
});

const elasticsearchAggsToMyFacets = aggs =>
    [].concat(
        aggToTermsFacet(aggs.fitType.fitType, FACET_ID_FIT_TYPE, DISPLAY_NAME_FIT_TYPE),
        aggToTermsFacet(aggs.brand.brand, FACET_ID_BRAND, DISPLAY_NAME_BRAND),
        aggToTermsFacet(aggs.colour.colour, FACET_ID_COLOUR, DISPLAY_NAME_COLOUR),
        aggToRangeFacet(aggs.price.price, FACET_ID_PRICE, DISPLAY_NAME_PRICE, formatPriceKey));

const elasticsearchResponseToMyResponse = (pageSize, currentPage, searchText, response) => ({
    results: elasticsearchHitsToMyResults(pageSize, currentPage, searchText, response.hits),
    facets: elasticsearchAggsToMyFacets(response.aggregations.global)
});

const myFilterToTermsFilter = filter => {
    const fieldName = FACET_IDS_TO_FIELD_NAMES[filter.facetId];
    return {
        terms: {
            [fieldName]: filter.keys
        }
    };
};

const myFilterToRangeFilter = filter => {
    const fieldName = FACET_IDS_TO_FIELD_NAMES[filter.facetId];
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

const search = (req, res) => {
    const pageSize = Number(req.body.pageSize) || 10;
    const currentPage = Number(req.body.currentPage) || 1;
    const searchText = req.body.searchText || "";
    const filters = req.body.filters || [];
    const esFilters = myFiltersToElasticsearchFilters(filters);
    const request = {
        index: 'products',
        type: 'washers',
        body: {
            size: pageSize,
            from: pageSize * (currentPage - 1),
            query: {
                match_all: {}
            },
            sort: [
                {
                    "Price": {
                        "order": "asc"
                    }
                }
            ],
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
            const myResponse = elasticsearchResponseToMyResponse(pageSize, currentPage, searchText, response);
            return sendJsonResponse(res, 200, myResponse);
        })
        .catch(err => {
            console.error(`ERROR: ${err}`);
            sendStatusResponse(res, 500, err.message);
        });
};

const sendJsonResponse = (res, status, content) => res.status(status).json(content);
const sendStatusResponse = (res, status, content) => res.status(status).send(content);

const router = express.Router();
router.post('/search', search);

module.exports = router;
