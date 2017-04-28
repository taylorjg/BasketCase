import app from './app.module';

class Controller {
    constructor(SearchService) {
        this.SearchService = SearchService;
        this.initialFacets = SearchService.getInitialFacets()
            .then(data => {
                this.brands = data.all_documents.brands.buckets.map(bucket => ({
                    name: bucket.key,
                    count: bucket.doc_count
                }));
                this.colours = data.all_documents.colours.buckets.map(bucket => ({
                    name: bucket.key,
                    count: bucket.doc_count
                }));
            });
    }
}

Controller.$inject = ['SearchService'];

const facetsPanel = {
    selector: 'facetsPanel',
    templateUrl: 'templates/facetsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(facetsPanel.selector, facetsPanel);
