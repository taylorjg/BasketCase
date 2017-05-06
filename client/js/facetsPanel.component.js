import app from './app.module';
import * as C from './constants';

class Controller {
    constructor($rootScope, $sce, SearchService) {
        this.$rootScope = $rootScope;
        this.$sce = $sce;
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

    onSearchResultsEvent(_, response) {
        this.fitType = this.getFacet(response, 1);
        this.brand = this.getFacet(response, 2);
        this.colour = this.getFacet(response, 3);
        this.price = this.getFacet(response, 4);
    }

    onFacetSelectionChanged(id, filter) {
        if (filter) {
            this.filters.set(id, filter);
        } else {
            this.filters.delete(id);
        }
        this.search();
    }

    onResetAllFacetsEvent(_, doSearch) {
        this.filters.clear();
        doSearch && this.search();
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
        const f = response.facets.find(f => f.id === id);
        f.values.forEach(v => v.text = this.$sce.trustAsHtml(`${v.displayName} (${v.count})`));
        return f;
    }
}

Controller.$inject = ['$rootScope', '$sce', 'SearchService'];

const facetsPanel = {
    selector: 'facetsPanel',
    templateUrl: 'templates/facetsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetsPanel.selector, facetsPanel);
