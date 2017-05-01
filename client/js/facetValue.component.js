import app from './app.module';

class Controller {
    constructor() {
        this.selected = false;
    }
}

Controller.$inject = [];

const facetValue = {
    selector: 'facetValue',
    templateUrl: 'templates/facetValue.component.html',
    bindings: {
        value: '<',
        onChange: '&'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetValue.selector, facetValue);
