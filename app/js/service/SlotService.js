/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.service.SlotService',[
        'ZOBAngels.service.AccountService'
    ]).factory('ZOBAngels.service.SlotService',[
        '$q',
        'ZOBAngels.service.AccountService',
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
                        Array.prototype.push.apply(result,results);
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
                                                count: 5,
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