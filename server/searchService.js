'use strict';

const express = require('express');
const es = require('elasticsearch');

const client = new es.Client({
    host: 'localhost:9200'
});

const getInitialFacets = (req, res) => {

    const request = {
        index: 'products',
        type: 'washers',
        body: {
            query: {
                match_all: {}
            },
            aggs: {
                'all_documents': {
                    global: {},
                    aggs: {
                        'brands': {
                            terms: {
                                field: 'Brand.keyword'
                            }
                        },
                        'colours': {
                            terms: {
                                field: 'Colour.keyword'
                            }
                        }
                    }
                }
            }
        }
    };

    client.search(request)
        .then(response => sendJsonResponse(res, 200, response.aggregations))
        .catch(err => sendStatusResponse(res, 500, err.message));
};

const sendJsonResponse = (res, status, content) => res.status(status).json(content);
const sendStatusResponse = (res, status, content) => res.status(status).send(content);

const router = express.Router();
router.get('/initialFacets', getInitialFacets);

module.exports = router;
