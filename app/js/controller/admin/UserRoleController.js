/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.admin.UserRoleController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.admin.UserRoleController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
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
                userQuery = new Parse.Query(Parse.User).exists('facebookId').limit(1000);
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

            $scope.userGetName = function(user) {
                return user.get('name');
            };

            $log.debug('ZOBAngels.controller.admin.UserRoleController loaded');
        }
    ]);
})();