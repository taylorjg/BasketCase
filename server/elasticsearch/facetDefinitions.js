const priceDisplayNameFormatter = bucket => {
  const gotFrom = Number.isInteger(bucket.from)
  const gotTo = Number.isInteger(bucket.to)
  if (gotFrom && gotTo) {
    return `&pound;${bucket.from} - &pound;${bucket.to}`
  }
  if (gotFrom) {
    return `&pound;${bucket.from} or more`
  }
  if (gotTo) {
    return `&pound;${bucket.to} or less`
  }
  return bucket.key
}

const FACET_DEFINITIONS = [
  {
    facetId: 1,
    aggregationName: 'fitType',
    displayName: 'Fit Type',
    displayNameFormatter: null,
    fieldName: 'FitTypeName.keyword',
    isRange: false
  },
  {
    facetId: 2,
    aggregationName: 'brand',
    displayName: 'Brand',
    displayNameFormatter: null,
    fieldName: 'Brand.keyword',
    isRange: false
  },
  {
    facetId: 3,
    aggregationName: 'colour',
    displayName: 'Colour',
    displayNameFormatter: null,
    fieldName: 'Colour.keyword',
    isRange: false
  },
  {
    facetId: 4,
    aggregationName: 'price',
    displayName: 'Price',
    displayNameFormatter: priceDisplayNameFormatter,
    fieldName: 'Price',
    isRange: true,
    ranges: [
      { 'to': 200 },
      { 'from': 200, 'to': 250 },
      { 'from': 250, 'to': 300 },
      { 'from': 300, 'to': 350 },
      { 'from': 350, 'to': 400 },
      { 'from': 400, 'to': 450 },
      { 'from': 450, 'to': 500 },
      { 'from': 500, 'to': 550 },
      { 'from': 550, 'to': 600 },
      { 'from': 600, 'to': 650 },
      { 'from': 650 }
    ]
  }
]

const FACET_IDS_TO_FIELD_NAMES = FACET_DEFINITIONS.reduce(
  (acc, fd) => {
    acc[fd.facetId] = fd.fieldName
    return acc
  },
  {})

module.exports = {
  FACET_DEFINITIONS,
  FACET_IDS_TO_FIELD_NAMES
}
