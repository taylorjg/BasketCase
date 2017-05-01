import app from './app.module';
import * as C from './constants';

class SearchService {
    constructor($http, $rootScope) {
        this.$http = $http;
        this.$rootScope = $rootScope;
    }

    facets() {
        const url = `${C.SEARCH_SERVICE_URL}/facets`;
        return this.$http.get(url)
            .then(response => {
                this.$rootScope.$broadcast(C.FACETS_RESULTS_EVENT, response.data);
                this.$rootScope.$broadcast(C.SEARCH_RESULTS_EVENT, response.data);
            });
    }

    search(searchOptions) {
        const url = `${C.SEARCH_SERVICE_URL}/search`;
        const data = searchOptions || {};
        return this.$http.post(url, data)
            .then(response => this.$rootScope.$broadcast(C.SEARCH_RESULTS_EVENT, response.data));
    }
}

SearchService.$inject = ['$http', '$rootScope'];

app.service(SearchService.name, SearchService);
