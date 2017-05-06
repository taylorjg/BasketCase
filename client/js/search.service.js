import app from './app.module';
import * as C from './constants';

class SearchService {
    constructor($rootScope, $http) {
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.lastSearchOptions = {};
    }

    search(searchOptions) {
        // TODO: protect against multiple in-flight searches (e.g. add a flag)

        searchOptions = searchOptions || {};
        searchOptions.pageSize = searchOptions.pageSize || C.RESULTS_PAGE_SIZE;
        searchOptions.currentPage = searchOptions.currentPage || 1;
        const url = `${C.SEARCH_SERVICE_URL}/search`;
        return this.$http
            .post(url, searchOptions)
            .then(response => this.$rootScope.$broadcast(C.SEARCH_RESULTS_EVENT, response.data))
            .then(() => this.lastSearchOptions = searchOptions);
    }

    changePage(pageSize, currentPage) {
        const searchOptions = Object.assign({}, this.lastSearchOptions);
        searchOptions.pageSize = pageSize;
        searchOptions.currentPage = currentPage;
        this.search(searchOptions);
    }
}

SearchService.$inject = ['$rootScope', '$http'];

app.service(SearchService.name, SearchService);
