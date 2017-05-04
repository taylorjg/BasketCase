import app from './app.module';
import * as C from './constants';

const formatPriceKey = bucket => {
    const gotFrom = Number.isInteger(bucket.from);
    const gotTo = Number.isInteger(bucket.to);
    if (gotFrom && gotTo) {
        return `&pound;${bucket.from} - &pound;${bucket.to}`;
    }
    if (gotFrom) {
        return `&pound;${bucket.from} or more`;
    }
    if (gotTo) {
        return `&pound;${bucket.to} or less`;
    }
    return bucket.key;
};

const formatDisplayName = ($sce, name, count) => $sce.trustAsHtml(`${name} (${count})`);

class Controller {
    constructor($rootScope, $sce, SearchService) {
        this.$sce = $sce;
        this.SearchService = SearchService;
        this.filters = new Map();
        $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.updateFacets.bind(this));
        SearchService.search();
    }

    updateFacets(_, data) {
        this.fitType = data.aggregations.global.fitType.fitType.buckets.map(bucket => ({
            bucket,
            displayName: formatDisplayName(this.$sce, bucket.key, bucket.doc_count)
        }));
        this.brand = data.aggregations.global.brand.brand.buckets.map(bucket => ({
            bucket,
            displayName: formatDisplayName(this.$sce, bucket.key, bucket.doc_count)
        }));
        this.colour = data.aggregations.global.colour.colour.buckets.map(bucket => ({
            bucket,
            displayName: formatDisplayName(this.$sce, bucket.key, bucket.doc_count)
        }));
        this.price = data.aggregations.global.price.price.buckets.filter(bucket => bucket.doc_count > 0).map(bucket => ({
            bucket,
            displayName: formatDisplayName(this.$sce, formatPriceKey(bucket), bucket.doc_count)
        }));
    }

    onFacetSelectionChanged(field, filter) {
        if (filter) {
            this.filters.set(field, filter);
        } else {
            this.filters.delete(field);
        }
        this.search();
    }

    search() {
        const filters = Array.from(this.filters.values());
        const searchOptions = { filters };
        this.SearchService.search(searchOptions);
    }
}

Controller.$inject = ['$rootScope', '$sce', 'SearchService'];

const facetsPanel = {
    selector: 'facetsPanel',
    templateUrl: 'templates/facetsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetsPanel.selector, facetsPanel);
