import app from './app.module'
import * as C from './constants'

class Controller {
  constructor($rootScope, SearchService) {
    this.$rootScope = $rootScope
    this.SearchService = SearchService
    this.searchText = ''
  }

  onSearch(searchText) {
    this.$rootScope.$broadcast(C.RESET_ALL_FACETS_EVENT, false)
    this.SearchService.search({ searchText, currentPage: 1 })
    this.searchText = ''
  }
}

Controller.$inject = ['$rootScope', 'SearchService']

const searchPanel = {
  selector: 'searchPanel',
  templateUrl: 'templates/searchPanel.component.html',
  bindings: {
  },
  controller: Controller,
  controllerAs: 'vm'
}

app.component(searchPanel.selector, searchPanel)
