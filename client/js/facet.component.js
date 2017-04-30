import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
    }
    onClick(field, value) {
        console.log(`[onClick] field: ${field}; value: ${value}`);
        this.SearchService.search({
            filter: {
                field,
                value
            }
        });
    }
}

Controller.$inject = ['SearchService'];

const facet = {
    selector: 'facet',
    templateUrl: 'templates/facet.component.html',
    bindings: {
        facet: '<',
        field: '<'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facet.selector, facet);
