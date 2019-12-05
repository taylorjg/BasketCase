import app from './app.module'

class Controller {
  constructor($sce) {
    this.$sce = $sce
  }

  getLabel() {
    return this.$sce.trustAsHtml(`${this.value.displayName} (${this.value.count})`)
  }
}

Controller.$inject = ['$sce']

const facetValue = {
  selector: 'facetValue',
  templateUrl: 'templates/facetValue.component.html',
  bindings: {
    facetId: '<',
    value: '<',
    isRange: '<',
    onChange: '&'
  },
  controller: Controller,
  controllerAs: 'vm'
}

app.component(facetValue.selector, facetValue)
