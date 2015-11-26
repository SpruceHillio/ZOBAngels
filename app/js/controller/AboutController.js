/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.AboutController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.AboutController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        '$log',
        function($scope,NavigationService,$log) {

            NavigationService.page(NavigationService.PAGE.ABOUT);

            $scope.NavigationService = NavigationService;

            $log.debug('ZOBAngels.controller.AboutController loaded');
        }
    ]);
})();