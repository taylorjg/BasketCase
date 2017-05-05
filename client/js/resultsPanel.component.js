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

    onSearchResults(_, data) {
        this.searchText = data.hits.searchText;
        this.results = data.hits.hits.map(hit => hit._source);
        this.total = data.hits.total;
        this.from = (data.hits.pageSize * (data.hits.currentPage - 1)) + 1;
        this.to = Math.min((data.hits.pageSize * data.hits.currentPage), data.hits.total);
        this.pageSize = data.hits.pageSize;
        this.numPages = Math.ceil(data.hits.total / data.hits.pageSize);
        this.currentPage = data.hits.currentPage;
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
