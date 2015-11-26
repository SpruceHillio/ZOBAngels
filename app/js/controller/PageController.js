/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.PageController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.PageController',[
        '$scope',
        'ZOBAngels.service.AccountService',
        '$log',
        function($scope, AccountService, $log) {
            $scope.ready = function() {
                return AccountService.ready();
            };
        }
    ]);
})();