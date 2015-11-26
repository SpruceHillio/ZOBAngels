/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.inventory.IndexController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.inventory.IndexController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        '$log',
        function($scope,NavigationService,$log) {

            NavigationService.page(NavigationService.PAGE.INVENTORY);

            $scope.NavigationService = NavigationService;

            $log.debug('ZOBAngels.controller.inventory.IndexController loaded');
        }
    ]);
})();