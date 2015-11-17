/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels',[
        'ui.bootstrap',
        'ngMap',
        'ui.router',
        'checklist-model',
        'parse-angular',
        'ParseServices',
        'templates-dist',
        'FacebookPatch',
        'ZOBAngels.directives',
        'ZOBAngels.services',
        'ZOBAngels.controllers'
    ]).
        config([
            '$stateProvider',
            '$urlRouterProvider',
            function($stateProvider,$urlRouterProvider) {
                $urlRouterProvider.otherwise('/home');

                $stateProvider.state('home', {
                    url: '/home',
                    templateUrl: 'templates/home.html',
                    controller: 'ZOBAngels.controllers.HomeController',
                    authenticate: true
                }).state('about', {
                    url: '/about',
                    templateUrl: 'templates/about.html',
                    controller: 'ZOBAngels.controllers.AboutController'
                }).state('faq', {
                    url: '/faq',
                    templateUrl: 'templates/faq.html',
                    controller: 'ZOBAngels.controllers.FaqController'
                }).state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'ZOBAngels.controllers.LoginController'
                }).state('nofb', {
                    url: '/nofb',
                    templateUrl: 'templates/login.html',
                    controller: 'ZOBAngels.controllers.LoginController'
                }).state('profile', {
                    url: '/profile',
                    templateUrl: 'templates/profile.html',
                    controller: 'ZOBAngels.controllers.ProfileController'
                }).state('admin', {
                    url: '/admin',
                    templateUrl: 'templates/admin.html',
                    controller: 'ZOBAngels.controllers.AdminController',
                    authenticate: true
                }).state('inventory', {
                    abstract: true,
                    url: '/inventory',
                    templateUrl: 'templates/inventory/index.html',
                    controller: 'ZOBAngels.controllers.inventory.IndexController',
                    authenticate: true
                }).state('inventory.overview', {
                    url: '/overview',
                    templateUrl: 'templates/inventory/overview.html',
                    controller: 'ZOBAngels.controllers.inventory.OverviewController',
                    authenticate: true
                }).state('inventory.detail', {
                    url: '/:id',
                    templateUrl: 'templates/inventory/detail.html',
                    controller: 'ZOBAngels.controllers.inventory.DetailController',
                    authenticate: true
                });
            }
        ]).
    run([
            '$rootScope',
            '$location',
            'ZOBAngels.services.AccountService',
            'ParseSDK',
            'FacebookAngularPatch',
            '$log',
            function($rootScope,$location,AccountService,ParseSDK,FacebookAngularPatch,$log) {
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                    if (toState.authenticate && !AccountService.isLoggedIn()) {
                        $rootScope._originalRequest = $location.path();
                        $location.path('/login');
                    }
                });
            }
        ]);
})();