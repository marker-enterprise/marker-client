'use strict';

var routes = [
    //Admin
    ['/', path.partials + 'dashboard.html', 'IndexCtrl'],
    ['/test', path.partials + 'index/test.html', 'Test2Ctrl'],
    ['/demo', path.partials + 'index/demo.html', 'TableCtrl'],
    // Modules
    ['/m/:id', path.partials + 'modules/blank.html', 'ModulesIndexCtrl'],
    ['/m/:id/new', path.partials + 'modules/blank.html', 'ModulesCreateCtrl'],
    ['/m/:id/view/:rowId', path.partials + 'modules/blank.html', 'ModulesViewCtrl'],
    ['/m/:id/edit/:rowId', path.partials + 'modules/blank.html', 'ModulesEditCtrl'],
    ['/m/:id/delete/:rowId', path.partials + 'modules/blank.html', 'ModulesDeleteCtrl'],
    // Account
    ['/account/login', path.partials + 'account/login.html', 'AccLoginCtrl'],
    ['/account/logout', path.partials + 'modules/blank.html', 'AccLogoutCtrl'],
    ['/account/changepwd', path.partials + 'account/changepwd.html', 'AccChangePwdCtrl'],
    // Entities
    ['/entities', path.partials + 'entities/index.html', 'EntitiesIndexCtrl'],
    ['/entities/view/:id', path.partials + 'entities/view.html', 'EntitiesViewCtrl'],
    ['/entities/edit/:id', path.partials + 'entities/edit.html', 'EntitiesEditCtrl'],
    ['/entities/delete/:id', path.partials + 'entities/delete.html', 'EntitiesDeleteCtrl'],
    ['/entities/create', path.partials + 'entities/create.html', 'EntitiesCreateCtrl'],
    ['/entities/existing', path.partials + 'entities/create_existing.html', 'EntitiesCreateFromExistingCtrl'],
    ['/entities/existingfields', path.partials + 'entities/create_existing_fields.html', 'EntitiesCreateFromExistingFieldsCtrl'],
    ['/entities/:id/newfield', path.partials + 'entities/newfield.html', 'EntitiesCreateFieldCtrl'],
    ['/entities/:id/editfield/:fieldId', path.partials + 'entities/editfield.html', 'EntitiesEditFieldCtrl'],
    ['/entities/:id/deletefield/:fieldId', path.partials + 'entities/deletefield.html', 'EntitiesDeleteFieldCtrl'],
    // Pages
    ['/pages', path.partials + 'pages/index.html', 'PagesIndexCtrl'],
    ['/pages/view/:pageId', path.partials + 'pages/view.html', 'PagesViewCtrl'],
    ['/pages/edit/:pageId', path.partials + 'pages/edit.html', 'PagesEditCtrl'],
    ['/pages/delete/:pageId', path.partials + 'pages/delete.html', 'PagesDeleteCtrl'],
    ['/pages/create', path.partials + 'pages/create.html', 'PagesCreateCtrl'],
    // Users
    ['/users', path.partials + 'users/index.html', 'UsersIndexCtrl'],
    ['/users/create', path.partials + 'users/create.html', 'UsersCreateCtrl'],
    ['/users/edit/:userId', path.partials + 'users/edit.html', 'UsersEditCtrl'],
    ['/users/view/:userId', path.partials + 'users/view.html', 'UsersViewCtrl'],
    ['/users/delete/:userId', path.partials + 'users/delete.html', 'UsersDeleteCtrl'],
            //Settings
//    ['/settings', path.partials + 'settings/index.html', 'SettingsIndexCtrl']

];

// Declare app level module which depends on filters, and services
var app = angular.module('marker-client',
        [
            'ngRoute',
//            'ngAuth',
            'accountApp',
            'ngSanitize',
            'ngAnimate',
            'ui.bootstrap',
            'marker-client.filters',
            'marker-client.services',
            'marker-client.directives',
            'marker-client.controllers',
            'angularLocalStorage',
            'marker-client.modules',
            'marker-client.entities',
            'marker-client.validation'
        ]).
        config(['$routeProvider', '$httpProvider', '$locationProvider',
            function($routeProvider, $httpProvider, $locationProvider) {
                //$locationProvider.html5Mode(true);
                routes.forEach(function(route) {
                    $routeProvider.when(route[0], {templateUrl: route[1], controller: route[2]});
                });
                $routeProvider.otherwise({redirectTo: '/'});
            }]);



var ArrayHelper = {
    remove: function(array, predict) {
        for (var i = 0; i < array.length; i++) {
            if (predict(array[i]) && i > -1) {
                return array.splice(i, 1);
            }
        }
    },
    removeAll: function(array, predict) {
        var removed = [];
        for (var i = 0; i < array.length; i++) {
            if (predict(array[i]) && i > -1) {
                removed.push(array.splice(i, 1));
            }
        }

        return removed;
    }
};

var UrlHelper = {
    api: function(url) {
        return MarkerClient.path.api + (url || '');
    }
};