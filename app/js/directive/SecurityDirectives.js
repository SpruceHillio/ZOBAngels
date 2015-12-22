(function() {
    'use strict';

    var name = 'ZOBAngels.directive.SecurityDirectives';

    var securityDirectives = angular.module(name,[
        'ZOBAngels.service.AccountService'
    ]);

    securityDirectives.directive('isAuthenticated',[
        'ngIfDirective',
        'ZOBAngels.service.AccountService',
        function(ngIfDirective,accountService) {
            var ngIf = ngIfDirective[0];

            return {
                transclude: ngIf.transclude,
                priority: ngIf.priority - 1,
                terminal: ngIf.terminal,
                restrict: ngIf.restrict,
                link: function(scope, element, attributes) {
                    // find the initial ng-if attribute
                    var initialNgIf = attributes.ngIf, ifEvaluator;
                    // if it exists, evaluates ngIf && ifAuthenticated
                    if (initialNgIf) {
                        ifEvaluator = function () {
                            return scope.$eval(initialNgIf) && accountService.isLoggedIn();
                        };
                    }
                    else {
                        ifEvaluator = function () {
                            return accountService.isLoggedIn();
                        };
                    }
                    attributes.ngIf = ifEvaluator;
                    ngIf.link.apply(ngIf, arguments);
                }
            };
        }
    ]);

    securityDirectives.directive('isNotAuthenticated',[
        'ngIfDirective',
        'ZOBAngels.service.AccountService',
        function(ngIfDirective,accountService) {
            var ngIf = ngIfDirective[0];

            return {
                transclude: ngIf.transclude,
                priority: ngIf.priority - 1,
                terminal: ngIf.terminal,
                restrict: ngIf.restrict,
                link: function(scope, element, attributes) {
                    // find the initial ng-if attribute
                    var initialNgIf = attributes.ngIf, ifEvaluator;
                    // if it exists, evaluates ngIf && ifAuthenticated
                    if (initialNgIf) {
                        ifEvaluator = function () {
                            return scope.$eval(initialNgIf) && !accountService.isLoggedIn();
                        };
                    }
                    else {
                        ifEvaluator = function () {
                            return !accountService.isLoggedIn();
                        };
                    }
                    attributes.ngIf = ifEvaluator;
                    ngIf.link.apply(ngIf, arguments);
                }
            };
        }
    ]);

    securityDirectives.directive('hasRole',[
        'ngIfDirective',
        'ZOBAngels.service.AccountService',
        function(ngIfDirective,accountService) {
            var ngIf = ngIfDirective[0];

            return {
                transclude: ngIf.transclude,
                priority: ngIf.priority - 1,
                terminal: ngIf.terminal,
                restrict: ngIf.restrict,
                link: function(scope, element, attributes) {
                    // find the initial ng-if attribute
                    var initialNgIf = attributes.ngIf, ifEvaluator;
                    // if it exists, evaluates ngIf && ifAuthenticated
                    if (initialNgIf) {
                        ifEvaluator = function () {
                            return scope.$eval(initialNgIf) && accountService.hasRole(attributes.hasRole);
                        };
                    }
                    else {
                        ifEvaluator = function () {
                            return accountService.hasRole(attributes.hasRole);
                        };
                    }
                    attributes.ngIf = ifEvaluator;
                    ngIf.link.apply(ngIf, arguments);
                }
            };
        }
    ]);

    securityDirectives.directive('hasAnyRole',[
        'ngIfDirective',
        'ZOBAngels.service.AccountService',
        function(ngIfDirective,accountService) {
            var ngIf = ngIfDirective[0];

            return {
                transclude: ngIf.transclude,
                priority: ngIf.priority - 1,
                terminal: ngIf.terminal,
                restrict: ngIf.restrict,
                link: function(scope, element, attributes) {
                    // find the initial ng-if attribute
                    var initialNgIf = attributes.ngIf, ifEvaluator,
                        roles = attributes.hasAnyRole.split(',').map(function(role) {
                            return role.trim();
                        }),
                        checkRoles = function(roles) {
                            var i,len = roles.length;
                            for (i=0; i<len; i+=1) {
                                if (accountService.hasRole(roles[i])) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    // if it exists, evaluates ngIf && ifAuthenticated
                    if (initialNgIf) {
                        ifEvaluator = function () {
                            var i,len = roles.length;
                            if (scope.$eval(initialNgIf)) {
                                return checkRoles(roles);
                            }
                            return false;
                        };
                    }
                    else {
                        ifEvaluator = function () {
                            return checkRoles(roles);
                        };
                    }
                    attributes.ngIf = ifEvaluator;
                    ngIf.link.apply(ngIf, arguments);
                }
            };
        }
    ]);

    securityDirectives.directive('hasAllRoles',[
        'ngIfDirective',
        'ZOBAngels.service.AccountService',
        function(ngIfDirective,accountService) {
            var ngIf = ngIfDirective[0];

            return {
                transclude: ngIf.transclude,
                priority: ngIf.priority - 1,
                terminal: ngIf.terminal,
                restrict: ngIf.restrict,
                link: function(scope, element, attributes) {
                    // find the initial ng-if attribute
                    var initialNgIf = attributes.ngIf, ifEvaluator,
                        roles = attributes.hasAllRoles.split(',').map(function(role) {
                            return role.trim();
                        }),
                        checkRoles = function(roles) {
                            var i,len = roles.length;
                            for (i=0; i<len; i+=1) {
                                if (!accountService.hasRole(roles[i])) {
                                    return false;
                                }
                            }
                            return true;
                        };
                    // if it exists, evaluates ngIf && ifAuthenticated
                    if (initialNgIf) {
                        ifEvaluator = function () {
                            var i,len = roles.length;
                            if (scope.$eval(initialNgIf)) {
                                return checkRoles(roles);
                            }
                            return false;
                        };
                    }
                    else {
                        ifEvaluator = function () {
                            return checkRoles(roles);
                        };
                    }
                    attributes.ngIf = ifEvaluator;
                    ngIf.link.apply(ngIf, arguments);
                }
            };
        }
    ]);
})();