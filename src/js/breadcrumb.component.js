import app from './app.module'

class Controller {
  constructor() {
  }
}

Controller.$inject = []

const breadcrumb = {
  selector: 'breadcrumb',
  templateUrl: 'templates/breadcrumb.component.html',
  bindings: {
    breadcrumb: '<'
  },
  controller: Controller,
  controllerAs: 'vm'
}

app.component(breadcrumb.selector, breadcrumb)
