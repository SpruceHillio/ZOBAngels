/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels',[
        'ui.bootstrap',
        'parse-angular',
        'ParseServices',
        'FacebookPatch',
        'ZOBAngels.services',
        'ZOBAngels.controllers'
    ]).
    run([
            'ParseSDK',
            'FacebookAngularPatch',
            function(ParseSDK,FacebookAngularPatch,$log) {}
        ]);
})();