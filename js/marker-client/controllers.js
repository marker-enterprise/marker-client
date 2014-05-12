'use strict';
/* Controllers */
var app = angular.module('marker-client.controllers', []);

///////////////
// Index
///////////////
app.controller('IndexCtrl', ['$scope', '$http', function($scope, $http) {
        // 1 is the dashboard link modules
        $http.get(path.api + 'modules/dashboard').success(function(r) {
            $scope.links = $.grep(r.data, function(item){
                return item.ispublished === 1;
            });
        });
    }]);


app.controller('TableCtrl', function($scope, $filter, ngTableParams) {
    var data = [{name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}];

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 10, // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                    $filter('orderBy')(data, params.orderBy()) :
                    data;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
});


///////////////
// Account
///////////////

app.controller('AccLogoutCtrl', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, auth) {
        $scope.done = false;
        $http.post(path.base + 'auth/logout').success(function(r) {
            $scope.done = true;
            auth.member = null;
            auth.isLogged = false;
            $location.path('account/login');
        });

    }]);

///////////////
// Users
///////////////
app.controller('UsersIndexCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.users = [];
        $http.get(path.api + 'users/get').success(function(r) {
            $scope.users = r.data;
        });
    }]);
app.controller('UsersCreateCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.success = false;

        $scope.roles = [];
        $scope.user = {
            roles: []
        };

        //get roles
        $http.get(path.api + 'users/getroles').success(function(r) {
            $scope.roles = r.data;
        });

        $scope.save = function() {
            $scope.working = true;
            $http.post(path.api + 'users/set', $scope.user).success(function(r) {
                $scope.success = true;
            });
        };

    }]);
app.controller('UsersEditCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
        $scope.success = false;
        //get roles
        $http.get(path.api + 'users/getroles').success(function(r) {
            $scope.roles = r.data;
            //get member
            $http.get(path.api + 'users/get/' + $routeParams.userId).success(function(r) {
                $scope.user = r.data;
            });
        });



        $scope.save = function() {
            $http.post(path.api + 'users/set/' + $routeParams.userId, $scope.user).success(function(r) {
                $scope.success = true;
            });
        };

    }]);
app.controller('UsersViewCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
        //get roles
        $http.get(path.api + 'users/getroles').success(function(r) {
            $scope.roles = r.data;
            $http.get(path.api + 'users/get/' + $routeParams.userId).success(function(r) {
                $scope.user = r.data;
            });
        });
    }]);

app.controller('UsersDeleteCtrl', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
        //get roles
        $http.get(path.api + 'users/getroles').success(function(r) {
            $scope.roles = r.data;
            $http.get(path.api + 'users/get/' + $routeParams.userId).success(function(r) {
                $scope.user = r.data;
            });
        });

        $scope.remove = function() {
            $http.post(path.api + 'users/delete/' + $routeParams.userId).success(function(r) {
                $location.path('/users/index');
            });
        };
    }]);



///////////////
// Pages
///////////////
app.controller('PagesIndexCtrl', ['$scope', '$http', function($scope, $http) {
        $http.get(path.api + 'pages/get').success(function(r) {
            $scope.pages = r.data.pages;
        });
    }]);
app.controller('PagesCreateCtrl', ['$scope', '$http', '$filter', '$location', function($scope, $http, $filter, $location) {

        $scope.working = false;

        $scope.page = {meta: '', ispublished: true, images: '[]', title: ''};

        $scope.$watch('page.title', function(value) {
            $scope.page.urlpath = $filter('urlify')(value);
        });

        $scope.save = function(isDraft) {

            $scope.working = true;
            $scope.page.ispublished = +$scope.page.ispublished;

            $scope.page.isdraft = isDraft || 0;
            ;

            $http.post(path.api + 'pages/set', $scope.page).success(function(r) {
                if (r.status) {
                    $scope.page = r.data.page;
                    $scope.saved = true;
                    $scope.working = false;
                }
            });
        };
    }]);
app.controller('PagesViewCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
        $http.get(path.api + 'pages/get/' + $routeParams.pageId).success(function(r) {
            $scope.page = r.data.page;
        });
    }]);
app.controller('PagesDeleteCtrl', ['$scope', '$routeParams', '$http', '$location', function($scope, $routeParams, $http, $location) {
        $scope.working = false;
        $scope.page = {};
        $http.get(path.api + 'pages/get/' + $routeParams.pageId).success(function(r) {
            $scope.page = r.data.page;
        });

        $scope.remove = function() {
            $http.post(path.api + 'pages/delete', {id: $scope.page.id}).success(function(r) {
                $location.path('/pages/index');
            });
        };
    }]);
app.controller('PagesEditCtrl', ['$scope', '$routeParams', '$http', '$filter', '$location', function($scope, $routeParams, $http, $filter, $location) {

        $http.get(path.api + 'pages/get/' + $routeParams.pageId).success(function(r) {
            $scope.page = r.data.page;
            if (!$scope.page.images || $scope.page.images.length === 0) {
                $scope.page.images = '[]';
            }
        });

        $scope.save = function() {
            $scope.working = true;
            $scope.page.isdraft = 0;
            $scope.page.ispublished = +$scope.page.ispublished;

            $http.post(path.api + 'pages/set/' + $routeParams.pageId, $scope.page).success(function(r) {
                if (r.status) {
                    $scope.saved = true;
                }
                $scope.working = false;
            });
        };
    }]);

app.controller('SettingsIndexCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.settings = [
            {title: 'Dashboard', link: 'm/dashboard', description: 'Manage the Items that appear on the dashboard', icon: 'cogs'}
        ];
    }]);