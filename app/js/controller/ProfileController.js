/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.ProfileController',[
        'ngTagsInput',
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.ProfileController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        'ZOBAngels.service.AccountService',
        '$timeout',
        '$location',
        '$log',
        function($scope,NavigationService,AccountService,$timeout,$location,$log) {

            NavigationService.page(NavigationService.PAGE.PROFILE);

            $scope.NavigationService = NavigationService;

            $scope.data = AccountService.data();

            $scope.updating = false;

            $scope.$watch('data',function(newValue,oldValue) {
                if (undefined !== oldValue && null !== oldValue && undefined !== newValue && null !== newValue) {
                    if (!angular.equals(oldValue,newValue)) {
                        $scope.updating = true;
                        AccountService.updateData($scope.data).then(function(result) {
                            $scope.updating = false;
                            $scope.saved = true;
                            $timeout(function() {
                                $scope.saved = false;
                            },1500);
                        },function(error) {
                            $scope.updating = false;
                        });
                    }
                }
            },true);

            $scope.hasRole = function(role) {
                return AccountService.hasRole(role);
            };

            $scope.image = function() {
                return AccountService.image();
            };

            $scope.name = function() {
                return AccountService.name();
            };

            $scope.logout = function() {
                return AccountService.logout().then(function() {
                    $location.path('/login');
                });
            };

            $log.debug('ZOBAngels.controller.ProfileController loaded');
        }
    ]);
})();