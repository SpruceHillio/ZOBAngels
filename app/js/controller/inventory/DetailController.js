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
        '$timeout',
        '$log',
        function($scope,NavigationService,AccountService,InventoryService,$stateParams,$timeout,$log) {

            NavigationService.page(NavigationService.PAGE.INVENTORY);

            $scope.section = InventoryService.detail($stateParams.id);

            $scope.NavigationService = NavigationService;

            $scope.update = function(detail) {
                detail.saving = true;
                if (undefined !== detail.message) {
                    detail.message.show = false;
                }
                InventoryService.save($stateParams.id,detail.id,detail.quantity).then(function() {
                    detail.today = true;
                    detail.saving = false;
                    if (undefined !== detail.message) {
                        detail.message = {};
                    }
                    //detail.message.type = 'alert-success';
                    //detail.message.text = 'Eintrag wurde gespeichert.';
                    //detail.message.show = true;
                    //$timeout(functiom2000);
                },function(error) {
                    detail.saving = false;
                    if (undefined !== detail.message) {
                        detail.message = {};
                    }
                    detail.message.type = 'alert-error';
                    detail.message.text = 'Beim Speichern ist ein Fehler aufgetreten - bitte nochmals versuchen!';
                    detail.message.show = true;
                });
            };

            $log.debug('ZOBAngels.controller.inventory.DetailController loaded');
        }
    ]);
})();