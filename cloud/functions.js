/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function(global,factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        if (typeof global.ZOBAngels === 'undefined') {
            global.ZOBAngels = {};
        }
        global.ZOBAngels.model = factory();
    }
})(this,function() {
    return function(config,model,texts,helpers,security,moment) {

        return {
            _placeholder: function(type,roles) {
                return {
                    _type: type,
                    _roles: roles
                };
            },

            _assignment: function(assignment) {
                return {
                    _type: assignment.get('type'),
                    _section: assignment.get('section'),
                    _date: assignment.get('date'),
                    _user: {
                        name: assignment.get('user').get('name'),
                        id: assignment.get('user').id,
                        image: assignment.get('user').get('facebookId')
                    }
                };
            },

            _extendedSlots: function(date,section,counts,results) {
                var result = [],
                    i,j,
                    len1,len = counts.length,
                    current,
                    taken = {},
                    self = this;
                for (i=0; i<len; i+=1) {
                    taken[counts[i].type] = 0;
                }
                len = results.length;
                for (i=0; i<len; i+=1) {
                    current = results[i];
                    if (current.fits(date,section)) {
                        taken[current.type()] += 1;
                        result.push(self._assignment(current));
                    }
                }

                len = counts.length;
                for (i=0; i<len; i+=1) {
                    if (counts[i].count > taken[counts[i].type]) {
                        len1 = counts[i].count - taken[counts[i].type];
                        for (j=0; j<len1; j+=1) {
                            result.push(self._placeholder(counts[i].type,counts[i].roles));
                        }
                    }
                }
                return result;
            },

            sectionsWithAssignments: function(request,response) {
                var query = new Parse.Query(model.Assignment),
                    rolesPromise = security.roles(request.user),
                    result = [],
                    start = request.params.today,
                    currentDate,
                    currentResult,
                    i,
                    id = '',
                    self = this,
                    hasRole = function(roles,role) {
                        return -1 < roles.indexOf(role);
                    };

                query.greaterThanOrEqualTo('date',start);
                query.include('user');
                query.limit(1000);
                Parse.Promise.when(rolesPromise,query.find())
                    .then(
                    function(roles,results) {
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
                                        extendedSlots: self._extendedSlots(currentDate,'driver',[{
                                            count: 1,
                                            type: 'angel',
                                            roles: ['angel']
                                        }],results)
                                    },
                                    {
                                        id: 'one',
                                        title: '18-20 Uhr',
                                        description: 'Aufgabe: Kleider & Essensausgabe',
                                        extendedSlots: self._extendedSlots(currentDate,'one',[{
                                            count: 6,
                                            type: 'angel',
                                            roles: ['angel']
                                        },{
                                            count: hasRole(roles,'archangel') ? 1 : 0,
                                            type: 'archangel',
                                            roles: ['archangel']
                                        },{
                                            count: hasRole(roles,'translator') ? 2 : 0,
                                            type: 'translator',
                                            roles: ['translator']
                                        },{
                                            count: hasRole(roles,'medical') ? 0 : 0,
                                            type: 'medical',
                                            roles: ['medical']
                                        }],results)
                                    },
                                    {
                                        id: 'two',
                                        title: '20-22 Uhr',
                                        description: 'Aufgabe: Kleider & Essensausgabe',
                                        extendedSlots: self._extendedSlots(currentDate,'two',[{
                                            count: 6,
                                            type: 'angel',
                                            roles: ['angel']
                                        },{
                                            count: hasRole(roles,'archangel') ? 1 : 0,
                                            type: 'archangel',
                                            roles: ['archangel']
                                        },{
                                            count: hasRole(roles,'translator') ? 2 : 0,
                                            type: 'translator',
                                            roles: ['translator']
                                        },{
                                            count: hasRole(roles,'medical') ? 0 : 0,
                                            type: 'medical',
                                            roles: ['medical']
                                        }],results)
                                    },
                                    {
                                        id: 'three',
                                        title: '22-24 Uhr',
                                        description: 'Aufgabe: Kleider & Essensausgabe (evtl. auch über 24 Uhr hinaus)',
                                        extendedSlots: self._extendedSlots(currentDate,'three',[{
                                            count: 6,
                                            type: 'angel',
                                            roles: ['angel']
                                        },{
                                            count: hasRole(roles,'archangel') ? 1 : 0,
                                            type: 'archangel',
                                            roles: ['archangel']
                                        },{
                                            count: hasRole(roles,'translator') ? 2 : 0,
                                            type: 'translator',
                                            roles: ['translator']
                                        },{
                                            count: hasRole(roles,'medical') ? 0 : 0,
                                            type: 'medical',
                                            roles: ['medical']
                                        }],results)
                                    }
                                ]
                            };
                            result.push(currentResult);
                        }
                        response.success(result);
                    },
                    function(error) {
                        response.error(error);
                    });

            }
        };
    };
});