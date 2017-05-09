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

    onChange() {
        const filter = this.buildFilter();
        this.onFacetSelectionChanged({ facetId: this.facet.id, filter });
    }

    onReset() {
        this.deselectAll();
        this.onFacetSelectionChanged({ facetId: this.facet.id, filter: null });
    }

    deselectAll() {
        this.facet.facetValues.forEach(v => v.selected = false);
    }

    anythingSelected() {
        return this.facet.facetValues && this.facet.facetValues.some(v => v.selected);
    }

    buildFilter() {
        const selectedValues = this.facet.facetValues.filter(v => v.selected);
        return this.facet.isRange
            ? this.rangeFilter(selectedValues)
            : this.termsFilter(selectedValues);
    }

    termsFilter(selectedValues) {
        return selectedValues.length
            ? {
                type: 'terms',
                facetId: this.facet.id,
                keys: selectedValues.map(v => v.key)
            }
            : null;
    }

    rangeFilter(selectedValues) {
        const selectedValue = selectedValues.length === 1 ? selectedValues[0] : null;
        return selectedValue
            ? {
                type: 'range',
                facetId: this.facet.id,
                keys: [selectedValue.key],
                from: selectedValue.from,
                to: selectedValue.to
            }
            : null;
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
