import { module } from 'angular';
const app = module('appBasketCase', []);
app.run(['$timeout', 'SearchService', function($timeout, SearchService) {
    $timeout(() => SearchService.search());
}]);
export default app;
