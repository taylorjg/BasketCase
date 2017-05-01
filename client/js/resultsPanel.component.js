import app from './app.module';
import * as C from './constants';

class Controller {
    constructor($rootScope) {
        $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.onSearchResults.bind(this));
    }

    onSearchResults(_, data) {
        this.results = data.hits.hits.map(hit => hit._source);
        this.total = data.hits.total;
    }
}

Controller.$inject = ['$rootScope'];

const resultsPanel = {
    selector: 'resultsPanel',
    templateUrl: 'templates/resultsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(resultsPanel.selector, resultsPanel);
