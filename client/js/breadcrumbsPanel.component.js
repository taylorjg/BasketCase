import app from './app.module';

class Controller {
    constructor($sce) {
        this.breadcrumbs = [
            {
                text: $sce.trustAsHtml('Home')
            },
            {
                text: $sce.trustAsHtml('Beko, Hotpoint')
            },
            {
                text: $sce.trustAsHtml('&pound;250 - &pound;300')
            }
        ];
    }
}

Controller.$inject = ['$sce'];

const breadcrumbsPanel = {
    selector: 'breadcrumbsPanel',
    templateUrl: 'templates/breadcrumbsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(breadcrumbsPanel.selector, breadcrumbsPanel);
