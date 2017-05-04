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

// const aggs = {
//     'price': {
//         "range": {
//             "field": "Price",
//             "ranges": [
//                 { "to": 200 },
//                 { "from": 200, "to": 250 },
//                 { "from": 250, "to": 300 },
//                 { "from": 300, "to": 350 },
//                 { "from": 350, "to": 400 },
//                 { "from": 400, "to": 450 },
//                 { "from": 450, "to": 500 },
//                 { "from": 500, "to": 550 },
//                 { "from": 550, "to": 600 },
//                 { "from": 600, "to": 650 },
//                 { "from": 650 }
//             ]
//         }
//     }
// };

const notBrandFilter = f => {
    if (f.terms && f.terms['Brand.keyword']) return false;
    return true;
};

const notColourFilter = f => {
    if (f.terms && f.terms['Colour.keyword']) return false;
    return true;
};

const notFitTypeFilter = f => {
    if (f.terms && f.terms['FitTypeName.keyword']) return false;
    return true;
};

const addTrickyFitTypeAggregation = (aggs, filters) => {
    const otherFilters = filters.filter(notFitTypeFilter);
    const name = 'fitType';
    aggs[name] = {
        filter: {
            bool: {
                filter: otherFilters
            }
        },
        aggs: {
            [name]: {
                terms: {
                    field: "FitTypeName.keyword"
                }
            }
        }
    };
};

const addTrickyBrandsAggregation = (aggs, filters) => {
    const otherFilters = filters.filter(notBrandFilter);
    const name = 'brand';
    aggs[name] = {
        filter: {
            bool: {
                filter: otherFilters
            }
        },
        aggs: {
            [name]: {
                terms: {
                    field: "Brand.keyword"
                }
            }
        }
    };
};

const addTrickyColoursAggregation = (aggs, filters) => {
    const otherFilters = filters.filter(notColourFilter);
    const name = 'colour';
    aggs[name] = {
        filter: {
            bool: {
                filter: otherFilters
            }
        },
        aggs: {
            [name]: {
                terms: {
                    field: "Colour.keyword"
                }
            }
        }
    };
};

const addTrickyAggregations = (request, filters) => {
    request.body.aggs = {
        'global': {
            'global': {},
            aggs: {}
        }
    };
    const aggs = request.body.aggs.global.aggs;
    addTrickyFitTypeAggregation(aggs, filters);
    addTrickyBrandsAggregation(aggs, filters);
    addTrickyColoursAggregation(aggs, filters);
    // console.log(JSON.stringify(request, null, 2));
    return request;
};

const facets = (req, res) => {
    const request = {
        index: 'products',
        type: 'washers',
        body: {}
    };
    client.search(addTrickyAggregations(request, []))
        .then(response => sendJsonResponse(res, 200, response))
        .catch(err => sendStatusResponse(res, 500, err.message));
};

const search = (req, res) => {
    const searchText = req.body.searchText;
    const filters = req.body.filters;
    const request = {
        index: 'products',
        type: 'washers',
        body: {
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
    // console.log(JSON.stringify(filters, null, 2));
    client.search(addTrickyAggregations(request, filters || []))
        .then(response => sendJsonResponse(res, 200, response))
        .catch(err => sendStatusResponse(res, 500, err.message));
};

const sendJsonResponse = (res, status, content) => res.status(status).json(content);
const sendStatusResponse = (res, status, content) => res.status(status).send(content);

const router = express.Router();
router.get('/facets', facets);
router.post('/search', search);

module.exports = router;
