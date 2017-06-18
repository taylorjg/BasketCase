import { expect } from 'chai';
import * as C from '../js/constants';

const angular = window.angular;

describe('facetsPanel.component', () => {

    let $componentController;
    let $rootScope;

    beforeEach(angular.mock.module('appBasketCase'));

    beforeEach(angular.mock.inject((_$componentController_, _$rootScope_) => {
        $componentController = _$componentController_;
        $rootScope = _$rootScope_;
    }));

    it('construction', () => {
        let invoked = false;
        const searchServiceMock = { search() { invoked = true; } };
        const locals = { SearchService: searchServiceMock };
        const controller = $componentController('facetsPanel', locals);
        expect(controller).to.not.be.undefined;
        expect(controller).to.not.be.null;
        expect(controller.facets).to.be.empty;
        expect(invoked).to.be.true;
    });

    it('broadcasting SEARCH_RESULTS_EVENT populates controller.facets', () => {
        const searchServiceMock = { search: angular.noop };
        const locals = { SearchService: searchServiceMock };
        const controller = $componentController('facetsPanel', locals);
        const eventData = {
            response: {
                facets: []
            }
        };
        $rootScope.$broadcast(C.SEARCH_RESULTS_EVENT, eventData);
        expect(controller.facets).to.equal(eventData.response.facets);
    });

    it('broadcasting RESET_ALL_FACETS_EVENT deselects all facet values', () => {
        const searchServiceMock = { search: angular.noop };
        const locals = { SearchService: searchServiceMock };
        const controller = $componentController('facetsPanel', locals);
        expect(controller).to.not.be.null;
        const doSearchUndefined = undefined;
        $rootScope.$broadcast(C.RESET_ALL_FACETS_EVENT, doSearchUndefined);
    });
    // broadcasting RESET_ALL_FACETS_EVENT with doSearch = false does not invoke SearchService.search()
    // broadcasting RESET_ALL_FACETS_EVENT with doSearch = true invokes SearchService.search()

    // onSearchResultsEvent(_, { response }) {
    //     this.facets = response.facets;
    // }

    // onResetAllFacetsEvent(_, doSearch) {
    //     this.facets.forEach(f => f.facetValues.forEach(v => v.selected = false));
    //     doSearch && this.search();
    // }

    // onFacetSelectionChanged() {
    //     this.search();
    // }

    // onResetAll() {
    //     this.$rootScope.$broadcast(C.RESET_ALL_FACETS_EVENT, true);
    // }

    // anythingSelected() {
    //     return this.facets.some(f => f.facetValues.some(v => v.selected));
    // }
});
