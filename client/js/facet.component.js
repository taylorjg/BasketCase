import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
        this.selectedValues = [];
    }

    $onChanges() {
        const valueWasPreviouslySelected = nv => this.selectedValues.find(ov => nv.bucket.key === ov.bucket.key);
        this.selectedValues = this.selectedValues.filter(v => v.selected);
        if (this.values) {
            const oldSelectedValuesCount = this.selectedValues.length;
            this.selectedValues = this.values.filter(valueWasPreviouslySelected);
            this.selectedValues.forEach(v => v.selected = true);
            const newSelectedValuesCount = this.selectedValues.length;
            if (newSelectedValuesCount < oldSelectedValuesCount) {
                const filter = this.buildFilter();
                this.onFacetSelectionChanged({ field: this.field, filter });
            }
        }
    }

    onChange(value) {
        if (value.selected) {
            if (this.isRange) {
                this.selectedValues.forEach(v => v.selected = false);
                this.selectedValues = [value];
            } else {
                this.selectedValues.push(value);
            }
        } else {
            this.selectedValues = this.selectedValues.filter(v => v !== value);
        }
        const filter = this.buildFilter();
        this.onFacetSelectionChanged({ field: this.field, filter });
    }

    onReset() {
        this.selectedValues.forEach(v => v.selected = false);
        this.selectedValues = [];
        this.onFacetSelectionChanged({ field: this.field, filter: null });
    }

    buildFilter() {
        return this.isRange
            ? this.rangeFilter()
            : this.termsFilter();
    }

    termsFilter() {
        return this.selectedValues.length
            ? {
                terms: {
                    [this.field]: this.selectedValues.map(v => v.bucket.key)
                }
            }
            : null;
    }

    rangeFilter() {
        const value = this.selectedValues.length === 1 ? this.selectedValues[0] : null;
        return value && value.selected
            ? {
                range: {
                    [this.field]: {
                        gte: value.bucket.from,
                        lt: value.bucket.to
                    }
                }
            }
            : null;
    }
}

Controller.$inject = ['SearchService'];

const facet = {
    selector: 'facet',
    templateUrl: 'templates/facet.component.html',
    bindings: {
        label: '<',
        field: '<',
        values: '<',
        isRange: '<',
        onFacetSelectionChanged: '&'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facet.selector, facet);
