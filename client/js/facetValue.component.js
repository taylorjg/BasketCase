import app from './app.module';

class Controller {
    constructor() {
    }
    // $onInit() {
    //     this.value.selected = false;
    // }
}

Controller.$inject = [];

const facetValue = {
    selector: 'facetValue',
    templateUrl: 'templates/facetValue.component.html',
    bindings: {
        field: '<',
        value: '<',
        onChange: '&'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetValue.selector, facetValue);
