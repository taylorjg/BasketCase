import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
        this.selectedValues = [];
    }
    onChange(value, selected) {
        console.log(`[facet onChange] value.name: ${value.name}; selected: ${selected}`);
        if (selected) {
            this.selectedValues.push(value.name);
        } else {
            this.selectedValues = this.selectedValues.filter(v => v !== value.name);
        }
        this.SearchService.search({
            filter: {
                field: this.field,
                values: this.selectedValues
            }
        });
    }
}

Controller.$inject = ['SearchService'];

const facet = {
    selector: 'facet',
    templateUrl: 'templates/facet.component.html',
    bindings: {
        label: '<',
        field: '<',
        facetValues: '<'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facet.selector, facet);
