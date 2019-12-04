export const SEARCH_SERVICE_URL = '/api'
export const SEARCH_RESULTS_EVENT = 'SEARCH_RESULTS_EVENT'
export const RESET_ALL_FACETS_EVENT = 'RESET_ALL_FACETS_EVENT'
export const DEFAULT_PAGE_SIZE = 10
export const SORT_BY_PRICE_LOW_TO_HIGH = 0
export const SORT_BY_PRICE_HIGH_TO_LOW = 1
export const SORT_BY_AVERAGE_RATING = 2
export const SORT_BY_REVIEW_COUNT = 3
export const SORT_OPTIONS = [
  {
    value: SORT_BY_PRICE_LOW_TO_HIGH,
    text: 'Price (Low to High)'
  },
  {
    value: SORT_BY_PRICE_HIGH_TO_LOW,
    text: 'Price (High to Low)'
  },
  {
    value: SORT_BY_AVERAGE_RATING,
    text: 'Average Rating'
  },
  {
    value: SORT_BY_REVIEW_COUNT,
    text: 'Review Count'
  }
]
export const DEFAULT_SORT_BY = SORT_OPTIONS[0]
