/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.UserReleaseConfirmModalController',[
    ]).controller('ZOBAngels.controller.UserReleaseConfirmModalController',[
        '$scope',
        '$uibModalInstance',
        'confirmText',
        function($scope, $uibModalInstance,confirmText) {
            $scope.text = confirmText;

            $scope.ok = function() {
                $uibModalInstance.close();
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
})();