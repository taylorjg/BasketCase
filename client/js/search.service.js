import app from './app.module';
import * as C from './constants';

class SearchService {
    constructor($http, $rootScope) {
        this.$http = $http;
        this.$rootScope = $rootScope;
    }

    getInitialFacets() {
        const url = `${C.SEARCH_SERVICE_URL}/initialFacets`;
        return this.$http.get(url)
            .then(response => this.$rootScope.$broadcast(C.SEARCH_RESULTS_EVENT, response.data));
    }
}

SearchService.$inject = ['$http', '$rootScope'];

app.service(SearchService.name, SearchService);
