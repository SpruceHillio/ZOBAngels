/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.NavigationController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.NavigationController',[
        '$scope',
        '$location',
        '$translate',
        'ZOBAngels.service.NavigationService',
        'ZOBAngels.service.AccountService',
        '$log',
        function($scope,$location,$translate,NavigationService,AccountService,$log) {
            $scope.user = {};

            $scope.NavigationService = NavigationService;

            $scope.hasRole = function(role) {
                return AccountService.hasRole(role);
            };

            $scope.onPage = function(page) {
                return page === NavigationService.page();
            };

            $scope.isLoggedIn = function() {
                return AccountService.isLoggedIn();
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

            $scope.home = function() {
                NavigationService.page(NavigationService.PAGE.HOME);
            };

            $scope.about = function() {
                NavigationService.page(NavigationService.PAGE.ABOUT);
            };

            $scope.faq = function() {
                NavigationService.page(NavigationService.PAGE.FAQ);
            };

            $scope.admin = function() {
                NavigationService.page(NavigationService.PAGE.ADMIN);
            };

            $scope.activeLanguage = function(lang) {
                return $translate.use() === lang;
            };

            $scope.changeLanguage = function(lang) {
                $translate.use(lang);
            };

            $scope.ready = function() {
                return AccountService.ready();
            };

            $log.debug('ZOBAngels.controllers.NavigationController loaded');
        }
    ]);
})();