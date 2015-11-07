/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    var parseServices = angular.module('ParseServices', []);
    parseServices.factory('ParseSDK', function() {
        Parse.initialize("PARSE_APPLICATION_ID", "PARSE_JAVA_SCRIPT_KEY");
        // FACEBOOK init
        window.fbPromise.then(function() {
            Parse.FacebookUtils.init({
                appId: 'FACEBOOK_ID', // Facebook App ID
                cookie: true, // enable cookies to allow Parse to access the session
                xfbml: true, // parse XFBML
                frictionlessRequests: true // recommended
            });
        });
        return {};
    });
    console.log('loaded ParseServices');
})();