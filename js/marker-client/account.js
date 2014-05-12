'use strict';

var app = angular.module('accountApp', ['marker-client.services']);
app.controller('AccLoginCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, auth) {
        $scope.working = false;
        $scope.loginText = 'Login';

        $('body').addClass('login');

        $scope.logo = project.logo;
        $scope.projectTitle = project.title;

        $scope.errors = [];
        $scope.trial = 0;
        $scope.signin = function() {
            $scope.working = true;
            $scope.loginText = 'Logging in ...';
            $http.post(path.base + 'auth/login', $scope.model).success(function(r) {
                if (r.status) {
                    auth.isLogged = true;
                    auth.member = r.member;
                    window.location.href = path.admin;
                } else {
                    $scope.errors = ['Login failed (' + (++$scope.trial) + ')'];
                    $scope.model.password = '';
                    $scope.working = false;
                    $scope.loginText = 'Retry !';
                }
            }).error(function() {
                $scope.errors = ['Cannot connect to the server'];
                $scope.working = false;
                $scope.loginText = 'Login';
            });
        };
    }]);

app.controller('AccChangePwdCtrl', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, auth) {
        $('body').addClass('login');
        $scope.errors = [];
        var count = 0;

        $scope.logo = project.logo;
        $scope.projectTitle = project.title;

        $scope.missMatch = function() {
            if ($scope.model && $scope.model.password && $scope.model.confirm) {
                return $scope.model.password !== $scope.model.confirm;
            }

            return false;
        };

        $scope.change = function() {
            $http.post(path.base + 'auth/changepwd', $scope.model).success(function(data) {
                $scope.errors = [];
                alert('Password successfully changed');
                $location.path('/');
            }).error(function(data, headers, config) {
                $scope.errors = [data + ' (' + ++count + ')'];
            });
        }

    }]);

