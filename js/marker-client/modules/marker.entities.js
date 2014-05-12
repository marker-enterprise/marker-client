var app = angular.module('marker-client.entities', ['ngResource']);

app.factory('Entity', ['$resource', function($resource) {
        return $resource(path.api + 'entities/:id', {id: '@id'});
    }]);


app.controller('EntitiesIndexCtrl', ['$scope', 'Entity', 'webStorage', function($scope, Entity) {
        $scope.working = true;
        Entity.query(function(data) {
            $scope.entities = data;
            $scope.working = false;
        }, function(response) {
            alert('An error occured');
            $scope.working = false;
        });
    }]);

app.controller('EntitiesViewCtrl', ['$scope', '$routeParams', 'Entity', function($scope, $routeParams, Entity) {
        $scope.working = true;
        Entity.get({id: $routeParams.id, fields: true}, function(entity) {
            $scope.entity = entity;
            $scope.working = false;
        }, function(response) {
            alert(response.data);
            $scope.working = false;
        });
    }]);


app.controller('EntitiesEditCtrl', ['$scope', '$routeParams', '$location', 'Entity', function($scope, $routeParams, $location, Entity) {
        $scope.working = true;
        $scope.changes = {
            deleted: [],
            added: []
        };
        var fieldCounter = 0;

        //get entity
        $scope.entity = Entity.get({id: $routeParams.id, fields: true}, function(entity) {
            $scope.working = false;
            fieldCounter = entity.fields.length + 1;
        }, function(response) {
            alert('An error occured');
            $scope.working = false;
        });

        $scope.addField = function() {
            var field = {
                title: 'field_' + fieldCounter++,
                internaltitle: 'newfield',
                definition: 11,
                description: '',
                ispublished: true,
                attrs: {required: true}
            };
            $scope.changes.added.push(field);
            $scope.entity.fields.push(field);
        };

        $scope.deleteField = function(field) {
            if (!confirm('Are you sure to delete this field ? '))
            {
                return;
            }

            if (field.id) {

                //add the field to the removed array
                $scope.changes.deleted.push(field);
            } else {

                // remove the field from the added array
                var fields = $scope.changes.added;
                $scope.changes.added = [];
                angular.forEach(fields, function(f) {
                    if (!angular.equals(f, field)) {
                        $scope.changes.added.push(f);
                    }
                });
            }

            var fields = $scope.entity.fields;
            $scope.entity.fields = [];
            angular.forEach(fields, function(f) {
                if (!angular.equals(f, field)) {
                    $scope.entity.fields.push(f);
                }
            });
        };

        $scope.save = function() {
            $scope.working = true;

            $scope.entity.$save({}, function() {
                $scope.working = false;
                $scope.saved = true;
                $location.path('/entities');
            }, function(response) {
                alert(response.data);
                $scope.working = false;
            });
        };

        $scope.order = [];
        var fieldsTr;
        $scope.dragStart = function(e, ui) {
            ui.item.data('start', ui.item.index());
        };
        $scope.dragEnd = function(e, ui) {
            var start = ui.item.data('start'),
                    end = ui.item.index();
            $scope.entity.fields.splice(end, 0,
                    $scope.entity.fields.splice(start, 1)[0]);

            $scope.$apply();
        };

        fieldsTr = $('.fields-body').sortable({
            start: $scope.dragStart,
            update: $scope.dragEnd,
            placeholder: "ui-state-highlight",
            handle: ".handle",
            helper: 'clone'
        });

    }]);

app.controller('EntitiesDeleteCtrl', ['$scope', 'Entity', '$routeParams', '$location', function($scope, Entity, $routeParams, $location) {
        $scope.working = true;

        //get entity
        $scope.entity = Entity.get({id: $routeParams.id}, function() {
            $scope.working = false;
        });

        $scope.remove = function() {
            $scope.working = true;

            $scope.entity.$delete({}, function() {
                $scope.working = false;
                $location.path('/entities');
            });
        };
    }]);

