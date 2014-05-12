(function(angular, app, marker) {

    var _url = 'settings';

    var url = function(suffix) {
        return '/' + _url + '/' + (suffix || '');
    };

    var path = function(suffix) {
        return marker.path.modules + _url + '/' + (suffix || '');
    };

    app.config(['$routeProvider', function($routeProvider) {
            $routeProvider
                    .when(url(), {
                        controller: SettingsCtrl,
                        templateUrl: path('views/index.html')
                    })
                    .when(url('connections'), {
                        controller: ConnectionsCtrl,
                        templateUrl: path('views/connections.html')
                    })
                    .when(url('config'), {
                        controller: ConfigCtrl,
                        templateUrl: path('views/config.html')
                    })
                    ;
        }]);

    app.factory('Connections', ['$resource', function($resource) {
            var Connection = new $resource(marker.path.api + 'connections/:name', {name: '@name'});
            return Connection;
        }]);

    app.factory('Config', ['$resource', function($resource) {
            var Config = new $resource(marker.path.api + 'config/:key', {key: '@key'});
            return Config;
        }]);

    /**
     * Settings Controller
     * @param {type} $scope
     * @returns {_L1.SettingsCtrl}
     */
    function SettingsCtrl($scope) {
        console.log('in settings controller');
    }
    SettingsCtrl['$inject'] = ['$scope'];

    /**
     * Connections Controller
     * @param {type} $scope
     * @param {type} Connections
     * @returns {_L1.ConnectionsCtrl}
     */
    function ConnectionsCtrl($scope, Connections) {
        $scope.connections = Connections.query();
    }

    ConnectionsCtrl['$inject'] = ['$scope', 'Connections'];
    
    function ConfigCtrl($scope, Config){
        $scope.config = Config.query();
    }
    ConfigCtrl['$inject'] = ['$scope', 'Config'];

})(angular, angular.module('marker-client'), MarkerClient);