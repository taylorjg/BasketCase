import app from './app.module';
import * as C from './constants';

class Controller {
    constructor($rootScope, SearchService) {
        this.SearchService = SearchService;
        $rootScope.$on(C.RESET_ALL_FACETS_EVENT, this.onResetAllFacetsEvent.bind(this));
    }

    onResetAllFacetsEvent() {
        this.deselectAll();
    }

    onReset() {
        this.deselectAll();
        this.onFacetSelectionChanged();
    }

    onChange() {
        this.onFacetSelectionChanged();
    }

    anythingSelected() {
        return this.facet.facetValues.some(v => v.selected);
    }

    deselectAll() {
        this.facet.facetValues.forEach(v => v.selected = false);
    }
}

Controller.$inject = ['$rootScope', 'SearchService'];

const facet = {
    selector: 'facet',
    templateUrl: 'templates/facet.component.html',
    bindings: {
        facet: '<',
        onFacetSelectionChanged: '&'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facet.selector, facet);
