const fd = require('./facetDefinitions')

const defaultDisplayNameFormatter = bucket => bucket.key

const filterContainsKey = (filter, key) => !!(filter && filter.keys.find(k => k === key))

const bucketToCommonFacetValue = (filter, bucket, index, displayNameFormatter) => ({
  index: index,
  displayName: (displayNameFormatter || defaultDisplayNameFormatter)(bucket),
  key: bucket.key,
  count: bucket.doc_count,
  selected: filterContainsKey(filter, bucket.key)
})

const bucketToTermsFacetValue = (filter, displayNameFormatter) => (bucket, index) =>
  bucketToCommonFacetValue(filter, bucket, index, displayNameFormatter)

const bucketToRangeFacetValue = (filter, displayNameFormatter) => (bucket, index) => {
  const facetValue = bucketToCommonFacetValue(filter, bucket, index, displayNameFormatter)
  facetValue.from = bucket.from
  facetValue.to = bucket.to
  return facetValue
}

const bucketsToTermsFacetValues = (filter, buckets, displayNameFormatter) =>
  buckets.map(bucketToTermsFacetValue(filter, displayNameFormatter))

const bucketsToRangeFacetValues = (filter, buckets, displayNameFormatter) =>
  buckets
    .filter(bucket => bucket.doc_count)
    .map(bucketToRangeFacetValue(filter, displayNameFormatter))

const elasticsearchHitsToMyResults = hits => ({
  total: hits.total,
  products: hits.hits.map(hit => hit._source)
})

const elasticsearchAggsToMyFacets = (aggs, filters) => {
  const myFacets = fd.FACET_DEFINITIONS.map(fd => {
    const filter = filters && filters.find(f => f.facetId === fd.facetId)
    const agg = aggs[fd.aggregationName][fd.aggregationName]
    const bucketsToFacetValuesFn = fd.isRange ? bucketsToRangeFacetValues : bucketsToTermsFacetValues
    return {
      facetId: fd.facetId,
      isRange: fd.isRange,
      displayName: fd.displayName,
      facetValues: bucketsToFacetValuesFn(filter, agg.buckets, fd.displayNameFormatter)
    }
  })
  return Array.prototype.concat.apply([], myFacets)
}

const elasticsearchResponseToMyResponse = (response, filters) => ({
  results: elasticsearchHitsToMyResults(response.hits),
  facets: elasticsearchAggsToMyFacets(response.aggregations.global, filters)
})

module.exports = {
  elasticsearchResponseToMyResponse,
}
