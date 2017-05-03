import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
        this.selectedValues = [];
    }

    $onChanges() {
        if (this.values) {
            this.selectedValues = this.values.filter(v1 => this.selectedValues.find(v2 => v1.bucket.key === v2.bucket.key));
            this.selectedValues.forEach(v => v.selected = true);
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
        const filter = this.isRange
            ? this.rangeFilter(this.field, value)
            : this.termsFilter(this.field, this.selectedValues);
        this.onFacetSelectionChanged({ field: this.field, filter });
    }
    termsFilter(field, selectedValues) {
        return selectedValues.length
            ? {
                terms: {
                    [field]: selectedValues.map(v => v.bucket.key)
                }
            }
            : null;
    }
    rangeFilter(field, value) {
        return value.selected
            ? {
                range: {
                    [field]: {
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
