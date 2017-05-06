import app from './app.module';
import * as C from './constants';

class Controller {
    constructor($rootScope, SearchService) {
        this.SearchService = SearchService;
        this.selectedValues = [];
        $rootScope.$on(C.RESET_ALL_FACETS_EVENT, this.onResetAllFacetsEvent.bind(this));
    }

    $onChanges() {
        const valueWasPreviouslySelected = nv => this.selectedValues.find(ov => nv.key === ov.key);
        this.selectedValues = this.selectedValues.filter(v => v.selected);
        if (this.facet && this.facet.facetValues) {
            const oldSelectedValuesCount = this.selectedValues.length;
            this.selectedValues = this.facet.facetValues.filter(valueWasPreviouslySelected);
            this.selectedValues.forEach(v => v.selected = true);
            const newSelectedValuesCount = this.selectedValues.length;
            if (newSelectedValuesCount < oldSelectedValuesCount) {
                const filter = this.buildFilter();
                this.onFacetSelectionChanged({ facetId: this.facet.id, filter });
            }
        }
    }

    onChange(value) {
        if (value.selected) {
            if (this.facet.isRange) {
                this.selectedValues.forEach(v => v.selected = false);
                this.selectedValues = [value];
            } else {
                this.selectedValues.push(value);
            }
        } else {
            this.selectedValues = this.selectedValues.filter(v => v !== value);
        }
        const filter = this.buildFilter();
        this.onFacetSelectionChanged({ facetId: this.facet.id, filter });
    }

    onReset() {
        this.selectedValues.forEach(v => v.selected = false);
        this.selectedValues = [];
        this.onFacetSelectionChanged({ facetId: this.facet.id, filter: null });
    }

    onResetAllFacetsEvent() {
        this.selectedValues.forEach(v => v.selected = false);
        this.selectedValues = [];
    }

    buildFilter() {
        return this.facet.isRange
            ? this.rangeFilter()
            : this.termsFilter();
    }

    termsFilter() {
        return this.selectedValues.length
            ? {
                type: 'terms',
                facetId: this.facet.id,
                keys: this.selectedValues.map(sv => sv.key)
            }
            : null;
    }

    rangeFilter() {
        const selectedValue = this.selectedValues.length === 1 ? this.selectedValues[0] : null;
        return selectedValue
            ? {
                type: 'range',
                facetId: this.facet.id,
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
