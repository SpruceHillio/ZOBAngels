/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    var controllers = angular.module('ZOBAngels.controllers',[]);

    controllers.controller('ZOBAngels.controllers.Navigation',[
        '$scope',
        'ZOBAngels.services.AccountService',
        '$log',
        function($scope,AccountService,$log) {
            $scope.user = {};

            $scope.image = function() {
                return AccountService.image();
            };

            $scope.name = function() {
                return AccountService.name();
            };

            $scope.logout = function() {
                return AccountService.logout();
            };
        }
    ]);

    controllers.controller('ZOBAngels.controllers.Controller',[
        '$scope',
        'ZOBAngels.services.AccountService',
        'ZOBAngels.services.SlotService',
        '$timeout',
        '$location',
        '$sce',
        '$log',
        function($scope,AccountService,SlotService,$timeout,$location,$sce,$log) {

            $scope.days = SlotService.list();

            $scope.currentDay = 0;

            $scope.nofb = '/nofb' === $location.path();

            //$scope.whereWeAre = true;

            $scope.user = {

            };

            $scope.popoverContent = function(slot) {
                return slot.popoverContent || (slot.popoverContent = slot.isFacebook() ? $sce.trustAsHtml('<a href="https://facebook.com/' + slot.facebookId() + '" target="_blank">Zu Facebook</a>') :  $sce.trustAsHtml(slot.gender()));
            };

            $scope.canLoginWithoutFacebook = function() {
                return $scope.user.name && 3 < $scope.user.name.length && $scope.user.gender;
            };

            $scope.loginWithoutFacebook = function() {
                if (!$scope.canLoginWithoutFacebook()) {
                    return;
                }

                AccountService.login($scope.user);
            };

            $scope.canLogin = function() {
                return AccountService.canLogin();
            };

            $scope.loggedIn = function() {
                return AccountService.isLoggedIn();
            };

            $scope.login = function() {
                AccountService.login();
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
                        len = section.slots.length;
                    for (i=0; i<len; i+=1) {
                        if (section.slots[i].taken() && section.slots[i].mine()) {
                            return true;
                        }
                    }
                }
                return false;
            };

            $scope.take = function(section,slot) {
                if ($scope.disabled(slot,section)) {
                    return;
                }

                SlotService.take($scope.days[$scope.currentDay]._date,section.id).then(function(assignment) {
                    var index = section.slots.indexOf(slot);
                    if (-1 < index) {
                        section.slots[index] = assignment;
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
                    }
                }, function(error) {
                    $log.error(error);
                });
            };

            $scope.release = function(section,assignment) {
                SlotService.release(assignment).then(function(placeholder) {
                    var index = section.slots.indexOf(assignment);
                    if (-1 < index) {
                        section.slots[index] = placeholder;
                    }
                }, function(error) {
                    $log.error(error);
                });
            };
        }
    ]);
})();