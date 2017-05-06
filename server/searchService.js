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
        'global': {
            'global': {},
            aggs: {}
        }
    };
    const aggs = request.body.aggs.global.aggs;
    addTermAggregation(aggs, filters, 'fitType', 'FitTypeName.keyword');
    addTermAggregation(aggs, filters, 'brand', 'Brand.keyword');
    addTermAggregation(aggs, filters, 'colour', 'Colour.keyword');
    addRangeAggregation(aggs, filters, 'price', 'Price', [
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

// const formatPriceKey = bucket => {
//     const gotFrom = Number.isInteger(bucket.from);
//     const gotTo = Number.isInteger(bucket.to);
//     if (gotFrom && gotTo) {
//         return `&pound;${bucket.from} - &pound;${bucket.to}`;
//     }
//     if (gotFrom) {
//         return `&pound;${bucket.from} or more`;
//     }
//     if (gotTo) {
//         return `&pound;${bucket.to} or less`;
//     }
//     return bucket.key;
// };

const bucketToCommonFacetValue = (bucket, index) => ({
    id: index,
    displayName: bucket.key,
    key: bucket.key,
    count: bucket.doc_count
});

const bucketToTermsFacetValue = (bucket, index) => bucketToCommonFacetValue(bucket, index);

const bucketToRangeFacetValue = (bucket, index) => {
    const facet = bucketToCommonFacetValue(bucket, index);
    facet.from = bucket.from;
    facet.to = bucket.to;
    return facet;
};

const bucketsToTermsFacetValues = buckets => buckets.map(bucketToTermsFacetValue);
const bucketsToRangeFacetValues = buckets => buckets.map(bucketToRangeFacetValue);

const aggToTermsFacet = (agg, id, displayName) => ({
    id,
    isRange: false,
    displayName,
    values: bucketsToTermsFacetValues(agg.buckets)
});

const aggToRangeFacet = (agg, id, displayName) => ({
    id,
    isRange: true,
    displayName,
    values: bucketsToRangeFacetValues(agg.buckets)
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
        aggToTermsFacet(aggs.fitType.fitType, 1, 'Fit Type'),
        aggToTermsFacet(aggs.brand.brand, 2, 'Brand'),
        aggToTermsFacet(aggs.colour.colour, 3, 'Colour'),
        aggToRangeFacet(aggs.price.price, 4, 'Price')); // TODO: pass in a function to format the display name

const elasticsearchResponseToMyResponse = (pageSize, currentPage, searchText, response) => ({
    results: elasticsearchHitsToMyResults(pageSize, currentPage, searchText, response.hits),
    facets: elasticsearchAggsToMyFacets(response.aggregations.global)
});

const search = (req, res) => {
    const pageSize = Number(req.body.pageSize) || 10;
    const currentPage = Number(req.body.currentPage) || 1;
    const searchText = req.body.searchText;
    const filters = req.body.filters;
    const request = {
        index: 'products',
        type: 'washers',
        body: {
            size: pageSize,
            from: pageSize * (currentPage - 1),
            query: {
                match_all: {}
            }
        }
    };
    if (searchText) {
        request.body.query = {
            query_string: {
                query: searchText
            }
        };
    }
    if (filters) {
        request.body.query = {
            bool: {
                filter: filters
            }
        };
    }
    client.search(addAggregations(request, filters))
        .then(response => {
            const myResponse = elasticsearchResponseToMyResponse(pageSize, currentPage, searchText, response);
            console.log(`myResponse: ${JSON.stringify(myResponse, null, 2)}`);
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
