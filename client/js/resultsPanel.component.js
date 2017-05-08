import app from './app.module';
import * as C from './constants';

class Controller {
    constructor($rootScope, SearchService) {
        this.SearchService = SearchService;
        this.searchText = "";
        this.products = [];
        this.total = 0;
        this.from = 0;
        this.to = 0;
        this.pageSize = C.RESULTS_PAGE_SIZE;
        this.numPages = 0;
        this.currentPage = 0;
        $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.onSearchResultsEvent.bind(this));
    }

    onSearchResultsEvent(_, { searchOptions, response }) {
        this.searchText = searchOptions.searchText;
        this.pageSize = searchOptions.pageSize;
        this.numPages = Math.ceil(response.results.total / searchOptions.pageSize);
        this.currentPage = searchOptions.currentPage;
        this.products = response.results.products;
        this.total = response.results.total;
        this.from = (searchOptions.pageSize * (searchOptions.currentPage - 1)) + 1;
        this.to = Math.min((searchOptions.pageSize * searchOptions.currentPage), response.results.total);
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
