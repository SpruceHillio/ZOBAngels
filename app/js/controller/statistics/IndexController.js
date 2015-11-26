/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.statistics.IndexController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.statistics.IndexController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        '$state',
        '$log',
        function($scope,NavigationService,$state,$log) {

            NavigationService.page(NavigationService.PAGE.STATISTICS);

            $scope.section = function() {
                return $state.is('statistics.day') ? 'day' : $state.is('statistics.user') ? 'user' : null;
            };

            $log.debug('section: ',$scope.section, $state.$current.name);

        }
    ]);
})();