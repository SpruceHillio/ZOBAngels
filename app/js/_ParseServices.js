/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    var parseServices = angular.module('ParseServices', []);
    parseServices.factory('ParseSDK', function() {
        Parse.initialize("__PARSE_APPLICATION_ID__", "__PARSE_JAVA_SCRIPT_KEY__");
        // FACEBOOK init
        window.fbPromise.then(function() {
            Parse.FacebookUtils.init({
                appId: '__FACEBOOK_ID__', // Facebook App ID
                cookie: true, // enable cookies to allow Parse to access the session
                xfbml: true, // parse XFBML
                frictionlessRequests: true // recommended
            });
        });
        return {};
    });
})();