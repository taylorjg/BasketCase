import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
    }
    onSearch(searchText) {
        console.log(`[onSearch] searchText: ${searchText}`);
        this.SearchService.search(searchText);
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
