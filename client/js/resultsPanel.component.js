import app from './app.module';
import * as C from './constants';

class Controller {
    constructor($rootScope, SearchService) {
        this.SearchService = SearchService;
        this.searchText = "";
        this.results = [];
        this.total = 0;
        this.from = 0;
        this.to = 0;
        this.pageSize = C.RESULTS_PAGE_SIZE;
        this.numPages = 0;
        this.currentPage = 0;
        $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.onSearchResults.bind(this));
    }

    onSearchResults(_, response) {
        const results = response.results;
        this.searchText = results.searchText;
        this.products = results.products;
        this.total = results.total;
        this.from = (results.pageSize * (results.currentPage - 1)) + 1;
        this.to = Math.min((results.pageSize * results.currentPage), results.total);
        this.pageSize = results.pageSize;
        this.numPages = Math.ceil(results.total / results.pageSize);
        this.currentPage = results.currentPage;
    }

    onPageChanged() {
        this.SearchService.changePage(this.pageSize, this.currentPage);
    }    
}

Controller.$inject = ['$rootScope', 'SearchService'];

const resultsPanel = {
    selector: 'resultsPanel',
    templateUrl: 'templates/resultsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(resultsPanel.selector, resultsPanel);
