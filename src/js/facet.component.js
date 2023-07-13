import app from './app.module'

class Controller {
  constructor() {
  }

  onReset() {
    this.facet.facetValues.forEach(v => v.selected = false)
    this.onFacetSelectionChanged()
  }

  onChange(value) {
    if (this.facet.type === 'single') {
      this.facet.facetValues.forEach(v => v.selected = v === value)
    }
    this.onFacetSelectionChanged()
  }

  anythingSelected() {
    return this.facet.facetValues.some(v => v.selected)
  }
}

Controller.$inject = []

const facet = {
  selector: 'facet',
  templateUrl: 'templates/facet.component.html',
  bindings: {
    facet: '<',
    onFacetSelectionChanged: '&'
  },
  controller: Controller,
  controllerAs: 'vm'
}

app.component(facet.selector, facet)
