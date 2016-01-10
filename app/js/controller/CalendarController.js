/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.CalendarController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.CalendarController',[
        '$scope',
        '$rootScope',
        'ZOBAngels.service.NavigationService',
        'ZOBAngels.service.AccountService',
        'ZOBAngels.service.SlotService',
        '$timeout',
        '$window',
        '$uibModal',
        '$location',
        '$sce',
        '$log',
        function($scope,$rootScope,NavigationService,AccountService,SlotService,$timeout,$window,$uibModal,$location,$sce,$log) {

            NavigationService.page(NavigationService.PAGE.HOME);

            $scope.days = SlotService.list();

            $scope.currentDay = 0;

            $scope.NavigationService = NavigationService;

            $scope.data = AccountService.data();

            $log.debug('data: ',$scope.data);

            $scope.hasFoodSetting = undefined !== $scope.data.food && null !== $scope.data.food;

            $scope.hasRole = function(role) {
                return AccountService.hasRole(role);
            };

            $scope.onPage = function(page) {
                return page === NavigationService.page();
            };

            $scope.popoverContent = function(slot) {
                return slot.popoverContent || (slot.popoverContent = $sce.trustAsHtml(('angel' === slot.type() ? '' : ('archangel' === slot.type() ? 'Tagesengel' : 'translator' === slot.type() ? 'Übersetzerin / Übersetzer' : 'medical' === slot.type() ? 'Ärztin / Arzt' : '') + '<br /><br />') + slot.isFacebook() ? '<a href="https://facebook.com/' + slot.facebookId() + '" target="_blank">Zu Facebook</a>' :  slot.gender()));
            };

            $scope.loggedIn = function() {
                return AccountService.isLoggedIn();
            };

            $scope.previousDay = function() {
                if ($scope.currentDay > 0) {
                    $scope.currentDay-=1;
                }
            };

            $scope.nextDay = function() {
                if (1 < $scope.days.length - $scope.currentDay) {
                    $scope.currentDay+=1;
                }
            };

            $scope.disabled = function(slot,section) {
                if (slot.taken()) {
                    if (!slot.user || !slot.user.isCurrent()) {
                        return true;
                    }
                }
                else {
                    var i,
                        len = section.extendedSlots.length;
                    for (i=0; i<len; i+=1) {
                        if (section.extendedSlots[i].taken() && section.extendedSlots[i].mine()) {
                            return true;
                        }
                    }
                }
                return false;
            };

            $scope.take = function(section,slot) {
                if (slot.taking) {
                    return;
                }
                slot.taking = true;
                if ($scope.disabled(slot,section)) {
                    return;
                }

                SlotService.take($scope.days[$scope.currentDay]._date,section.id,slot.type()).then(function(assignment) {
                    var index = section.extendedSlots.indexOf(slot),
                        modalInstance;
                    if (-1 < index) {
                        $log.debug('assignment: ',assignment.name(), assignment.image());
                        section.extendedSlots[index] = assignment;
                        $timeout(function() {
                            section.feedback = true;
                            assignment.feedback = true;
                            $timeout(function(){
                                assignment.feedback = false;
                            },2000);
                            $timeout(function() {
                                section.feedback = false;
                            },5000);
                        },300);
                        modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'templates/_userTakePostToFacebookModal.html',
                            controller: 'ZOBAngels.controller.UserTakePostToFacebookModalController',
                            size: 'sm'
                        });

                        modalInstance.result.then(function () {
                            $log.info('Post to Facebook!');
                            FB.uiAngular({
                                method: 'feed',
                                name: 'Facebook Dialogs',
                                link: 'https://developers.facebook.com/docs/reference/dialogs/',
                                picture: 'http://fbrell.com/f8.jpg',
                                caption: 'Reference Documentation',
                                description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
                            },function(response) {
                                $log.debug('fb post response: ',response);
                            });
                        }, function () {
                            $log.info('No!');
                        });
                    }
                    slot.taking = false;
                }, function(error) {
                    slot.taking = false;
                    $log.error(error);
                });
            };

            $scope.release = function(section,assignment,orga) {
                if (assignment.releasing) {
                    return;
                }
                assignment.releasing = true;
                var release = function(section,assignment) {
                    SlotService.release(assignment).then(function(placeholder) {
                        var index = section.extendedSlots.indexOf(assignment);
                        if (-1 < index) {
                            section.extendedSlots[index] = placeholder;
                        }
                        section.feedback = false;
                        assignment.releasing = true;
                    }, function(error) {
                        $log.error(error);
                        assignment.releasing = true;
                    });
                };

                var modalInstance;

                if (orga) {

                    modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'templates/_userReleaseConfirmModal.html',
                        controller: 'ZOBAngels.controller.UserReleaseConfirmModalController',
                        size: 'sm',
                        resolve: {
                            confirmText: function() {
                                return 'Willst Du ' + assignment.get('user').get('name') + ' wirklich austragen?';
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        release(section,assignment);
                    }, function () {
                        assignment.releasing = false;
                    });
                }
                else {

                    modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'templates/_userReleaseConfirmModal.html',
                        controller: 'ZOBAngels.controller.UserReleaseConfirmModalController',
                        size: 'sm',
                        resolve: {
                            confirmText: function () {
                                return 'Willst Du Dich wirklich wieder austragen?';
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        release(section,assignment);
                    }, function () {
                        assignment.releasing = false;
                    });
                }
            };

            $log.debug('ZOBAngels.controllers.CalendarController loaded');
        }
    ]);
})();