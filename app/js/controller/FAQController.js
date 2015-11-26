/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.FaqController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controlles.FaqController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        '$log',
        function($scope,NavigationService,$log) {

            NavigationService.page(NavigationService.PAGE.FAQ);

            $scope.NavigationService = NavigationService;

            $log.debug('ZOBAngels.controller.FaqController loaded');
        }
    ]);
})();