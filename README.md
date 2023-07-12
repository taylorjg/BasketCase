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
        "name": "brand",
        "keys": ["Beko", "Hotpoint"]
    }, {
        "name": "price",
        "keys": ["250-300"],
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
        "isRange": false,
        "name": "fitType",
        "displayName": "Fit Type",
        "facetValues": [{
            "displayName": "Free Standing",
            "key": "Free Standing",
            "count": 6,
            "selected": false
        }, {
            "displayName": "Built In",
            "key": "Built In",
            "count": 1,
            "selected": false
        }]
    }, {
        "isRange": false,
        "name": "brand",
        "displayName": "Brand",
        "facetValues": [{
            "displayName": "Beko",
            "key": "Beko",
            "count": 6,
            "selected": true
        }, {
            "displayName": "Hoover",
            "key": "Hoover",
            "count": 3,
            "selected": false
        },
        ...
        ]
    }, {
        "isRange": false,
        "name": "colour",
        "displayName": "Colour",
        "facetValues": [{
            "displayName": "Black",
            "key": "Black",
            "count": 3,
            "selected": false
        }, {
            "displayName": "White",
            "key": "White",
            "count": 3,
            "selected": false
        }, {
            "displayName": "Silver",
            "key": "Silver",
            "count": 1,
            "selected": false
        }]
    }, {
        "isRange": true,
        "name": "price",
        "displayName": "Price",
        "facetValues": [{
            "displayName": "&pound;200 or less",
            "key": "undefined-200",
            "count": 2,
            "selected": false,
        }, {
            "displayName": "&pound;200 - &pound;250",
            "key": "200-250",
            "count": 7,
            "selected": false,
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
