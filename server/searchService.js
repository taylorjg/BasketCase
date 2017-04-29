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

const addAggregations = request => {
    request.body.aggs = {
        'all_documents': {
            global: {},
            aggs: {
                'fitType': {
                    terms: {
                        field: 'FitTypeName.keyword'
                    }
                },
                'brand': {
                    terms: {
                        field: 'Brand.keyword'
                    }
                },
                'colour': {
                    terms: {
                        field: 'Colour.keyword'
                    }
                },
                'price': {
                    "range": {
                        "field": "Price",
                        "ranges": [
                            { "to": 200 },
                            { "from": 200, "to": 250 },
                            { "from": 250, "to": 300 },
                            { "from": 300, "to": 350 },
                            { "from": 350, "to": 400 },
                            { "from": 400, "to": 450 },
                            { "from": 450, "to": 500 },
                            { "from": 500, "to": 550 },
                            { "from": 550, "to": 600 },
                            { "from": 600, "to": 650 },
                            { "from": 650 }
                        ]
                    }
                }
            }
        }
    }
    return request;
};

const getInitialFacets = (req, res) => {
    const request = {
        index: 'products',
        type: 'washers',
        body: {
            query: {
                match_all: {}
            }
        }
    };
    client.search(addAggregations(request))
        .then(response => sendJsonResponse(res, 200, response))
        .catch(err => sendStatusResponse(res, 500, err.message));
};

const sendJsonResponse = (res, status, content) => res.status(status).json(content);
const sendStatusResponse = (res, status, content) => res.status(status).send(content);

const router = express.Router();
router.get('/initialFacets', getInitialFacets);

module.exports = router;
