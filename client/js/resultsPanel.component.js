import app from './app.module';

class Controller {
    constructor() {
    }
}

Controller.$inject = [];

const resultsPanel = {
    selector: 'resultsPanel',
    templateUrl: 'templates/resultsPanel.component.html',
    bindings: {
    },
    controller: Controller,
    controllerAs: 'vm'
};

app.component(resultsPanel.selector, resultsPanel);
