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
    constructor($rootScope, $sce) {
        this.$sce = $sce;
        $rootScope.$on(C.SEARCH_RESULTS_EVENT, this.onSearchResults.bind(this));
    }

    onSearchResults(_, data) {
        this.fitType = data.aggregations.all_documents.fitType.buckets.map(bucket => ({
            name: bucket.key,
            count: bucket.doc_count
        }));
        this.brand = data.aggregations.all_documents.brand.buckets.map(bucket => ({
            name: bucket.key,
            count: bucket.doc_count
        }));
        this.colour = data.aggregations.all_documents.colour.buckets.map(bucket => ({
            name: bucket.key,
            count: bucket.doc_count
        }));
        this.price = data.aggregations.all_documents.price.buckets.map(bucket => ({
            name: this.$sce.trustAsHtml(formatPriceRange(bucket)),
            count: bucket.doc_count
        }));
    }
}

Controller.$inject = ['$rootScope', '$sce'];

const facetsPanel = {
    selector: 'facetsPanel',
    templateUrl: 'templates/facetsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetsPanel.selector, facetsPanel);
