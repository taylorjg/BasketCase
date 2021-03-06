const expect = require('chai').expect
const es2my = require('../elasticsearch/es2my')

const SKELETON_ES_RESPONSE = {
  aggregations: {
    global: {
      fitType: {
        fitType: {
          buckets: []
        }
      },
      brand: {
        brand: {
          buckets: []
        }
      },
      colour: {
        colour: {
          buckets: []
        }
      },
      price: {
        price: {
          buckets: []
        }
      }
    }
  },
  hits: {
    total: 0,
    hits: []
  }
}

const clonedSkeletonEsResponse = () => JSON.parse(JSON.stringify(SKELETON_ES_RESPONSE))

const makeProductSource = n => ({
  Code: `ABC${n}_WH`,
  FitTypeName: 'Built In',
  Brand: 'Beko',
  Colour: 'White',
  Price: 100 + n * 10,
  FullTitle: `Beko Washing Machine ${n}`,
  EnergyRating: 'A+++',
  Image: `image-url-${n}`,
  ReviewCount: 10 + n,
  RatingValue: 4 + n / 10
})

describe('es2my tests', () => {

  describe('#elasticsearchResponseToMyResponse', () => {

    it('empty hits, empty facets', () => {
      const myFilters = []
      const myResponse = es2my.elasticsearchResponseToMyResponse(SKELETON_ES_RESPONSE, myFilters)
      expect(myResponse.results.total).to.equal(0)
      expect(myResponse.results.products).to.be.empty
      expect(myResponse.facets).to.have.lengthOf(4)
      expect(myResponse.facets.find(f => f.facetId === 1).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 2).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 3).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 4).facetValues).to.be.empty
    })

    it('single hit, empty facets', () => {
      const productSource = makeProductSource(0)
      const esResponse = clonedSkeletonEsResponse()
      esResponse.hits.total = 1
      esResponse.hits.hits = [
        { _source: productSource }
      ]
      const myFilters = []
      const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, myFilters)
      expect(myResponse.results.total).to.equal(1)
      expect(myResponse.results.products).to.have.lengthOf(1)
      expect(myResponse.results.products[0]).to.deep.equal(productSource)
    })

    it('empty hits, single fitType facet', () => {
      const esResponse = clonedSkeletonEsResponse()
      esResponse.aggregations.global.fitType.fitType.buckets = [
        {
          key: 'Built In',
          doc_count: 3
        }
      ]
      const myFilters = []
      const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, myFilters)
      expect(myResponse.facets).to.have.lengthOf(4)
      const fitTypeFacet = myResponse.facets.find(f => f.facetId === 1)
      expect(fitTypeFacet.facetId).to.equal(1)
      expect(fitTypeFacet.displayName).to.equal('Fit Type')
      expect(fitTypeFacet.isRange).to.equal(false)
      expect(fitTypeFacet.facetValues).to.have.lengthOf(1)
      expect(fitTypeFacet.facetValues[0].index).to.equal(0)
      expect(fitTypeFacet.facetValues[0].key).to.equal('Built In')
      expect(fitTypeFacet.facetValues[0].displayName).to.equal('Built In')
      expect(fitTypeFacet.facetValues[0].count).to.equal(3)
      expect(fitTypeFacet.facetValues[0].selected).to.equal(false)
      expect(myResponse.facets.find(f => f.facetId === 2).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 3).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 4).facetValues).to.be.empty
    })

    it('empty hits, single brand facet', () => {
      const esResponse = clonedSkeletonEsResponse()
      esResponse.aggregations.global.brand.brand.buckets = [
        {
          key: 'Beko',
          doc_count: 7
        }
      ]
      const myFilters = []
      const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, myFilters)
      expect(myResponse.facets).to.have.lengthOf(4)
      const brandFacet = myResponse.facets.find(f => f.facetId === 2)
      expect(brandFacet.facetId).to.equal(2)
      expect(brandFacet.displayName).to.equal('Brand')
      expect(brandFacet.isRange).to.equal(false)
      expect(brandFacet.facetValues).to.have.lengthOf(1)
      expect(brandFacet.facetValues[0].index).to.equal(0)
      expect(brandFacet.facetValues[0].key).to.equal('Beko')
      expect(brandFacet.facetValues[0].displayName).to.equal('Beko')
      expect(brandFacet.facetValues[0].count).to.equal(7)
      expect(brandFacet.facetValues[0].selected).to.equal(false)
      expect(myResponse.facets.find(f => f.facetId === 1).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 3).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 4).facetValues).to.be.empty
    })

    it('empty hits, single colour facet', () => {
      const esResponse = clonedSkeletonEsResponse()
      esResponse.aggregations.global.colour.colour.buckets = [
        {
          key: 'Black',
          doc_count: 5
        }
      ]
      const myFilters = []
      const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, myFilters)
      expect(myResponse.facets).to.have.lengthOf(4)
      const colourFacet = myResponse.facets.find(f => f.facetId === 3)
      expect(colourFacet.facetId).to.equal(3)
      expect(colourFacet.displayName).to.equal('Colour')
      expect(colourFacet.isRange).to.equal(false)
      expect(colourFacet.facetValues).to.have.lengthOf(1)
      expect(colourFacet.facetValues[0].index).to.equal(0)
      expect(colourFacet.facetValues[0].key).to.equal('Black')
      expect(colourFacet.facetValues[0].displayName).to.equal('Black')
      expect(colourFacet.facetValues[0].count).to.equal(5)
      expect(colourFacet.facetValues[0].selected).to.equal(false)
      expect(myResponse.facets.find(f => f.facetId === 1).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 2).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 4).facetValues).to.be.empty
    })

    it('empty hits, multiple price facets', () => {
      const esResponse = clonedSkeletonEsResponse()
      esResponse.aggregations.global.price.price.buckets = [
        {
          key: '*-200.0',
          doc_count: 1,
          to: 200
        },
        {
          key: '200.0-250.0',
          doc_count: 2,
          from: 200,
          to: 250
        },
        {
          key: '250.0-*',
          doc_count: 3,
          from: 250
        }
      ]
      const myFilters = []
      const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, myFilters)
      expect(myResponse.facets).to.have.lengthOf(4)
      const colourFacet = myResponse.facets.find(f => f.facetId === 4)
      expect(colourFacet.facetId).to.equal(4)
      expect(colourFacet.displayName).to.equal('Price')
      expect(colourFacet.isRange).to.equal(true)
      expect(colourFacet.facetValues).to.have.lengthOf(3)

      expect(colourFacet.facetValues[0].index).to.equal(0)
      expect(colourFacet.facetValues[0].key).to.equal('*-200.0')
      expect(colourFacet.facetValues[0].to).to.equal(200)
      expect(colourFacet.facetValues[0].displayName).to.equal('&pound;200 or less')
      expect(colourFacet.facetValues[0].count).to.equal(1)
      expect(colourFacet.facetValues[0].selected).to.equal(false)

      expect(colourFacet.facetValues[1].index).to.equal(1)
      expect(colourFacet.facetValues[1].key).to.equal('200.0-250.0')
      expect(colourFacet.facetValues[1].from).to.equal(200)
      expect(colourFacet.facetValues[1].to).to.equal(250)
      expect(colourFacet.facetValues[1].displayName).to.equal('&pound;200 - &pound;250')
      expect(colourFacet.facetValues[1].count).to.equal(2)
      expect(colourFacet.facetValues[1].selected).to.equal(false)

      expect(colourFacet.facetValues[2].index).to.equal(2)
      expect(colourFacet.facetValues[2].key).to.equal('250.0-*')
      expect(colourFacet.facetValues[2].from).to.equal(250)
      expect(colourFacet.facetValues[2].displayName).to.equal('&pound;250 or more')
      expect(colourFacet.facetValues[2].count).to.equal(3)
      expect(colourFacet.facetValues[2].selected).to.equal(false)

      expect(myResponse.facets.find(f => f.facetId === 1).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 2).facetValues).to.be.empty
      expect(myResponse.facets.find(f => f.facetId === 3).facetValues).to.be.empty
    })

    // TODO:
    // - selection state of facet values based on myFilters
    //  - true if was selected previously
    //  - false if was not selected previously 
  })
})
