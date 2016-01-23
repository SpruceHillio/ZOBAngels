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
                },
                _shiftsConfig = '__SHIFTS__',
                shiftsConfig = function(dayOfWeek) {
                    var shiftConfig = _shiftsConfig[dayOfWeek];
                    if (undefined === shiftConfig || null === shiftConfig) {
                        shiftConfig = _shiftsConfig.DEFAULT;
                    }
                    return shiftConfig;
                },
                extendedSlots = function(date,section,counts,results) {
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

                _config: {
                    days: ['__CONFIG_DAYS__'],
                    timespan: '__CONFIG_TIMESPAN__'
                },

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
                    len = self._initQueue.length;
                    for (i=0; i<len; i+=1) {
                        if ('listWithPromise' === self._initQueue[i].action) {
                            resolveListWithPromise(self,self._initQueue[i]);
                        }
                        else {
                            self._initQueue[i].defer.reject('unknown');
                        }
                    }
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
                        date,
                        currentResult,
                        config,
                        i,j,
                        len = this._config.days.length,
                        day,
                        id = '',
                        self = this,
                        skip,
                        countMapper = function(count) {
                            return {
                                count: AccountService.hasAnyRole(count.roles) ? count.count : 0,
                                type: count.type,
                                roles: count.roles
                            };
                        },
                        shiftMapper = function(date,results) {
                            return function(shiftConfig) {
                                return {
                                    id: shiftConfig.id,
                                    title: shiftConfig.title,
                                    description: shiftConfig.description,
                                    extendedSlots: extendedSlots(date,shiftConfig.id,shiftConfig._counts.map(countMapper),results)
                                };
                            };
                        };
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

                    query.greaterThanOrEqualTo('date',parseInt(moment(new Date(start)).format('YYYYMMDD')));
                    query.include('user');
                    query.limit(1000);
                    query.find()
                        .then(
                        function(results) {
                            for (i=0; i<self._config.timespan; i+=1) {
                                currentDate = start + i * 86400000;
                                date = parseInt(moment(new Date(currentDate)).format('YYYYMMDD'));
                                skip = true;
                                day = moment(new Date(currentDate)).format('d');
                                for (j=0; j<len; j+=1) {
                                    if ('ALL' === self._config.days[j]) {
                                        skip = false;
                                        break;
                                    }
                                    if (day === self._config.days[j]) {
                                        skip = false;
                                        break;
                                    }
                                }
                                if (skip) {
                                    continue;
                                }
                                config = shiftsConfig(day);
                                currentResult = {
                                    date: moment(currentDate).format('dd, D. MMM'),
                                    //_date: currentDate,
                                    _date: date,
                                    sections: config.map(shiftMapper(date,results))/*,
                                    sections: [
                                        {
                                            id: 'driver',
                                            title: 'Fahrer (17:30 - 19:00 uhr)',
                                            description: 'Aufgabe: Töpfe vom vorherigen Tag am ZOB abholen, in die Vokü bringen und befüllen lassen. Beim Bäcker das Brot abholen und dann die vollen Töpfe wieder zurück zum ZOB bringen',
                                            //slots: slots(currentDate,'driver',1,results),
                                            extendedSlots: extendedSlots(date,'driver',[{
                                                count: 1,
                                                type: 'angel',
                                                roles: ['angel']
                                            }],results)
                                        },
                                        {
                                            id: 'one',
                                            title: '18-20 Uhr',
                                            description: 'Aufgabe: Kleider & Essensausgabe',
                                            //slots: slots(currentDate,'one',6,results),
                                            extendedSlots: extendedSlots(date,'one',[{
                                                count: 6,
                                                type: 'angel',
                                                roles: ['angel']
                                            },{
                                                count: AccountService.hasRole('archangel') ? 2 : 0,
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
                                            //slots: slots(currentDate,'two',6,results),
                                            extendedSlots: extendedSlots(date,'two',[{
                                                count: 5,
                                                type: 'angel',
                                                roles: ['angel']
                                            },{
                                                count: AccountService.hasRole('archangel') ? 4 : 0,
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
                                            //slots: slots(currentDate,'three',6,results),
                                            extendedSlots: extendedSlots(date,'three',[{
                                                count: 6,
                                                type: 'angel',
                                                roles: ['angel']
                                            },{
                                                count: AccountService.hasRole('archangel') ? 2 : 0,
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
                                    ]*/
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