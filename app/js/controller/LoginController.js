/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.LoginController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.LoginController',[
        '$scope',
        '$location',
        'ZOBAngels.service.NavigationService',
        'ZOBAngels.service.AccountService',
        '$log',
        function($scope,$location,NavigationService,AccountService,$log) {

            NavigationService.page(NavigationService.PAGE.LOGIN);

            $scope.logginIn = false;

            $scope.user = {

            };

            $scope.nofb = '/nofb' === $location.path();

            $scope.NavigationService = NavigationService;

            $scope.canLoginWithoutFacebook = function() {
                return $scope.user.name && 2 < $scope.user.name.length && $scope.user.gender;
            };

            $scope.loginWithoutFacebook = function() {
                if (!$scope.canLoginWithoutFacebook()) {
                    return;
                }

                $scope.logginIn = true;

                AccountService.login($scope.user).then(function() {
                    $location.path('/home');
                }, function() {
                    $scope.logginIn = false;
                });
            };

            $scope.canLogin = function() {
                return AccountService.canLogin();
            };

            $scope.login = function() {

                $scope.logginIn = true;

                AccountService.login().then(function() {
                    $location.path('/home');
                }, function() {
                    $scope.logginIn = false;
                });
            };

            $log.debug('ZOBAngels.controller.LoginController loaded');
        }
    ]);
})();