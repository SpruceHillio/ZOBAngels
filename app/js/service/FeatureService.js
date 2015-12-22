/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.service.FeatureService',[

    ]).factory('ZOBAngels.service.FeatureService',[
        '$log',
        function($log) {
            var FeatureService = {
                _features: ['__FEATURES__'],

                hasFeature: function(feature) {
                    return -1 < this._features.indexOf(feature);
                }
            };

            return FeatureService;
        }
    ]);
})();