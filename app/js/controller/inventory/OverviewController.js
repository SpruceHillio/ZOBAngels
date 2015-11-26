/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.inventory.OverviewController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.inventory.OverviewController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        'ZOBAngels.service.AccountService',
        'ZOBAngels.service.InventoryService',
        '$log',
        function($scope,NavigationService,AccountService,InventoryService,$log) {

            NavigationService.page(NavigationService.PAGE.INVENTORY);

            $scope.sections = InventoryService.list();

            $scope.NavigationService = NavigationService;

            $log.debug('ZOBAngels.controller.inventory.OverviewController loaded');
        }
    ]);
})();