'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var app = angular.module('marker-client.services', []).
        value('version', '0.1');

app.factory('AuthService', [function() {
        return {
            isLogged: false,
            member: null
        };
    }]);

app.factory('Navigation', ['$q', '$http', function($q, $http) {
        return {
            get: function(section) {
                var promise = $q.defer();
                
                
                

                var data = [
                    {
                        title: 'first',
                        items: [
                            {
                                title: 'Reports',
                                href: '#/reports'
                            },
                            {
                                title: 'Analytics',
                                href: '#/analytics'
                            },
                            {
                                title: 'Settings',
                                href: '#/settings'
                            }
                        ]
                    }
                ];
                promise.resolve(data);
                return promise.promise;
            }
        };

    }]);