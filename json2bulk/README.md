## Description

I loaded the product data for 60 washing machines from the following location:

* http://content.ao.com/ProductsHandler.axd?productQuery=/l/washing_machines/1/1/&numberToReturn=60

The JSON response contains an array of 60 objects. Here is an excerpt of the first object:

```json
{
    "Code": "EWD81482W_WH",
    "ColourId": 37193,
    "Title": "Indesit EWD81482W Washing Machine White",
    "FullTitle": "Indesit My Time EWD81482W 8Kg Washing Machine with 1400 rpm - White",
    "Image": "//media.ao.com/en-GB/Productimages/Images/rvMedium/indesit_ewd81482w_wh_01_m_p.jpg",
    "Price": 199,
    "Rating": "4-6",
    "RatingValue": 4.6,
    ...
}
```

I want each object to be a document in my Elasticsearch database. I wrote this bit of Scala code to reshape the JSON response into a file format suitable for bulk loading. For each object in the array, I need to write a pair of lines. The first line describes the operation and contains any further information relevant to the operation. In my case, I want to `index` each document and I use the product's `Code` as the document's `_id`. The second line is the document to be indexed. This has to be JSON formatted as a single line.

```json
{"index":{"_id":"EWD81482W_WH"}}
{"Code":"EWD81482W_WH","ColourId":37193,...
```

Locally, I am using Elasticsearch version 5.3.1. However, I also deploy the app to Heroku where I use the [Bonasi Elasticsearch](https://elements.heroku.com/addons/bonsai) add-on which is version 2.4.0. After some experimentation, I found that I needed to explicitly map some fields in order to successfully bulk load all the documents on both versions. I used the following request to create my mapping:

```
PUT /products
{
  "mappings": {
    "washers": {
      "properties": {
        "Brand": {
          "type": "string",
          "fields": {
            "keyword": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        },
        "Colour": {
          "type": "string",
          "fields": {
            "keyword": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        },
        "FitTypeName": {
          "type": "string",
          "fields": {
            "keyword": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        },
        "DeliveryOptionViewModel": {
          "properties": {
            "DeliveryOptionMessages": {
              "properties": {
                "ChargeValue": {
                  "type": "double"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

I then used the following command to bulk load the documents:

```
curl -XPOST localhost:9200/products/washers/_bulk?pretty --data-binary @bulk.json > bulk_response.json
```