app.controller('EntitiesCreateCtrl', ['$scope', 'Entity', '$location', function($scope, Entity, $location) {
        $scope.working = false;

        $scope.entity = new Entity(
                {
                    title: 'New Entity',
                    description: '',
                    identity: 'id',
                    ispublished: true,
                    attrs: {view_create: true, view_edit: true, view_delete: true},
                    link: {create: true, title: ''}
                });


        $scope.$watch('entity.title', function(title) {
            $scope.entity.link.title = title;
        });

        $scope.save = function() {
            $scope.working = true;

            $scope.entity.$save({createLink: $scope.createLink}, function(entity) {
                $scope.working = false;
                $scope.saved = true;
                $location.path('/entities/edit/' + entity.id);
            }, function(response) {
                $scope.working = false;
                alert(response.data);
            })
        };

        $scope.addField = function() {
            $scope.entity.fields.push({title: 'new', internaltitle: 'newfield', definition: 11, attrs: {required: true}});
        }
    }]);

app.controller('EntitiesCreateFromExistingCtrl',
        ['$scope', '$http', '$filter', 'Entity', '$location', 'webStorage',
            function($scope, $http, $filter, Entity, $location, webStorage) {
                $scope.entity = new Entity(
                        {
                            title: '',
                            description: '',
                            ispublished: true,
                            attrs: {view_create: true, view_edit: true, view_delete: true},
                            link: {create: true, title: ''}
                        });

                $scope.$watch('entity.title', function(title) {
                    $scope.entity.link.title = title;
                });

                $scope.tables = [];
                $http.get(path.api + 'schema/tables').success(function(r) {
                    $scope.tables = r;
                });

                $scope.$watch('entity.mappedtable', function(value) {
                    $scope.entity.title = value ? $filter('camelCaseToHuman')(value) : '';
                });

                $scope.$watch('entity.title', function(value) {
                    $scope.entity.internaltitle = $filter('safetitle')(value);
                });

                $scope.next = function() {
                    webStorage.add('entity', $scope.entity);
                    $location.path('/entities/existingfields');
                };
            }]);

app.controller('EntitiesCreateFromExistingFieldsCtrl',
        ['$scope', '$http', 'Entity', '$location', 'webStorage',
            function($scope, $http, Entity, $location, webStorage) {
                $scope.working = true;

                $scope.entity = webStorage.get('entity');
                if (!$scope.entity) {
                    alert('Table not selected');
                    $location.path('entities/existing');
                    return;
                }

                $scope.entity = new Entity($scope.entity);

                $scope.entity.fields = [];

                $http.get(path.api + 'schema/fields/' + $scope.entity.mappedtable).success(function(r) {
                    angular.forEach(r, function(field) {

                        var field = {
                            internaltitle: field.Field,
                            dbtype: field.Type,
                            primary: field.Key === 'PRI',
                            attrs: {
                                required: field.Null === 'NO',
                                default: field.Default || ''
                            }
                        };

                        if (field.primary) {
                            $scope.entity.identity = field.internaltitle;
                        } else {
                            $scope.entity.fields.push(field);
                        }
                    });

                    $scope.working = false;
                });

                $scope.save = function() {
                    $scope.working = true;
                    $scope.entity.$save({existing: true}, function() {
                        alert('Entity created successfully');
                        $location.path('entities');
                        $scope.working = false;
                    }, function(response) {
                        alert(response.data);
                        $scope.working = false;
                    });
                };

            }]);
app.controller('EntitiesCreateFieldCtrl', ['$scope', '$http', '$routeParams', '$filter', '$location', function($scope, $http, $routeParams, $filter, $location) {
        $scope.working = true;
        $scope.attrs = {};
        $scope.field = {created: $filter('date')(new Date(), 'yyyy-MM-dd'), title: '', description: '', typeref: '11', ispublished: true};
        $scope.$watch('field.title', function(value) {
            $scope.field.internaltitle = $filter('safetitle')(value);
        });

        $http.get(path.api + 'fields/Types').success(function(typesref) {
            $http.get(path.api + 'entities/get/' + $routeParams.id).success(function(r) {
                $scope.entity = r;
                $scope.typesref = typesref;
                $scope.working = false;
            });
        });

        $scope.addField = function() {
            $scope.field.attrs = JSON.stringify($scope.attrs);
            $http.post(path.api + 'entities/addField/' + $routeParams.id, $scope.field).success(function(r) {
                $scope.working = false;
                $scope.saved = true;
                $location.path('entities/edit/' + $routeParams.id);
            });
        };

        // Validate Barcode field
        $scope.barcodeTypeChanged = function() {
            switch ($scope.attrs.type) {
                case 'ean8':
                    $scope.attrs.minlength = $scope.attrs.maxlength = 8;
                    break;

                case 'ean13':
                    $scope.attrs.minlength = $scope.attrs.maxlength = 13;
                    break;
                default:
                    $scope.attrs.minlength = 5;
                    $scope.attrs.maxlength = 13;
            }
        }


    }]);
