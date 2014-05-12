/**
 * @namespace marker-client.explorer
 * @requires marker-client.settings
 * @description Entity and Content Types Explorer
 * 
 * @param Object angular
 * @param Object app
 * @param Object marker
 */
(function(angular, app, marker) {

    var _url = 'explorer';

    var url = function(suffix) {
        return '/' + _url + '/' + (suffix || '');
    };

    var path = function(suffix) {
        return marker.path.modules + _url + '/' + (suffix || '');
    };

    app.config(['$routeProvider', function($routeProvider) {
            $routeProvider
                    .when(url(), {
                        controller: ExplorerCtrl,
                        templateUrl: path('views/index.html')
                    })
                    .when(url('entities'), {
                        controller: EntitiesCtrl,
                        templateUrl: path('views/entities.html')
                    })
                    .when(url('entity/:connection/:entity'), {
                        controller: EntityCtrl,
                        templateUrl: path('views/entity.html')
                    })

                    ;
        }]);

    app.factory('Entities', ['$resource', function($resource) {
            var Service = new $resource(marker.path.api + 'schema/tables/:connection/:table', {table: '@table'});
            return Service;
        }]);

    app.factory('ContentTypes', ['$resource', function($resource) {
            var Service = new $resource(marker.path.api + 'content-types', {connection: '@connection'});
            return Service;
        }]);


    /**
     * Settings Controller
     * @param {type} $scope
     * @returns {_L1.SettingsCtrl}
     */
    function ExplorerCtrl($scope) {
        console.log('in explorer controller');
    }
    ExplorerCtrl['$inject'] = ['$scope'];

    function EntitiesCtrl($scope, Entities, Connections, $modal) {
        $scope.connections = Connections.query();

        $scope.getEntities = function() {
            if (!$scope.connection)
                return;

            $scope.entities = Entities.query({connection: $scope.connection.name});
        };

        $scope.showEntity = function(entity) {
            var modalInstance = $modal.open({
                templateUrl: path('views/entity-schema.html'),
                controller: function($scope, $modalInstance, schema, connection) {

                    $scope.schema = schema;
                    $scope.connection = connection;

                    $scope.ok = function() {
                        $modalInstance.close($scope.selected.item);
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    schema: function() {
                        return Entities.get({
                            connection: $scope.connection.name,
                            table: entity.table
                        });
                    },
                    connection: function() {
                        return $scope.connection;
                    }

                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
//                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
    EntitiesCtrl['$inject'] = ['$scope', 'Entities', 'Connections', '$modal'];


    function EntityCtrl($scope, $routeParams, ContentTypes, Connections, Entities) {

        $scope.connection = Connections.get({name: $routeParams.connection});

        $scope.entity = Entities.get({
            connection: $routeParams.connection,
            table: $routeParams.entity
        });

        $scope.ctypes = ContentTypes.query({connection: $routeParams.connection});

        $scope.types = [
            {name: 'String', group: 'Native'},
            {name: 'Number', group: 'Native'},
            {name: 'Boolean', group: 'Native'},
            {name: 'Linked', group: 'List'}
        ];

    }
    EntityCtrl['$inject'] = ['$scope', '$routeParams', 'ContentTypes', 'Connections', 'Entities'];

})(angular, angular.module('marker-client'), MarkerClient);