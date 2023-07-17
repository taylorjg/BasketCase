// export const SEARCH_SERVICE_URL = '/api'
export const SEARCH_RESULTS_EVENT = 'SEARCH_RESULTS_EVENT'
export const RESET_ALL_FACETS_EVENT = 'RESET_ALL_FACETS_EVENT'
export const DEFAULT_PAGE_SIZE = 10
export const SORT_BY_PRICE_LOW_TO_HIGH = "price-low-to-high"
export const SORT_BY_PRICE_HIGH_TO_LOW = "price-high-to-low"
export const SORT_BY_AVERAGE_RATING = "average-rating"
export const SORT_BY_REVIEW_COUNT = "review-count"
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
