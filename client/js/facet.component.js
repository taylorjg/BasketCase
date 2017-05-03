import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
        this.selectedValues = [];
    }
    onChange(value) {
        if (value.selected) {
            if (value.isRange) {
                this.selectedValues.forEach(v => v.selected = false);
                this.selectedValues = [value];
            } else {
                this.selectedValues.push(value);
            }
        } else {
            this.selectedValues = this.selectedValues.filter(v => v !== value);
        }
        const searchOptions = value.isRange
            ? this.rangeFilter(this.field, value)
            : this.termFilter(this.field, this.selectedValues);
        this.SearchService.search(searchOptions);
    }
    termFilter(field, selectedValues) {
        return {
            filter: {
                field,
                values: selectedValues.map(v => v.bucket.key)
            }
        };
    }
    rangeFilter(field, value) {
        return value.selected
            ? {
                filter: {
                    field,
                    range: {
                        from: value.bucket.from,
                        to: value.bucket.to
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
        values: '<'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facet.selector, facet);
