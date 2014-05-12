var app = angular.module('marker-client.modules', []);
var viewEnginePath = function(view, id) {
    return path.api + 'partials/module/' + view + '/' + id;
}

function correctTypes(row) {
    var newRow = {};
    for (var i in row) {
        if (!(isNaN(row[i]))) {
            newRow[i] = +row[i];
        } else {
            newRow[i] = row[i];
        }
    }
    return newRow;
}

app.controller('ModulesIndexCtrl',
        ['$scope', '$http', '$routeParams', '$route', '$compile', '$filter', 'ngTableParams',
            function($scope, $http, $routeParams, $route, $compile, $filter, ngTableParams) {
                $scope.working = true;

                $route.current.templateUrl = viewEnginePath('index', $routeParams.id);

                $http.get($route.current.templateUrl).success(function(data) {
                    $http.get(path.api + 'modules/' + $routeParams.id).success(function(r) {

                        $scope.tableParams = new ngTableParams({
                            page: 1,
                            count: 50
//                    sorting: {
//                        id: 'asc'     // initial sorting
//                    }
//                    ,
//                    filter: {
//                        title: 'M'       // initial filter
//                    }
                        },
                        {
                            total: r.data.length,
                            getData: function($defer, params) {
                                // use build-in angular filter
                                var descOrder = false;
                                if (params.orderBy()[0]) {
                                    // get the first charachter of first item
                                    // e.g. ['+id'] ==> '+'
                                    descOrder = params.orderBy()[0][0] === '-';
                                }
                                var orderedData = params.sorting() ? //params.orderBy()
                                        $filter('orderBy')(r.data, function(item) {
                                    var predicate = params.orderBy();
                                    if (!predicate.length)
                                        return;
                                    var field = predicate[0].slice(1);
                                    // detect if number 
                                    if (isNaN(item[field])) {
                                        return item[field];
                                    } else {
                                        return Number(item[field]);
                                    }
                                }, descOrder) :
                                        r.data;
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });

                        $('#view').html($compile(data)($scope));
                        $scope.working = false;
                    });
                });
            }]);


app.controller('ModulesCreateCtrl', ['$scope', '$http', '$routeParams', '$route', '$compile', '$location', 'storage', function($scope, $http, $routeParams, $route, $compile, $location, storage) {
        $scope.working = true;
        $scope.errors = [];

        var storageKey = 'item_create_' + $routeParams.id;

        if (storage.get(storageKey)) {
            $scope.item = storage.get(storageKey);
        }

        $route.current.templateUrl = viewEnginePath('create', $routeParams.id);
        $http.get($route.current.templateUrl).success(function(data) {
            $('#view').html($compile(data)($scope));
            $scope.working = false;
        });

        $scope.$watch('item', function(item) {
            storage.set(storageKey, item);
        }, true);

        $scope.save = function() {
            $scope.working = true;
            $http.post(path.api + 'modules/create/' + $routeParams.id, $scope.item)
                    .success(function(r) {
                        $scope.working = false;
                        $scope.saved = true;
                        storage.remove(storageKey);
                        $location.path('m/' + $routeParams.id);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.errors.unshift(data);
                        $scope.working = false;
                    });
        };
    }]);
app.controller('ModulesViewCtrl', ['$scope', '$http', '$routeParams', '$route', '$compile', function($scope, $http, $routeParams, $route, $compile) {
        $scope.working = true;
        $route.current.templateUrl = viewEnginePath('view', $routeParams.id);
        $http.get($route.current.templateUrl).success(function(data) {
            $http.get(path.api + 'modules/' + $routeParams.id + '/' + $routeParams.rowId).success(function(r) {
                $scope.item = r.data;
                $('#view').html($compile(data)($scope));
                $scope.working = false;
            }).error(function() {
                alert('An error has occured');
            });
        });
    }]);
app.controller('ModulesEditCtrl', ['$scope', '$http', '$routeParams', '$route', '$compile', '$location', function($scope, $http, $routeParams, $route, $compile, $location) {
        $scope.working = true;
        $scope.errors = [];
        $route.current.templateUrl = viewEnginePath('edit', $routeParams.id);
        $http.get($route.current.templateUrl).success(function(data) {
            $http.get(path.api + 'modules/' + $routeParams.id + '/' + $routeParams.rowId).success(function(r) {
                $scope.item = correctTypes(r.data);
                $('#view').html($compile(data)($scope));
                $scope.working = false;
            });
        });

        $scope.save = function() {
            $scope.working = true;
            $http.put(path.api + 'modules/update/' + $routeParams.id + '/' + $routeParams.rowId, $scope.item).success(function(r) {
                $scope.working = false;
                $scope.saved = true;
                $location.path('m/' + $routeParams.id);
            })
                    .error(function(data, status, headers, config) {
                        $scope.errors.unshift(data);
                        $scope.working = false;
                    });
            ;
        };
    }]);
app.controller('ModulesDeleteCtrl', ['$scope', '$http', '$routeParams', '$route', '$compile', '$location', function($scope, $http, $routeParams, $route, $compile, $location) {
        $scope.working = true;
        $scope.errors = [];
        $route.current.templateUrl = viewEnginePath('delete', $routeParams.id);
        $http.get($route.current.templateUrl).success(function(data) {
            $http.get(path.api + 'modules/' + $routeParams.id + '/' + $routeParams.rowId).success(function(r) {
                $scope.item = r.data;
                $('#view').html($compile(data)($scope));
                $scope.working = false;
            });
        });

        $scope.remove = function() {
            $http.post(path.api + 'modules/delete/' + $routeParams.id + '/' + $routeParams.rowId, $scope.item).success(function(r) {
                $location.path('/m/' + $routeParams.id);
            })
                    .error(function(data, status, headers, config) {
                        $scope.errors.unshift(data);
                        $scope.working = false;
                    });
            ;
        };
    }]);