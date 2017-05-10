const expect = require('chai').expect;
const es2my = require('../elasticsearch/es2my');

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
};

const clonedSkeletonEsResponse = () => JSON.parse(JSON.stringify(SKELETON_ES_RESPONSE));

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
});

describe('es2my tests', () => {

    describe('#elasticsearchResponseToMyResponse', () => {

        it('empty hits, empty facets', () => {
            const myFilters = [];
            const myResponse = es2my.elasticsearchResponseToMyResponse(SKELETON_ES_RESPONSE, myFilters);
            expect(myResponse.results.total).to.equal(0);
            expect(myResponse.results.products).to.be.empty;
            expect(myResponse.facets).to.have.lengthOf(4);
            expect(myResponse.facets.find(f => f.facetId === 1).facetValues).to.be.empty;
            expect(myResponse.facets.find(f => f.facetId === 2).facetValues).to.be.empty;
            expect(myResponse.facets.find(f => f.facetId === 3).facetValues).to.be.empty;
            expect(myResponse.facets.find(f => f.facetId === 4).facetValues).to.be.empty;
        });

        it('single hit, empty facets', () => {
            const productSource = makeProductSource(0);
            const esResponse = clonedSkeletonEsResponse();
            esResponse.hits.total = 1;
            esResponse.hits.hits = [
                { _source: productSource }
            ];
            const myFilters = [];
            const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, myFilters);
            expect(myResponse.results.total).to.equal(1);
            expect(myResponse.results.products).to.have.lengthOf(1);
            expect(myResponse.results.products[0]).to.deep.equal(productSource);
        });

        it('empty hits, single fitType facet', () => {
            const esResponse = clonedSkeletonEsResponse();
            esResponse.aggregations.global.fitType.fitType.buckets = [
                {
                    key: 'Built In',
                    doc_count: 3
                }
            ];
            const myFilters = [];
            const myResponse = es2my.elasticsearchResponseToMyResponse(esResponse, myFilters);
            expect(myResponse.facets).to.have.lengthOf(4);
            const fitTypeFacet = myResponse.facets.find(f => f.facetId === 1);
            expect(fitTypeFacet.facetId).to.equal(1);
            expect(fitTypeFacet.displayName).to.equal('Fit Type');
            expect(fitTypeFacet.isRange).to.equal(false);
            expect(fitTypeFacet.facetValues).to.have.lengthOf(1);
            expect(fitTypeFacet.facetValues[0].index).to.equal(0);
            expect(fitTypeFacet.facetValues[0].key).to.equal('Built In');
            expect(fitTypeFacet.facetValues[0].displayName).to.equal('Built In');
            expect(fitTypeFacet.facetValues[0].count).to.equal(3);
            expect(fitTypeFacet.facetValues[0].selected).to.equal(false);
            expect(myResponse.facets.find(f => f.facetId === 2).facetValues).to.be.empty;
            expect(myResponse.facets.find(f => f.facetId === 3).facetValues).to.be.empty;
            expect(myResponse.facets.find(f => f.facetId === 4).facetValues).to.be.empty;
        });
    });
});
