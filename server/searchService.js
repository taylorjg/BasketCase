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
    client.search(addAggregations(request, filters))
        .then(response => sendJsonResponse(res, 200, response))
        .catch(err => sendStatusResponse(res, 500, err.message));
};

const sendJsonResponse = (res, status, content) => res.status(status).json(content);
const sendStatusResponse = (res, status, content) => res.status(status).send(content);

const router = express.Router();
router.post('/search', search);

module.exports = router;
