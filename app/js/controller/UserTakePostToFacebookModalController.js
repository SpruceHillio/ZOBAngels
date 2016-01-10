/**
 * @license ZOB Angels
 * (c) 2016 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.UserTakePostToFacebookModalController',[
    ]).controller('ZOBAngels.controller.UserTakePostToFacebookModalController',[
        '$scope',
        '$uibModalInstance',
        function($scope, $uibModalInstance) {

            $scope.ok = function() {
                $uibModalInstance.close();
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
})();