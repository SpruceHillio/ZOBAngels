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
        'permission',
        'chart.js',
        'checklist-model',
        'parse-angular',
        'ParseServices',
        'templates-dist',
        'FacebookPatch',
        'ZOBAngels.controller',
        'ZOBAngels.service',
        'ZOBAngels.directive'
    ]).
        config([
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider',
            function($stateProvider,$urlRouterProvider,$locationProvider) {
                $urlRouterProvider.otherwise(function($injector) {
                    $injector.get('$state').go('calendar');
                });

                $stateProvider.state('calendar', {
                    url: '/calendar',
                    templateUrl: 'templates/calendar.html',
                    controller: 'ZOBAngels.controller.CalendarController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['angel'],
                            redirectTo: 'login'
                        }
                    }
                }).state('about', {
                    url: '/about',
                    templateUrl: 'templates/about.html',
                    controller: 'ZOBAngels.controller.AboutController'
                }).state('donation', {
                    url: '/donation',
                    templateUrl: 'templates/donation.html',
                    controller: 'ZOBAngels.controller.DonationController'
                }).state('faq', {
                    url: '/faq',
                    templateUrl: 'templates/faq.html',
                    controller: 'ZOBAngels.controller.FaqController'
                }).state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'ZOBAngels.controller.LoginController'
                }).state('nofb', {
                    url: '/nofb',
                    templateUrl: 'templates/login.html',
                    controller: 'ZOBAngels.controller.LoginController'
                }).state('profile', {
                    url: '/profile',
                    templateUrl: 'templates/profile.html',
                    controller: 'ZOBAngels.controller.ProfileController'
                }).state('admin', {
                    url: '/admin',
                    templateUrl: 'templates/admin.html',
                    controller: 'ZOBAngels.controller.admin.UserRoleController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'login'
                        }
                    }
                }).state('inventory', {
                    abstract: true,
                    url: '/inventory',
                    templateUrl: 'templates/inventory/index.html',
                    controller: 'ZOBAngels.controller.inventory.IndexController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['inventory'],
                            redirectTo: 'login'
                        }
                    }
                }).state('inventory.overview', {
                    url: '/overview',
                    templateUrl: 'templates/inventory/overview.html',
                    controller: 'ZOBAngels.controller.inventory.OverviewController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['inventory'],
                            redirectTo: 'login'
                        }
                    }
                }).state('inventory.detail', {
                    url: '/:id',
                    templateUrl: 'templates/inventory/detail.html',
                    controller: 'ZOBAngels.controller.inventory.DetailController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['inventory'],
                            redirectTo: 'login'
                        }
                    }
                }).state('statistics', {
                    abstract: true,
                    url: '/statistics',
                    templateUrl: 'templates/statistics/index.html',
                    controller: 'ZOBAngels.controller.statistics.IndexController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['orga'],
                            redirectTo: 'login'
                        }
                    }
                }).state('statistics.day', {
                    url: '/day',
                    templateUrl: 'templates/statistics/day.html',
                    controller: 'ZOBAngels.controller.statistics.ByUserController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['orga'],
                            redirectTo: 'login'
                        }
                    }
                }).state('statistics.user', {
                    url: '/user',
                    templateUrl: 'templates/statistics/user.html',
                    controller: 'ZOBAngels.controller.statistics.ByUserController',
                    authenticate: true,
                    data: {
                        permissions: {
                            only: ['orga'],
                            redirectTo: 'login'
                        }
                    }
                });

                $locationProvider.html5Mode(true);
            }
        ]).
    run([
            '$rootScope',
            '$location',
            'ZOBAngels.service.AccountService',
            'ParseSDK',
            'FacebookAngularPatch',
            'Permission',
            '$log',
            function($rootScope,$location,AccountService,ParseSDK,FacebookAngularPatch,permission,$log) {
                permission.defineManyRoles(['angel','translator','medical','inventory','archangel','orga','admin'], function (stateParams, roleName) {
                    return AccountService.hasRolePromise(roleName);
                });
            }
        ]);
})();