app.controller('EntitiesEditFieldCtrl', ['$scope', '$http', '$routeParams', '$filter', '$location', function($scope, $http, $routeParams, $filter, $location) {
        $scope.working = true;
        $scope.attrs = {};
        $scope.field = {title: '', type: '1.1'};
        $scope.$watch('field.title', function(value) {
            $scope.field.internaltitle = $filter('safetitle')(value);
        });

        $http.get(path.api + 'fields/Types').success(function(types) {
            $http.get(path.api + 'entities/get/' + $routeParams.id).success(function(r) {
                $scope.entity = r;
                $scope.types = types;
                $scope.working = false;
            });
        });

        $scope.save = function() {
            $scope.field.attrs = JSON.stringify($scope.attrs);
            $http.post(path.api + 'entities/addField/' + $routeParams.id, $scope.field).success(function(r) {
                $scope.working = false;
                $scope.saved = true;
                $location.path('entities/edit/' + $routeParams.id);
            });
        };
    }]);

app.controller('EntitiesDeleteFieldCtrl', ['$scope', '$http', '$routeParams', '$filter', '$location', function($scope, $http, $routeParams, $filter, $location) {
        $http.get(path.api + 'entities/getField/' + $routeParams.fieldId).success(function(r) {
            $scope.field = r;
        });
        $scope.remove = function() {
            $http.post(path.api + 'entities/deleteField/' + $routeParams.fieldId).success(function(r) {
                $location.path('/entities/edit/' + $routeParams.id);
            });
        };
    }]);


app.directive('markerTypematcher', ['$http', function($http) {
        return {
            restrict: 'EA',
            template: '<span ng-switch="metadata.primary_key">\
                        <span ng-switch-when="1">Identity</span>\
                        <span ng-switch-default><select ng-model="field.definition" ng-options="row.ref as row.type group by row.category for row in definitions"></select></span>\
                    </span>',
            link: function(scope, elm, attrs) {

                function getBestMatchType(metadata) {

                    var rules = [
                        {
                            title: /pic|img|image|picture/i,
                            dbtype: /varchar|char|text/i,
                            match: 51
                        },
                        {
                            title: /color/i,
                            dbtype: /char|varchar|text/i,
                            match: 15
                        },
                        {
                            dbtype: /varchar|char/i,
                            match: 11
                        },
                        {
                            dbtype: /text/i,
                            match: 12
                        },
                        {
                            dbtype: /tinyint\(1\)/i,
                            match: 44
                        },
                        {
                            dbtype: /(tiny|small|big)*int/i,
                            match: 31
                        },
                        {
                            dbtype: /float|double/i,
                            match: 32
                        },
                        {
                            dbtype: /datetime/i,
                            match: 72
                        },
                        {
                            dbtype: /date/i,
                            match: 71
                        },
                        {
                            dbtype: /year/i,
                            match: 74
                        }
                    ];

                    var ref = 11; //default value

                    for (var i in rules) {
                        var rule = rules[i];

                        if (rule.title) {
                            if (rule.title && rule.title.test(metadata.title) && rule.dbtype.test(metadata.dbtype)) {
                                ref = rule.match;
                                break;
                            }
                        } else {
                            if (rule.dbtype.test(metadata.dbtype)) {
                                ref = rule.match;
                                break;
                            }
                        }


                    }

                    return ref;
                }

                scope.metadata = angular.fromJson(attrs.metadata);
                scope.definitions = [];

                $http.get(path.api + 'schema/definitions', {cache: true}).success(function(definitions) {
                    scope.definitions = definitions;
                    if (!scope.field.definition) {
                        scope.field.definition = getBestMatchType(scope.metadata);
                    }
                });
            }
        };
    }]);