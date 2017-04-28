import app from './app.module';
import * as C from './constants';

class SearchService {
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    getInitialFacets() {
        const url = `${C.SEARCH_SERVICE_URL}/initialFacets`;
        return this.$http.get(url).then(response => response.data);
    }
}

SearchService.$inject = ['$http', '$q'];

app.service(SearchService.name, SearchService);
