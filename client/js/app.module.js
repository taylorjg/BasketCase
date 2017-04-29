import { module } from 'angular';
const app = module('appBasketCase', []);
app.run(['$timeout', 'SearchService', function($timeout, SearchService) {
    $timeout(() => SearchService.getInitialFacets());
}]);
export default app;
