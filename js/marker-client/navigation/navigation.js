(function(angular, app, marker) {

    /**
     * Navigation Service
     * return the navigation items from the backend
     */
    app.factory('Navigation', ['$http', '$q', '$interval', function($http, $q, $interval) {
            var cache = null;
            var requested = false;

            function filterItemsByMenu(items, menu) {
                return items.filter(function(item) {
                    item.search = menu + '';
                    return (typeof menu === 'undefined' || item.menu === menu);
                });
            }

            function isReceived() {
                return requested && cache;
            }

            function sendRequest(callback) {
                requested = true;
                $http.get(marker.path.api + 'menu').success(function(data) {
                    cache = data;
                    callback();
                });
            }

            return {
                get: function(menu) {

                    var defer = $q.defer();

                    if (!requested) {
                        sendRequest(function() {
                            defer.resolve(filterItemsByMenu(cache, menu));
                        });
                    } else if (!isReceived()) {
                        var attemp = $interval(function() {
                            if (isReceived()) {
                                $interval.cancel(attemp);
                                defer.resolve(filterItemsByMenu(cache, menu));
                            }
                        }, 100);

                    } else {
                        defer.resolve(filterItemsByMenu(cache, menu));
                    }
                    return defer.promise;
                },
                save: function(item) {
                    var defer = $q.defer();

                    $http.post(marker.path.api + 'menu', {item: item})
                            .success(function(data) {
                                defer.resolve(data);

                                // add new items to the cache
                                if (!item.id) {
                                    cache.push(data);
                                }

                            })
                            .error(function(error) {
                                defer.reject(error);
                            });

                    return defer.promise;
                },
                delete: function(item) {
                    var defer = $q.defer();

                    $http.delete(marker.path.api + 'menu/index/' + item.id)
                            .success(function(data) {
                                defer.resolve(data);

                                ArrayHelper.remove(cache, function(row) {
                                    return row.id === item.id;
                                });

                            })
                            .error(function(error) {
                                defer.reject(error);
                            });

                    return defer.promise;
                }
            };
        }]);

    /**
     * Navigation Directive
     * Draw a menu
     */
    app.directive('mkNav', ['Navigation', function(Navigation) {
            return {
                scope: true,
                restrict: 'E',
                link: function(scope, elm, attrs) {


                    function getItems() {
                        Navigation.get(attrs.area).then(function(items) {
                            scope.items = items;
                        });
                    }

                    getItems();

                    scope.$on('navigation_updated', function(event, data) {
                        getItems();
                    });
                }
            };
        }]);

    app.config(['$routeProvider', function($routeProvider) {

            var SettingsNavigationCtrl = function($scope, $rootScope, Navigation) {
                Navigation.get().then(function(items) {
                    $scope.menus = {};

                    items.forEach(function(item) {

                        if (!angular.isDefined($scope.menus[item.menuid])) {
                            $scope.menus[item.menuid] = {
                                items: [],
                                title: item.menu,
                                description: item.menudescription,
                                id: item.menuid
                            };
                        }

                        $scope.menus[item.menuid].items.push(item);
                    });

                    $scope.menu = $scope.menus[items[0].menuid];
                });

                // hold a reference to the item being edited
                var inEdit;
                $scope.setItem = function(item) {
                    if ($scope.isModified() && !confirm('Are you sure to discard changes')) {
                        return;
                    }
                    inEdit = item;
                    $scope.item = angular.copy(item);
                };

                $scope.isModified = function() {
                    return !angular.equals(inEdit, $scope.item);
                };

                /**
                 * Indicate if the form is processing a request
                 */
                $scope.working = false;

                $scope.saveItem = function() {

                    if ($scope.working) {
                        return;
                    }

                    $scope.working = true;

                    Navigation.save($scope.item).then(function(data) {

                        $scope.working = false;

                        if ($scope.item.id) {
                            // update the original item, this will update the 
                            // global menus
                            ['title', 'href', 'description'].forEach(function(prop) {
                                inEdit[prop] = $scope.item[prop];
                            });
                        } else {

                            $scope.menu.items.push(data);
                            $scope.item = inEdit = undefined;
                            $rootScope.$broadcast('navigation_updated', data);
                        }
                    }, function() {
                        $scope.workging = false;
                    });
                };

                $scope.cancel = function() {
                    if ($scope.isModified() && !confirm('Are you sure to discard changes')) {
                        return;
                    } else {
                        $scope.item = inEdit = undefined;
                    }
                };

                $scope.addNew = function() {

                    $scope.item = {
                        title: '',
                        description: '',
                        href: '',
                        menuid: $scope.menu.id,
                        menu: $scope.menu.title
                    };

                    inEdit = angular.copy($scope.item);
                };

                $scope.delete = function() {
                    if (!confirm('Are you sure you want to delete this item ?')) {
                        return;
                    }

                    Navigation.delete($scope.item).then(function() {
                        ArrayHelper.remove($scope.menu.items, function(row) {
                            return row.id === $scope.item.id;
                        });
                        $scope.item = inEdit = undefined;
                        $rootScope.$broadcast('navigation_updated');
                    });
                };
            };

            SettingsNavigationCtrl['$inject'] = ['$scope', '$rootScope', 'Navigation'];

            $routeProvider.when('/settings/navigation', {
                controller: SettingsNavigationCtrl,
                templateUrl: marker.path.modules + 'navigation/views/index.html'
            });
        }]);

})(angular, angular.module('marker-client'), MarkerClient);