import app from './app.module'
import * as C from './constants'

class Controller {
  constructor($rootScope, SearchService) {
    this.SearchService = SearchService
    this.searchText = ""
    this.sortOptions = C.SORT_OPTIONS
    this.sortBy = C.DEFAULT_SORT_BY
    this.products = []
    this.total = 0
    this.from = 0
    this.to = 0
    this.pageSize = C.DEFAULT_PAGE_SIZE
    this.numPages = 0
    this.currentPage = 0
    $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.onSearchResultsEvent.bind(this))
  }

  onSearchResultsEvent(_, { searchOptions, response }) {
    this.total = response.results.total.value || response.results.total
    this.sortBy = this.lookupSortOption(searchOptions.sortBy)
    this.searchText = searchOptions.searchText
    this.pageSize = searchOptions.pageSize
    this.numPages = Math.ceil(this.total / searchOptions.pageSize)
    this.currentPage = searchOptions.currentPage
    this.products = response.results.products
    this.from = (searchOptions.pageSize * (searchOptions.currentPage - 1)) + 1
    this.to = Math.min((searchOptions.pageSize * searchOptions.currentPage), this.total)
  }

  onSortByChanged() {
    this.SearchService.changeSortBy(this.sortBy.value)
  }

  onPageChanged() {
    this.SearchService.changePage(this.pageSize, this.currentPage)
  }

  lookupSortOption(value) {
    return this.sortOptions.find(so => so.value === value) || C.DEFAULT_SORT_BY
  }
}

Controller.$inject = ['$rootScope', 'SearchService']

const resultsPanel = {
  selector: 'resultsPanel',
  templateUrl: 'templates/resultsPanel.component.html',
  bindings: {
  },
  controller: Controller,
  controllerAs: 'vm'
}

app.component(resultsPanel.selector, resultsPanel)
