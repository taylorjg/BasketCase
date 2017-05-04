import app from './app.module';

class Controller {
    constructor() {
    }
}

Controller.$inject = [];

const facetValue = {
    selector: 'facetValue',
    templateUrl: 'templates/facetValue.component.html',
    bindings: {
        field: '<',
        value: '<',
        isRange: '<',
        onChange: '&'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetValue.selector, facetValue);
