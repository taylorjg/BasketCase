import app from './app.module';
import * as C from './constants';

const formatPriceRange = bucket => {
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

class Controller {
    constructor($rootScope, $sce, SearchService) {
        SearchService.facets();
        this.$sce = $sce;
        $rootScope.$on(C.FACETS_RESULTS_EVENT, this.onFacetsResults.bind(this));
    }

    onFacetsResults(_, data) {
        this.fitType = data.aggregations.all_documents.fitType.buckets.map(bucket => ({
            bucket,
            displayName: this.$sce.trustAsHtml(bucket.key),
            isRange: false
        }));
        this.brand = data.aggregations.all_documents.brand.buckets.map(bucket => ({
            bucket,
            displayName: this.$sce.trustAsHtml(bucket.key),
            isRange: false
        }));
        this.colour = data.aggregations.all_documents.colour.buckets.map(bucket => ({
            bucket,
            displayName: this.$sce.trustAsHtml(bucket.key),
            isRange: false
        }));
        this.price = data.aggregations.all_documents.price.buckets.map(bucket => ({
            bucket,
            displayName: this.$sce.trustAsHtml(formatPriceRange(bucket)),
            isRange: true
        }));
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
