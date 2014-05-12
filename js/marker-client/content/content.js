(function(angular, app, marker) {

    /**
     * Content Service
     * 
     */
    app.factory('Content', ['$resource', function($resource) {
            var ContentType = $resource(UrlHelper.api('content-types/:id', {id: '@id'}));
            return ContentType;
        }]);


    app.config(['$routeProvider', function($routeProvider) {

            var ctrl = function($scope, $rootScope, Content) {
                $scope.content = Content.query(function() {

                });
            };

            ctrl['$inject'] = ['$scope', '$rootScope', 'Content'];

            $routeProvider.when('/setup/content-types', {
                controller: ctrl,
                templateUrl: marker.path.modules + 'content/views/index.html'
            });
        }]);

})(angular, angular.module('marker-client'), MarkerClient);