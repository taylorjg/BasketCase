import app from './app.module'
import path from 'path'

class Controller {
  constructor() {
  }
  $onInit() {
    const brand = this.product.Brand.toLowerCase()
    const brandUrl = `url('assets/brand-images/${brand}.png')`
    this.background = {
      'background': brandUrl,
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
    }
    const productImageBasename = path.basename(this.product.Image)
    this.productImageUrl = `assets/product-images/${productImageBasename}`
  }
}

Controller.$inject = []

const productDetails = {
  selector: 'productDetails',
  templateUrl: 'templates/productDetails.component.html',
  bindings: {
    product: '<'
  },
  controller: Controller,
  controllerAs: 'vm'
}

app.component(productDetails.selector, productDetails)
