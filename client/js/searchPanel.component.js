import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
    }
}

Controller.$inject = ['SearchService'];

const searchPanel = {
    selector: 'searchPanel',
    templateUrl: 'templates/searchPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(searchPanel.selector, searchPanel);
