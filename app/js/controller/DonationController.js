/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.DonationController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.DonationController',[
        '$scope',
        '$sce',
        'ZOBAngels.service.NavigationService',
        '$log',
        function($scope,$sce,NavigationService,$log) {

            NavigationService.page(NavigationService.PAGE.DONATION);

            $scope.NavigationService = NavigationService;

            $scope.post = {
                show: false
            };

            if (FB) {
                FB.apiAngular('/v2.5/__FACEBOOK_PINNED_POST__').then(function(post) {
                    if (post) {
                        $scope.post.show = true;
                        $scope.post.message = $sce.trustAsHtml(post.message.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2'));
                    }
                });
            }

            $log.debug('ZOBAngels.controller.DonationController loaded');
        }
    ]);
})();