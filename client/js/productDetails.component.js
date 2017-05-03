import app from './app.module';

class Controller {
    constructor() {
    }
    $onInit() {
        const brand = this.product.Brand.toLowerCase();
        const brandUrl = `url('//content.ao.com/Themes/Clients/AOL/Images/brands/large/${brand}.png')`;
        this.background = {
            'background': brandUrl,
            'background-repeat': 'no-repeat',
            'background-size': 'contain',
        };
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
