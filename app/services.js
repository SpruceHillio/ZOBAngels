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

    services.factory('ZOBAngels.services.AccountService',[
        '$rootScope',
        '$q',
        '$log',
        function($rootScope,$q,$log) {

            var AccountService = {
                _fbReady: false,

                _user: null,

                canLogin: function() {
                    return this._fbReady;
                },

                login: function(userData) {
                    if (!this._fbReady) {
                        return;
                    }

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
                            defer.resolve(user);
                            $rootScope.$broadcast('login',{
                                user: user
                            });
                        };


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
                    Parse.User.logout().then(function() {
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
                            return 'https://graph.facebook.com/' + this._user.get('facebookId') + '/picture?type=normal';
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
                        AccountService._user = user;
                        $rootScope.$broadcast('login',{
                            user: user
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

            var placeholder = function() {
                return {
                    taken: function() {
                        return false;
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
                    var query = new Parse.Query(window.ZOBAngels.Assignment),
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
                                                slots: slots(currentDate,'driver',1,results)
                                            },
                                            {
                                                id: 'one',
                                                title: '18-20 Uhr',
                                                description: 'Aufgabe: Kleider & Essensausgabe',
                                                slots: slots(currentDate,'one',6,results)
                                            },
                                            {
                                                id: 'two',
                                                title: '20-22 Uhr',
                                                description: 'Aufgabe: Kleider & Essensausgabe',
                                                slots: slots(currentDate,'two',6,results)
                                            },
                                            {
                                                id: 'three',
                                                title: '22-24 Uhr',
                                                description: 'Aufgabe: Kleider & Essensausgabe',
                                                slots: slots(currentDate,'three',6,results)
                                            }
                                        ]
                                    };
                                    if (-1 < self._config.get('zobangels_type_angels').indexOf(id)) {
                                        currentResult.sections.splice(1,0,{
                                            id: 'angel',
                                            title: 'Tagesengel',
                                            description: '',
                                            slots: slots(currentDate,'angel',3,results)
                                        });
                                    }
                                    result.push(currentResult);
                                }

                                defer.resolve(result);
                            },
                                function(error) {
                                handleParseError(error,AccountService);
                                defer.reject(error);
                            });

                    return defer.promise;
                },

                take: function(date,section) {
                    var assignment = window.ZOBAngels.Assignment.create(date,section,Parse.User.current()),
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
                                defer.resolve(placeholder());
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