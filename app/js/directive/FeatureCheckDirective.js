(function() {
    'use strict';

    var name = 'ZOBAngels.directive.FeatureCheckDirectives';

    var featureCheckDirectives = angular.module(name,[
        'ZOBAngels.service.FeatureService'
    ]);

    featureCheckDirectives.directive('hasFeature',[
        'ngIfDirective',
        'ZOBAngels.service.FeatureService',
        '$log',
        function(ngIfDirective,featureService,$log) {
            var ngIf = ngIfDirective[0];

            return {
                transclude: ngIf.transclude,
                priority: ngIf.priority - 2,
                terminal: ngIf.terminal,
                restrict: ngIf.restrict,
                link: function(scope, element, attributes) {
                    // find the initial ng-if attribute
                    var initialNgIf = attributes.ngIf, ifEvaluator;
                    // if it exists, evaluates ngIf && ifAuthenticated
                    if (initialNgIf) {
                        $log.debug('already has ngIf');
                        ifEvaluator = function () {
                            return scope.$eval(initialNgIf) && featureService.hasFeature(attributes.hasFeature);
                        };
                    }
                    else {
                        $log.debug('only us');
                        ifEvaluator = function () {
                            return featureService.hasFeature(attributes.hasFeature);
                        };
                    }
                    attributes.ngIf = ifEvaluator;
                    ngIf.link.apply(ngIf, arguments);
                }
            };
        }
    ]);
})();