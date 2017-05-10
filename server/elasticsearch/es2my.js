const fd = require('./facetDefinitions');

const defaultDisplayNameFormatter = bucket => bucket.key;

const filterContainsKey = (filter, key) => !!(filter && filter.keys.find(k => k === key));

const bucketToCommonFacetValue = (filter, bucket, index, displayNameFormatter) => ({
    index: index,
    displayName: (displayNameFormatter || defaultDisplayNameFormatter)(bucket),
    key: bucket.key,
    count: bucket.doc_count,
    selected: filterContainsKey(filter, bucket.key)
});

const bucketToTermsFacetValue = (filter, displayNameFormatter) => (bucket, index) =>
    bucketToCommonFacetValue(filter, bucket, index, displayNameFormatter);

const bucketToRangeFacetValue = (filter, displayNameFormatter) => (bucket, index) => {
    const facetValue = bucketToCommonFacetValue(filter, bucket, index, displayNameFormatter);
    facetValue.from = bucket.from;
    facetValue.to = bucket.to;
    return facetValue;
};

const bucketsToTermsFacetValues = (filter, buckets, displayNameFormatter) =>
    buckets.map(bucketToTermsFacetValue(filter, displayNameFormatter));

const bucketsToRangeFacetValues = (filter, buckets, displayNameFormatter) =>
    buckets
        .filter(bucket => bucket.doc_count)
        .map(bucketToRangeFacetValue(filter, displayNameFormatter));

const aggToTermsFacet = (filters, agg, facetId, displayName, displayNameFormatter) => {
    const filter = filters.find(f => f.facetId === facetId);
    return {
        facetId,
        isRange: false,
        displayName,
        facetValues: bucketsToTermsFacetValues(filter, agg.buckets, displayNameFormatter)
    };
};

const aggToRangeFacet = (filters, agg, facetId, displayName, displayNameFormatter) => {
    const filter = filters.find(f => f.facetId === facetId);
    return {
        facetId,
        isRange: true,
        displayName,
        facetValues: bucketsToRangeFacetValues(filter, agg.buckets, displayNameFormatter)
    };
};

const hitToResult = hit => hit._source;

const elasticsearchHitsToMyResults = hits => ({
    total: hits.total,
    products: hits.hits.map(hitToResult)
});

const elasticsearchAggsToMyFacets = (aggs, filters) => {
    const myFacets = fd.FACET_DEFINITIONS.map(fd => {
        const agg = aggs[fd.aggregationName][fd.aggregationName];
        const aggToFacetFn = fd.isRange ? aggToRangeFacet : aggToTermsFacet;
        return aggToFacetFn(filters, agg, fd.facetId, fd.displayName, fd.displayNameFormatter);
    });
    return Array.prototype.concat.apply([], myFacets);
};

const elasticsearchResponseToMyResponse = (response, filters) => ({
    results: elasticsearchHitsToMyResults(response.hits),
    facets: elasticsearchAggsToMyFacets(response.aggregations.global, filters)
});

module.exports = {
    elasticsearchResponseToMyResponse,
};
