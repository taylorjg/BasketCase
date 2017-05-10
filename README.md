[![CircleCI](https://circleci.com/gh/taylorjg/BasketCase.svg?style=svg)](https://circleci.com/gh/taylorjg/BasketCase)

## Description

A little Angular 1.x app as a vehicle for grokking Elasticsearch. It supports the following functionality:

* free text search
* pagination
* filtering via facets

## Try it out

[Try it on Heroku](http://basketcasestore.herokuapp.com/)
(_it may take 10s to re-activate_)

## Design

The front end is an Angular 1.x app. The back end is a Node.js / Express server that uses the
[Elasticsearch](https://www.npmjs.com/package/elasticsearch) npm package to implement a web service
end point, `/api/search`.

### Request format

```json
{
    "filters": [{
        "type": "terms",
        "facetId": 2,
        "keys": ["Beko", "Hotpoint"]
    }, {
        "type": "range",
        "facetId": 4,
        "keys": ["250.0-300.0"],
        "from": 250,
        "to": 300
    }],
    "currentPage": 1,
    "pageSize": 10,
    "sortBy": 0
}
```

```json
{
    "searchText": "beko 7kg",
    "currentPage": 1,
    "pageSize": 10,
    "sortBy": 0
}
```

### Response format

```json
{
    "results": {
        "total": 7,
        "products": [{
            "Brand": "Beko",
            "FitTypeName": "Free Standing",
            "FullTitle": "Beko WMB71233S 7Kg Washing Machine with 1200 rpm - Silver",
            "Price": 250,
            "RatingValue": 4.6,
            "EnergyRating": "A+++",
            "Image": "//media.ao.com/en-GB/Productimages/Images/rvMedium/beko_wmb71233s_si_01_m_p.jpg",
            "ReviewCount": 5,
            "Code": "WMB71233S_SI",
            "Colour": "Silver"
        },
        ...
        ]
    },
    "facets": [{
        "facetId": 1,
        "isRange": false,
        "displayName": "Fit Type",
        "facetValues": [{
            "index": 0,
            "displayName": "Free Standing",
            "key": "Free Standing",
            "count": 6
        }, {
            "index": 1,
            "displayName": "Built In",
            "key": "Built In",
            "count": 1
        }]
    }, {
        "facetId": 2,
        "isRange": false,
        "displayName": "Brand",
        "facetValues": [{
            "index": 0,
            "displayName": "Beko",
            "key": "Beko",
            "count": 6,
            "selected": true
        }, {
            "index": 1,
            "displayName": "Hoover",
            "key": "Hoover",
            "count": 3,
            "selected": false
        },
        ...
        ]
    }, {
        "facetId": 3,
        "isRange": false,
        "displayName": "Colour",
        "facetValues": [{
            "index": 0,
            "displayName": "Black",
            "key": "Black",
            "count": 3
        }, {
            "index": 1,
            "displayName": "White",
            "key": "White",
            "count": 3
        }, {
            "index": 2,
            "displayName": "Silver",
            "key": "Silver",
            "count": 1
        }]
    }, {
        "facetId": 4,
        "isRange": true,
        "displayName": "Price",
        "facetValues": [{
            "index": 0,
            "displayName": "&pound;200 or less",
            "key": "*-200.0",
            "count": 2,
            "selected": false,
            "to": 200
        }, {
            "index": 1,
            "displayName": "&pound;200 - &pound;250",
            "key": "200.0-250.0",
            "count": 7,
            "selected": false,
            "from": 200,
            "to": 250
        },
        ...
        ]
    }]
}
```

## TODO

* ~~sorting of results by various criteria~~
* autocompletion in the search box
* breadcrumbs
* deep linking
* unit tests
