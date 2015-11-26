/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.statistics.ByUserController',[
    ]).controller('ZOBAngels.controller.statistics.ByUserController',[
        '$scope',
        '$state',
        '$sce',
        '$log',
        function($scope,$state,$sce,$log) {

            $scope.days = [];

            $scope.users = [];

            $scope.charts = {
                usersByAssignments: {
                    labels: [],
                    data: []
                }
            };

            $scope.onlyOnceAndAWeekAgo = [];

            $scope.overallAngels = 0;

            var query = new Parse.Query(window.ZOBAngels.model.Assignment),
                i,
                len,
                current,
                entry,
                mapByDay = {},
                mapByUser = {},
                key,
                listByDay = [],
                listByUser = [],
                min = Number.POSITIVE_INFINITY,
                max = Number.NEGATIVE_INFINITY,
                data = {},
                now = new Date().getTime(),
                oneWeek = 8 * 24 * 60 * 60 * 1000;
            query.greaterThanOrEqualTo('date',moment('20151109','YYYYMMDD').valueOf());
            query.lessThanOrEqualTo('date',new Date().getTime() + (24 * 60 * 60 * 1000));
            query.include('user');
            query.limit(1000);
            query.find().then(function(results) {
                len = results.length;
                for (i=0; i<len; i+=1) {
                    current = results[i];
                    entry = mapByDay[''+current.get('date')];
                    if (!entry) {
                        entry = {
                            date: current.get('date'),
                            dateFormat: moment(current.get('date')).format('dd, D. MMM'),
                            one: [],
                            two: [],
                            three: []
                        };
                        mapByDay[''+current.get('date')] = entry;
                    }
                    if (entry[current.get('section')]) {
                        entry[current.get('section')].push(current);
                    }
                    entry = mapByUser[current.get('user').id];
                    if (!entry) {
                        entry = {
                            user: current.get("user"),
                            assignments: []
                        };
                        mapByUser[current.get('user').id] = entry;
                    }
                    entry.assignments.push(current);
                }
                for (key in mapByDay) {
                    if (mapByDay.hasOwnProperty(key)) {
                        listByDay.push(mapByDay[key]);
                    }
                }
                listByDay = listByDay.sort(function(a,b) {
                    return a.date - b.date;
                });
                for (key in mapByUser) {
                    if (mapByUser.hasOwnProperty(key)) {
                        if (!mapByUser[key].user.get('facebookId')) {
                            continue;
                        }
                        $scope.overallAngels++;
                        listByUser.push(mapByUser[key]);
                        min = Math.min(min,mapByUser[key].assignments.length);
                        max = Math.max(max,mapByUser[key].assignments.length);
                    }
                }
                listByUser = listByUser.sort(function(a,b) {
                    return b.assignments.length - a.assignments.length;
                });
                for (i=min; i<=max; i+=1) {
                    data['' + i] = {
                        value: i,
                        count: 0
                    };
                }

                listByUser.forEach(function(user) {
                    data['' + user.assignments.length].count += 1;
                    if (1 == user.assignments.length) {
                        if (oneWeek < (now - user.assignments[0].get('date'))) {
                            $scope.onlyOnceAndAWeekAgo.push(user);
                        }
                    }
                });
                for (i=min; i<=max; i+=1) {
                    $scope.charts.usersByAssignments.labels.push('' + i + 'x Engel');
                    $scope.charts.usersByAssignments.data.push(data['' + i].count);
                }
                Array.prototype.push.apply($scope.days,listByDay);
                Array.prototype.push.apply($scope.users,listByUser);
            });

            $scope.slot = function(date,section) {
                var sectionString;
                switch(section) {
                    case 'one':
                        sectionString = '18-20 Uhr';
                        break;
                    case 'two':
                        sectionString = '20-22 Uhr';
                        break;
                    case 'three':
                        sectionString = '22-24 Uhr';
                        break;
                    default:
                        sectionString = '???';
                        break;
                }
                return moment(date).format("YYYY-MM-DD") + '(' + sectionString + ')';
            };

            $scope.assignmentsString = function(assignments) {
                return assignments.map(function(assignment) {
                    var sectionString = assignment.get('section');
                    switch(sectionString) {
                        case 'one':
                            sectionString = '18-20 Uhr';
                            break;
                        case 'two':
                            sectionString = '20-22 Uhr';
                            break;
                        case 'three':
                            sectionString = '22-24 Uhr';
                            break;
                        case 'driver':
                            sectionString = 'Fahrer';
                            break;
                    }
                    return moment(assignment.get('date')).format("YYYY-MM-DD") + ' (' + sectionString + ')';
                }).join(', ');
            };

            $scope.linkedName = function(user) {
                var linkedName = user.get('name');
                if (user.get('facebookId')) {
                    linkedName = '<a href="https://facebook.com/' + user.get('facebookId') + '" target="_blank">' + linkedName + '<a/>';
                }
                return $sce.trustAsHtml(linkedName);
            };

            $log.debug('ZOBAngels.controller.statistics.ByUserController loaded');
        }
    ]);
})();