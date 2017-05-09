import app from './app.module';
import * as C from './constants';

class Controller {
    constructor($rootScope, SearchService) {
        this.$rootScope = $rootScope;
        this.SearchService = SearchService;
        this.fitType = [];
        this.brand = [];
        this.colour = [];
        this.price = [];
        this.filters = new Map();
        $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.onSearchResultsEvent.bind(this));
        $rootScope.$on(C.RESET_ALL_FACETS_EVENT, this.onResetAllFacetsEvent.bind(this));
        SearchService.search();
    }

    onSearchResultsEvent(_, { response }) {
        this.fitType = this.getFacet(response, C.FACET_ID_FIT_TYPE);
        this.brand = this.getFacet(response, C.FACET_ID_BRAND);
        this.colour = this.getFacet(response, C.FACET_ID_COLOUR);
        this.price = this.getFacet(response, C.FACET_ID_PRICE);
    }

    onResetAllFacetsEvent(_, doSearch) {
        this.filters.clear();
        doSearch && this.search();
    }

    onFacetSelectionChanged(facetId, filter) {
        if (filter) {
            this.filters.set(facetId, filter);
        } else {
            this.filters.delete(facetId);
        }
        this.search();
    }

    onResetAll() {
        this.$rootScope.$broadcast(C.RESET_ALL_FACETS_EVENT, true);
    }

    search() {
        const filters = Array.from(this.filters.values());
        const searchOptions = { filters, currentPage: 1 };
        this.SearchService.search(searchOptions);
    }

    getFacet(response, id) {
        return response.facets.find(f => f.id === id);
    }
}

Controller.$inject = ['$rootScope', 'SearchService'];

const facetsPanel = {
    selector: 'facetsPanel',
    templateUrl: 'templates/facetsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetsPanel.selector, facetsPanel);
