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
        '$timeout',
        'ZOBAngels.service.FeatureService',
        '$log',
        function($rootScope,$location,$q,$timeout,featureService,$log) {

            var AccountService = {
                _fbReady: false,
                _launching: false,
                _ready: false,
                _hasRolePromises: [],
                _isLoggedInPromises: [],

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
                        i,j,
                        len,m,
                        // Check whether a role is already contained on the array supplied
                        containsRole = function(roles,role) {
                            var i,len = roles.length;
                            for (i=0; i<len; i+=1) {
                                if (role.id === roles[i].id) {
                                    return true;
                                }
                            }
                            return false;
                        },
                        // Simple helper function used on map() later on
                        roleToRoleName = function(role) {
                            return role.getName();
                        },
                        // Query parent roles for a role - defined here as used on a loop further down
                        resolveRolesForRole = function(role) {
                            return new Parse.Query(Parse.Role).equalTo('roles',role).find().then(function(roles) {
                                return Parse.Promise.as({
                                    role: role,                 // The role object itself
                                    roleName: role.getName(),   // Just for easier debugging
                                    //roles: roles,
                                    allRoles: [],               // All roles included in this role (will also hold itself)
                                    allRoleNames: [],           // Same as above - just for debugging
                                    parents: roles,             // The parent roles of this role as obtained by the query
                                    children: []                // The child roles of this role
                                });
                            });
                        },
                        // Get all child roles for a role (recursively and breaking on loops)
                        collectRoles = function(roleContainer,seen) {
                            var roles,
                                i,j,
                                len,m,
                                childRoles;
                            // Initialize the seen array of not supplied
                            seen = seen || [];
                            // If the current role has already been seen during this recursive call, simply return
                            if (containsRole(seen,roleContainer.role)) {
                                return;
                            }
                            // Otherwise add the role to the seen array
                            seen.push(roleContainer.role);

                            // Initialize the roles to return with the current role
                            roles = [roleContainer.role];
                            len = roleContainer.children.length;
                            // Iterate over all child roles
                            for (i=0; i<len; i+=1) {
                                // If that role has not yet been seen check it.
                                if (!containsRole(seen,roleContainer.children[i])) {
                                    // Recurse and supply the current seen array
                                    childRoles = collectRoles(self._rolesById[roleContainer.children[i].id],seen);
                                    m = childRoles.length;
                                    for (j=0; j<m; j+=1) {
                                        // Add all roles from the recursive all unless they are already present
                                        if(!containsRole(roles,childRoles[j])) {
                                            roles.push(childRoles[j]);
                                        }
                                    }
                                }
                            }

                            return roles;
                        },
                        handleUserSet = function() {
                            AccountService._ready = true;
                            AccountService._launching = false;
                            len = AccountService._hasRolePromises.length;
                            for (i=0; i<len; i+=1) {
                                if (AccountService._hasRole(AccountService._hasRolePromises[i].role)) {
                                    AccountService._hasRolePromises[i].defer.resolve();
                                }
                                else {
                                    AccountService._hasRolePromises[i].defer.reject();
                                }
                            }
                            len = AccountService._isLoggedInPromises.length;
                            for (i-0; i<len; i+=1) {
                                if (AccountService.isLoggedIn()) {
                                    AccountService._isLoggedInPromises[i].defer.resolve();
                                }
                                else {
                                    AccountService._isLoggedInPromises[i].defer.reject();
                                }
                            }
                        };
                    if (undefined === user || null === user) {
                        handleUserSet();
                        defer.resolve();
                    }
                    else {
                        this._launching = true;

                        new Parse.Query(Parse.User).equalTo('username',user.get('username')).first()
                            .then(function(user) {
                                // Fetch all available roles
                                return new Parse.Query(Parse.Role).find();
                            })
                            .then(function(roles) {
                                // Fetch all included roles for each role
                                return Parse.Promise.when(roles.map(resolveRolesForRole));
                            }).then(function() {
                                // We need to use arguments as we will have a variable length of parameters
                                len = arguments.length;
                                // First make a role accessible by it's ID
                                for (i=0; i<len; i+=1) {
                                    current = arguments[i];
                                    self._rolesById[current.role.id] = current;
                                }
                                for (i=0; i<len; i+=1) {
                                    current = arguments[i];
                                    m = current.parents.length;
                                    for (j=0; j<m; j+=1) {
                                        self._rolesById[current.parents[j].id].children.push(current.role);
                                    }
                                }
                                // Collect the roles that are included on a role like e.g. admin includes orga, medical
                                // and translator, orga includes archangel, archangel includes angel and so on
                                for (i=0; i<len; i+=1) {
                                    current = arguments[i];
                                    Array.prototype.push.apply(current.allRoles,collectRoles(current));
                                    current.allRoleNames = current.allRoles.map(roleToRoleName);
                                }
                                // Fetch all roles that are directly assiged to the user
                                return new Parse.Query(Parse.Role).equalTo('users',user).find();
                            }).then(function(roles) {
                                // And finally get all transitive ones
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

                                handleUserSet();

                                defer.resolve(self._userContainer);
                                $rootScope.$broadcast('login',{
                                    user: user
                                });
                            },function(error) {
                                handleParseError(error);
                                handleUserSet();
                                defer.reject();
                            });
                    }
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
                    return this._hasRole(role);
                },

                hasAnyRole: function(roles) {
                    var i,
                        len = roles.length;
                    for (i=0; i<len; i+=1) {
                        if (this.hasRole(roles[i])) {
                            return true;
                        }
                    }
                    return false;
                },

                hasRolePromise: function(role) {
                    var defer = $q.defer();
                    if (!this._ready || this._launching) {
                        this._hasRolePromises.push({
                            role: role,
                            defer: defer
                        });
                    }
                    else {
                        if (this._hasRole(role)) {
                            defer.resolve();
                        }
                        else {
                            defer.reject();
                        }
                    }

                    return defer.promise;
                },

                _hasRole: function(role) {
                    if (!this._userContainer) {
                        return featureService.hasFeature(role);
                        //return false;
                    }
                    if (-1 === this._userContainer.roleNames.indexOf(role)) {
                        return featureService.hasFeature(role);
                    }
                    return true;
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
                 *
                 * @returns {object} A promise
                 */
                isLoggedInPromise: function() {
                    var defer = $q.defer();

                    if (!this._ready || this._launching) {
                        this._isLoggedInPromises.push({
                            defer: defer
                        });
                    }
                    else {
                        if (this.isLoggedIn()) {
                            defer.resolve();
                        }
                        else {
                            defer.reject();
                        }
                    }

                    return defer.promise;
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

            AccountService._fbReady = true;
            $timeout(function() {
                $log.debug('setting user');
                AccountService._setUser(Parse.User.current());
            },300);

            return AccountService;
        }
    ]);
})();