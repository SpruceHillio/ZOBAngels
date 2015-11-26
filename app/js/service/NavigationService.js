/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.service.NavigationService',[
        'ZOBAngels.service.AccountService'
    ]).factory('ZOBAngels.service.NavigationService',[
        '$q',
        'ZOBAngels.service.AccountService',
        '$log',
        function($q,AccountService,$log) {

            var NavigationService = {

                PAGE: {
                    LOADING: 'loading',
                    LOGIN: 'login',
                    PROFILE: 'profile',
                    HOME: 'home',
                    ABOUT: 'about',
                    DONATION: 'donation',
                    FAQ: 'faq',
                    ADMIN: 'admin',
                    INVENTORY: 'inventory',
                    STATISTICS: 'statistics'
                },

                _page: null,
                _section: null,

                page: function(page) {
                    if (page) {
                        if (-1 < page.indexOf('.')) {
                            this._page = page.substr(0,page.indexOf('.'));
                            this._section = page.substr(page.indexOf('.')+1);
                        }
                        else {
                            this._page = page;
                        }
                    }
                    if (!this._page) {
                        return NavigationService.PAGE.HOME;
                    }
                    else {
                        return this._page;
                    }
                },

                section: function() {
                    return this._section;
                }
            };

            return NavigationService;
        }
    ]);
})();