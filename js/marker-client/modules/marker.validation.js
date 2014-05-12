var app = angular.module('marker-client.validation', []);

function optional(value) {
    return value === undefined || value === null;
}

app.factory('mkValidationService', ['$compile', function($compile) {
        return {
            msg: function(scope, elmname, rulename, text) {
                var el = angular.element(
                        $compile('<span class="help-block" ng-show="form.' + elmname + '.$error.' + rulename + '">' + text + '</span>')(scope));
                return el;
            }
        }
    }]);

app.directive('mkMin', ['mkValidationService', function(validationService) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {

                elm.after(validationService.msg(scope, attrs.id, 'mkmin', 'the minimum value is ' + attrs.mkMin));

                var validator = function(value) {
                    var result = true;
                    if (value !== undefined || !isNaN(value)) {
                        result = +value >= attrs.mkMin;
                    }
                    ctrl.$setValidity('mkmin', result);

                    return value;
                };

                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.unshift(validator);
            }
        };
    }]);

app.directive('mkMax', ['mkValidationService', function(validationService) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {


                elm.after(validationService.msg(scope, attrs.id, 'mkmax', 'the maximum value is ' + attrs.mkMax));

                var validator = function(value) {
                    var result = true;
                    if (value !== undefined || !isNaN(value)) {
                        result = +value <= attrs.mkMax;
                    }
                    ctrl.$setValidity('mkmax', result);

                    return value;
                };

                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.unshift(validator);
            }
        };
    }]);

app.directive('ngMinlength', ['mkValidationService', function(validator) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                elm.after(validator.msg(scope, attrs.id, 'minlength', 'the minimum length is ' + attrs.ngMinlength));
            }
        };
    }]);

app.directive('ngMaxlength', ['mkValidationService', function(validator) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                elm.after(validator.msg(scope, attrs.id, 'maxlength', 'the maximum length is ' + attrs.ngMaxlength));
            }
        };
    }]);

app.directive('ngPattern', ['mkValidationService', function(validator) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                elm.after(validator.msg(scope, attrs.id, 'pattern', 'the value is invalid'));
            }
        };
    }]);