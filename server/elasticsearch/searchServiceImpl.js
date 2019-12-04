const es = require('elasticsearch')
const es2my = require('./es2my')
const my2es = require('./my2es')

const esConfig = () => {
  const bonsai_url = process.env.BONSAI_URL
  return {
    host: bonsai_url || 'localhost:9200'
  }
}

const client = new es.Client(esConfig())

const search = searchOptions => {

  const esFilters = my2es.myFiltersToElasticsearchFilters(searchOptions.filters)
  const esSort = my2es.mySortByToElasticsearchSort(searchOptions.sortBy)

  const esRequest = {
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
  }

  if (searchOptions.pageSize && searchOptions.currentPage) {
    esRequest.body.size = searchOptions.pageSize
    esRequest.body.from = searchOptions.pageSize * (searchOptions.currentPage - 1)
  }

  if (esSort) {
    esRequest.body.sort = esSort
  }

  if (searchOptions.searchText) {
    esRequest.body.query = {
      query_string: {
        query: searchOptions.searchText
      }
    }
  }

  if (esFilters.length) {
    esRequest.body.query = {
      bool: {
        filter: esFilters
      }
    }
  }

  return client.search(my2es.addAggregationsToRequest(esRequest, esFilters))
    .then(esResponse => {
      const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, searchOptions.filters)
      return myResponse
    })
    .catch(err => {
      if (err.displayName && err.statusCode) {
        console.error(`[elasticsearch.searchServiceImpl#search]: ${err.displayName} (${err.statusCode}) ${err.message}`)
      } else {
        console.error(`[elasticsearch.searchServiceImpl#search]: ${err.message}`)
      }
      return err
    })
}

module.exports = {
  search
}
