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
        '$location',
        'ZOBAngels.services.NavigationService',
        'ZOBAngels.services.AccountService',
        '$log',
        function($scope,$location,NavigationService,AccountService,$log) {
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

            $log.debug('ZOBAngels.controllers.Navigation loaded');
        }
    ]);

    controllers.controller('ZOBAngels.controllers.AboutController',[
        '$scope',
        '$sce',
        'ZOBAngels.services.NavigationService',
        '$log',
        function($scope,$sce,NavigationService,$log) {

            NavigationService.page(NavigationService.PAGE.ABOUT);

            $scope.NavigationService = NavigationService;

            $scope.post = {
                show: false
            };

            if (FB) {
                FB.apiAngular('/v2.5/179372189068790').then(function(post) {
                    if (post) {
                        $scope.post.show = true;
                        $scope.post.message = $sce.trustAsHtml(post.message.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2'));
                    }
                    $log.debug('post: ',post);
                });
            }

            $log.debug('Created ZOBAngels.controllers.AboutController');
        }
    ]);

    controllers.controller('ZOBAngels.controllers.FaqController',[
        '$scope',
        'ZOBAngels.services.NavigationService',
        '$log',
        function($scope,NavigationService,$log) {

            NavigationService.page(NavigationService.PAGE.FAQ);

            $scope.NavigationService = NavigationService;
        }
    ]);

    controllers.controller('ZOBAngels.controllers.ProfileController',[
        '$scope',
        'ZOBAngels.services.NavigationService',
        'ZOBAngels.services.AccountService',
        '$log',
        function($scope,NavigationService,$log) {

            NavigationService.page(NavigationService.PAGE.FAQ);

            $scope.NavigationService = NavigationService;
        }
    ]);

    controllers.controller('ZOBAngels.controllers.AdminController',[
        '$scope',
        'ZOBAngels.services.NavigationService',
        '$log',
        function($scope,NavigationService,$log) {

            var queryUsers = function(roleContainer) {
                roleContainer.role.relation('users').query().limit(1000).find().then(function(users) {
                    roleContainer.users = users;
                });
                },
                queryRoles = function(roleContainer) {
                    roleContainer.role.relation('roles').query().find().then(function(roles) {
                        roleContainer.roles = roles;
                    });
                };

            NavigationService.page(NavigationService.PAGE.ADMIN);

            $scope.roles = [];
            $scope.users = [];

            $scope.selection = {
                targetUsers: [],
                targetRoles: [],
                removeUsers: [],
                removeRoles: []
            };

            $scope.alreadyMemberUser = function(user) {
                if (!$scope.selection.source) {
                    return false;
                }
                var users = $scope.selection.source.users,
                    i,len = users.length;
                for (i=0; i<len; i+=1) {
                    if (users[i].id === user.id) {
                        return true;
                    }
                }
                return false;
            };

            $scope.alreadyMemberRole = function(role) {
                if (!$scope.selection.source) {
                    return false;
                }
                var roles = $scope.selection.source.roles,
                    i,len = roles.length;
                for (i=0; i<len; i+=1) {
                    if (roles[i].id === role.id) {
                        return true;
                    }
                }
                return false;
            };

            $scope.toRemoveUser = function(user) {
                var i,
                    len = $scope.selection.removeUsers.length;
                for (i=0; i<len; i+=1) {
                    if ($scope.selection.removeUsers[i].id === user.id) {
                        return true;
                    }
                }
                return false;
            };

            $scope.toRemoveRole = function(role) {
                var i,
                    len = $scope.selection.removeRoles.length;
                for (i=0; i<len; i+=1) {
                    if ($scope.selection.removeRoles[i].id === role.id) {
                        return true;
                    }
                }
                return false;
            };

            $scope.removeMemberUser = function(user) {
                $scope.selection.removeUsers.push(user);
            };

            $scope.notRemoveMemberUser = function(user) {
                var index = $scope.selection.removeUsers.indexOf(user);
                $scope.selection.removeUsers.splice(index,1);
            };

            $scope.removeMemberRole = function(role) {
                $scope.selection.removeRoles.push(role);
            };

            $scope.notRemoveMemberRole = function(role) {
                var index = $scope.selection.removeRoles.indexOf(role);
                $scope.selection.removeRoles.splice(index,1);
            };

            $scope.update = function() {
                var i,
                    len = $scope.selection.targetUsers.length;
                if (0 < len) {
                    for (i=0; i<len; i+=1) {
                        $scope.selection.source.role.getUsers().add($scope.selection.targetUsers[i]);
                    }
                }
                len = $scope.selection.targetRoles.length;
                if (0 < len) {
                    for (i=0; i<len; i+=1) {
                        $scope.selection.source.role.getRoles().add($scope.selection.targetRoles[i]);
                    }
                }
                len = $scope.selection.removeUsers.length;
                if (0 < len) {
                    for (i=0; i<len; i+=1) {
                        $scope.selection.source.role.getUsers().remove($scope.selection.removeUsers[i]);
                    }
                }
                len = $scope.selection.removeRoles.length;
                if (0 < len) {
                    for (i=0; i<len; i+=1) {
                        $scope.selection.source.role.getRoles().remove($scope.selection.removeRoles[i]);
                    }
                }
                $scope.selection.source.role.save().then(function(role) {
                    var roleContainer = $scope.selection.source;
                    queryUsers(roleContainer);
                    queryRoles(roleContainer);
                    $scope.selection.source = null;
                    $scope.selection.targetUsers.length = 0;
                    $scope.selection.targetRoles.length = 0;
                    $scope.selection.removeUsers.length = 0;
                    $scope.selection.removeRoles.length = 0;
                }, function(error) {
                    $log.debug('error: ',error);
                });
            };

            var roleQuery = new Parse.Query(Parse.Role),
                userQuery = new Parse.Query(Parse.User).limit(1000);
            roleQuery.find().then(function(roles) {
                $scope.roles.length = 0;
                Array.prototype.push.apply($scope.roles,roles.map(function(role) {
                    var roleContainer = {
                        role: role
                    };
                    queryUsers(roleContainer);
                    queryRoles(roleContainer);
                    return roleContainer;
                }));
            });
            userQuery.find().then(function(users) {
                $scope.users.length = 0;
                Array.prototype.push.apply($scope.users,users);
            });

            $scope.NavigationService = NavigationService;
        }
    ]);

    controllers.controller('ZOBAngels.controllers.LoginController',[
        '$scope',
        '$location',
        'ZOBAngels.services.NavigationService',
        'ZOBAngels.services.AccountService',
        '$log',
        function($scope,$location,NavigationService,AccountService,$log) {

            NavigationService.page(NavigationService.PAGE.LOGIN);

            $scope.user = {

            };

            $scope.nofb = '/nofb' === $location.path();

            $scope.NavigationService = NavigationService;

            $scope.canLoginWithoutFacebook = function() {
                return $scope.user.name && 3 < $scope.user.name.length && $scope.user.gender;
            };

            $scope.loginWithoutFacebook = function() {
                if (!$scope.canLoginWithoutFacebook()) {
                    return;
                }

                AccountService.login($scope.user).then(function() {
                    $location.path('/home');
                });
            };

            $scope.canLogin = function() {
                return AccountService.canLogin();
            };

            $scope.login = function() {
                AccountService.login().then(function() {
                    $location.path('/home');
                });
            };
        }
    ]);

    controllers.controller('ZOBAngels.controllers.HomeController',[
        '$scope',
        '$rootScope',
        'ZOBAngels.services.NavigationService',
        'ZOBAngels.services.AccountService',
        'ZOBAngels.services.SlotService',
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
                    var index = section.extendedSlots.indexOf(slot);
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
                        controller: 'ZOBAngels.controllers.UserReleaseConfirmModalController',
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
                        controller: 'ZOBAngels.controllers.UserReleaseConfirmModalController',
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
        }
    ]);

    controllers.controller('ZOBAngels.controllers.UserReleaseConfirmModalController',[
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