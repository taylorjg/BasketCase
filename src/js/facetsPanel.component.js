import app from './app.module'
import * as C from './constants'

class Controller {
  constructor($rootScope, SearchService) {
    this.$rootScope = $rootScope
    this.SearchService = SearchService
    this.facets = []
    $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.onSearchResultsEvent.bind(this))
    $rootScope.$on(C.RESET_ALL_FACETS_EVENT, this.onResetAllFacetsEvent.bind(this))
    SearchService.search()
  }

  onSearchResultsEvent(_, { response }) {
    this.facets = response.facets
  }

  onResetAllFacetsEvent(_, doSearch) {
    this.facets.forEach(f => f.facetValues.forEach(v => v.selected = false))
    doSearch && this.search()
  }

  onFacetSelectionChanged() {
    this.search()
  }

  onResetAll() {
    this.$rootScope.$broadcast(C.RESET_ALL_FACETS_EVENT, true)
  }

  anythingSelected() {
    return this.facets.some(f => f.facetValues.some(v => v.selected))
  }

  search() {
    const filters = this.buildFilters()
    const searchOptions = { filters, currentPage: 1 }
    this.SearchService.search(searchOptions)
  }

  buildFilters() {
    return this.facets
      .map(this.buildFilter.bind(this))
      .filter(f => f)
  }

  buildFilter(facet) {
    const selectedValues = facet.facetValues.filter(v => v.selected)
    return facet.type === 'single'
      ? this.singleFilter(facet, selectedValues)
      : this.multiFilter(facet, selectedValues)
  }

  singleFilter(facet, selectedValues) {
    const selectedValue = selectedValues.length === 1 ? selectedValues[0] : null
    return selectedValue
      ? {
        name: facet.name,
        keys: [selectedValue.key],
      }
      : null
  }

  multiFilter(facet, selectedValues) {
    return selectedValues.length > 0
      ? {
        name: facet.name,
        keys: selectedValues.map(v => v.key)
      }
      : null
  }
}

Controller.$inject = ['$rootScope', 'SearchService']

const facetsPanel = {
  selector: 'facetsPanel',
  templateUrl: 'templates/facetsPanel.component.html',
  bindings: {
  },
  controller: Controller,
  controllerAs: 'vm'
}

app.component(facetsPanel.selector, facetsPanel)
