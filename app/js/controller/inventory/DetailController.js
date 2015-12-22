/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.inventory.DetailController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.inventory.DetailController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        'ZOBAngels.service.AccountService',
        'ZOBAngels.service.InventoryService',
        '$stateParams',
        '$log',
        function($scope,NavigationService,AccountService,InventoryService,$stateParams,$log) {

            NavigationService.page(NavigationService.PAGE.INVENTORY);

            $scope.section = InventoryService.detail($stateParams.id);

            $scope.NavigationService = NavigationService;

            $scope.update = function(detail) {
                detail.saving = true;
                InventoryService.save($stateParams.id,detail.id,detail.quantity).then(function() {
                    detail.today = true;
                    detail.saving = false;
                },function(error) {
                    detail.saving = false;
                });
            };

            $log.debug('ZOBAngels.controller.inventory.DetailController loaded');
        }
    ]);
})();