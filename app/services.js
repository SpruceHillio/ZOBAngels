/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    var services = angular.module('ZOBAngels.services',[]),
        handleParseError = function(err, AccountService) {
            switch (err.code) {
                case Parse.Error.INVALID_SESSION_TOKEN:
                    AccountService.logout();
                    break;
            }
        };

    services.factory('ZOBAngels.services.NavigationService',[
        '$q',
        'ZOBAngels.services.AccountService',
        '$log',
        function($q,AccountService,$log) {

            var NavigationService = {

                PAGE: {
                    LOADING: 'loading',
                    LOGIN: 'login',
                    HOME: 'home',
                    ABOUT: 'about',
                    FAQ: 'faq',
                    ADMIN: 'admin'
                },

                _page: null,

                page: function(page) {
                    if (page) {
                        this._page = page;
                    }
                    if (!this._page) {
                        return NavigationService.PAGE.HOME;
                    }
                    else {
                        return this._page;
                    }
                }
            };

            return NavigationService;
        }
    ]);

    services.factory('ZOBAngels.services.AccountService',[
        '$rootScope',
        '$location',
        '$q',
        '$log',
        function($rootScope,$location,$q,$log) {

            var AccountService = {
                _fbReady: false,

                _user: null,
                _userContainer: null,
                _rolesById: {},

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
                                return roleContainer.roles.map(function(role) {
                                    return collectRoles(self._rolesById[role.id]);
                                }).reduce(function(a,b) {
                                    Array.prototype.push.apply(a,b);
                                    return a;
                                },[roleContainer.role]);
                            }
                        };
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
                        $log.debug('roles: ',roles);
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
                        $log.debug('userContainer:',self._userContainer);
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

                hasRole: function(role) {
                    if (!this._userContainer) {
                        return false;
                    }
                    //$log.debug(this._userContainer.roleNames);
                    return -1 < this._userContainer.roleNames.indexOf(role);
                },

                canLogin: function() {
                    return this._fbReady;
                },

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

                logout: function() {
                    var defer = $q.defer(),
                        self = this;
                    this._user = null;
                    Parse.User.logOut().then(function() {
                        defer.resolve();
                        $rootScope.$broadcast('logout',{});
                    },function(error) {
                        handleParseError(error,self);
                        defer.reject(error);
                    });
                    return defer.promise;
                },

                isLoggedIn: function() {
                    return null !== this._user;
                },

                me: function() {
                    return this._user;
                },

                image: function() {
                    if (this._user) {
                        if (this._user.get('facebookId')) {
                            return 'https://graph.facebook.com/' + this._user.get('facebookId') + '/picture?type=square';
                        }
                        else {
                            return 'HOSTING_BASEassets/images/' + this._user.get('gender') + '.png';
                        }
                    }
                    else {
                        return null;
                    }
                },

                name: function() {
                    if (this._user) {
                        return this._user.get('name');
                    }
                    else {
                        return null;
                    }
                }
            };

            $rootScope.$on('fbReady',function() {
                $rootScope.$apply(function() {
                    AccountService._fbReady = true;
                    var user = Parse.User.current();
                    if (user) {
                        AccountService._setUser(user).then(function() {
                            $location.path('/home');
                        });
                    }
                });
            });

            return AccountService;
        }
    ]);

    services.factory('ZOBAngels.services.SlotService',[
        '$q',
        'ZOBAngels.services.AccountService',
        '$log',
        function($q,AccountService,$log) {

            var placeholder = function(type,roles) {
                return {
                    taken: function() {
                        return false;
                    },
                    type: function() {
                        return type;
                    },
                    roles: function() {
                        return roles;
                    },
                    name: function() {
                        if ('archangel' === type) {
                            return 'Tagesengel';
                        }
                        else if('translator' === type) {
                            return 'Übersetzerin / Übersetzer';
                        }
                        else if('medical' === type) {
                            return 'Ärztin / Arzt';
                        }
                        else {
                            return '';
                        }
                    }
                };
            };

            var slots = function(date,section,count,results) {
                var result = [],
                    i,
                    len = results.length,
                    current;
                for (i=0; i<len; i+=1) {
                    current = results[i];
                    if (current.fits(date,section)) {
                        result.push(current);
                    }
                }

                if (count > result.length) {
                    len = count - result.length;
                    for (i=0; i<len; i+=1) {
                        result.push(placeholder());
                    }
                }
                return result;
            };

            var extendedSlots = function(date,section,counts,results) {
                var result = [],
                    i,j,
                    len1,len = counts.length,
                    current,
                    taken = {};
                for (i=0; i<len; i+=1) {
                    taken[counts[i].type] = 0;
                }
                len = results.length;
                for (i=0; i<len; i+=1) {
                    current = results[i];
                    if (current.fits(date,section)) {
                        taken[current.type()] += 1;
                        result.push(current);
                    }
                }

                len = counts.length;
                for (i=0; i<len; i+=1) {
                    if (counts[i].count > taken[counts[i].type]) {
                        len1 = counts[i].count - taken[counts[i].type];
                        for (j=0; j<len1; j+=1) {
                            result.push(placeholder(counts[i].type,counts[i].roles));
                        }
                    }
                }
                return result;
            };

            var SlotService = {

                _initQueue: [],

                _initFailed: false,

                _config: null,

                _init: function() {
                    var self = this,
                        i,
                        len,
                        resolveListWithPromise = function(self,element) {
                            self.listWithPromise().then(function(results) {
                                element.defer.resolve(results);
                            }, function(error) {
                                element.defer.reject(error);
                            });
                        };
                    Parse.Config.get().then(function(config) {
                        self._config = config;
                        len = self._initQueue.length;
                        for (i=0; i<len; i+=1) {
                            if ('listWithPromise' === self._initQueue[i].action) {
                                resolveListWithPromise(self,self._initQueue[i]);
                            }
                            else {
                                self._initQueue[i].defer.reject('unknown');
                            }
                        }
                    }, function(error) {
                        handleParseError(error,AccountService);
                        self._initFailed = true;
                        len = self._initQueue.length;
                        for (i=0; i<len; i+=1) {
                            self._initQueue[i].defer.reject(error);
                        }
                    });
                },

                list: function() {
                    var result = [];

                    this.listWithPromise().then(function(results) {
                        console.log('results: ',results);
                        result.push.apply(result,results);
                    });

                    return result;
                },

                listWithPromise: function() {
                    var query = new Parse.Query(window.ZOBAngels.model.Assignment),
                        defer = $q.defer(),
                        result = [],
                        start = moment('20151109','YYYYMMDD').valueOf(),
                        today = moment(moment().format('YYYYMMDD'),'YYYYMMDD').valueOf(),
                        currentDate,
                        currentResult,
                        i,
                        id = '',
                        self = this;
                    if (!this._config) {
                        this._initQueue.push({
                            defer: defer,
                            action: 'listWithPromise'
                        });
                        return defer.promise;
                    }
                    start = Math.max(start,today);
                    if (Parse.User.current() && Parse.User.current().get('facebookId')) {
                        id = Parse.User.current().get('facebookId');
                    }

                    query.greaterThanOrEqualTo('date',start);
                    query.include('user');
                    query.limit(1000);
                    query.find()
                        .then(
                            function(results) {
                                for (i=0; i<14; i+=1) {
                                    currentDate = start + i * 86400000;
                                    currentResult = {
                                        date: moment(currentDate).format('dd, D. MMM'),
                                        _date: currentDate,
                                        sections: [
                                            {
                                                id: 'driver',
                                                title: 'Fahrer (17:30 - 19:00 uhr)',
                                                description: 'Aufgabe: Töpfe vom vorherigen Tag am ZOB abholen, in der Vokü befüllen lassen und wieder zurück zum ZOB bringen',
                                                slots: slots(currentDate,'driver',1,results),
                                                extendedSlots: extendedSlots(currentDate,'driver',[{
                                                    count: 1,
                                                    type: 'angel',
                                                    roles: ['angel']
                                                }],results)
                                            },
                                            {
                                                id: 'one',
                                                title: '18-20 Uhr',
                                                description: 'Aufgabe: Kleider & Essensausgabe',
                                                slots: slots(currentDate,'one',6,results),
                                                extendedSlots: extendedSlots(currentDate,'one',[{
                                                    count: 6,
                                                    type: 'angel',
                                                    roles: ['angel']
                                                },{
                                                    count: AccountService.hasRole('archangel') ? 1 : 0,
                                                    type: 'archangel',
                                                    roles: ['archangel']
                                                },{
                                                    count: AccountService.hasRole('translator') ? 2 : 0,
                                                    type: 'translator',
                                                    roles: ['translator']
                                                },{
                                                    count: AccountService.hasRole('medical') ? 0 : 0,
                                                    type: 'medical',
                                                    roles: ['medical']
                                                }],results)
                                            },
                                            {
                                                id: 'two',
                                                title: '20-22 Uhr',
                                                description: 'Aufgabe: Kleider & Essensausgabe',
                                                slots: slots(currentDate,'two',6,results),
                                                extendedSlots: extendedSlots(currentDate,'two',[{
                                                    count: 6,
                                                    type: 'angel',
                                                    roles: ['angel']
                                                },{
                                                    count: AccountService.hasRole('archangel') ? 1 : 0,
                                                    type: 'archangel',
                                                    roles: ['archangel']
                                                },{
                                                    count: AccountService.hasRole('translator') ? 2 : 0,
                                                    type: 'translator',
                                                    roles: ['translator']
                                                },{
                                                    count: AccountService.hasRole('medical') ? 0 : 0,
                                                    type: 'medical',
                                                    roles: ['medical']
                                                }],results)
                                            },
                                            {
                                                id: 'three',
                                                title: '22-24 Uhr',
                                                description: 'Aufgabe: Kleider & Essensausgabe (evtl. auch über 24 Uhr hinaus)',
                                                slots: slots(currentDate,'three',6,results),
                                                extendedSlots: extendedSlots(currentDate,'three',[{
                                                    count: 6,
                                                    type: 'angel',
                                                    roles: ['angel']
                                                },{
                                                    count: AccountService.hasRole('archangel') ? 1 : 0,
                                                    type: 'archangel',
                                                    roles: ['archangel']
                                                },{
                                                    count: AccountService.hasRole('translator') ? 2 : 0,
                                                    type: 'translator',
                                                    roles: ['translator']
                                                },{
                                                    count: AccountService.hasRole('medical') ? 0 : 0,
                                                    type: 'medical',
                                                    roles: ['medical']
                                                }],results)
                                            }
                                        ]
                                    };
                                    result.push(currentResult);
                                }
                                $log.debug('result: ',result);
                                defer.resolve(result);
                            },
                                function(error) {
                                handleParseError(error,AccountService);
                                defer.reject(error);
                            });

                    return defer.promise;
                },

                take: function(date,section,type) {
                    var assignment = window.ZOBAngels.model.Assignment.create(date,section,Parse.User.current(),type),
                        defer = $q.defer(),
                        self = this;

                    assignment.save()
                        .then(
                            function(assignment) {
                                defer.resolve(assignment);
                            },
                            function(assignment,error) {
                                handleParseError(error,AccountService);
                                defer.reject(error);
                            });

                    return defer.promise;
                },

                release: function(assignment) {
                    var defer = $q.defer();

                    assignment.destroy()
                        .then(
                            function(assignment) {
                                defer.resolve(placeholder(assignment.type()));
                            },function(assignment,error) {
                                handleParseError(error,AccountService);
                                defer.reject(error);
                            });

                    return defer.promise;
                }
            };

            SlotService._init();

            return SlotService;
        }
    ]);
})();