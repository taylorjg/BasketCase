import app from './app.module';

class Controller {
    constructor() {
    }
}

Controller.$inject = [];

const productDetails = {
    selector: 'productDetails',
    templateUrl: 'templates/productDetails.component.html',
    bindings: {
        product: '<'
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(productDetails.selector, productDetails);
