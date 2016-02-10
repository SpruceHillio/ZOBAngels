/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.service.FaqService',[

    ]).factory('ZOBAngels.service.FaqService',[
        '$q',
        '$log',
        function($q, $log) {
            var FaqService = {
                _faqEntries: [],

                list: function() {
                    this.listWithPromise();
                    return this._faqEntries;
                },

                listWithPromise: function() {
                    var defer = $q.defer(),
                        self = this;

                    new Parse.Query(window.ZOBAngels.model.FaqEntry).find().then(function(results) {
                        self._faqEntries.length = 0;
                        Array.prototype.push.apply(self._faqEntries,results);
                        defer.resolve(self._faqEntries);
                    }, function(error) {
                        defer.reject(error);
                    });

                    return defer.promise;
                },

                create: function(languages) {
                    var faqEntry = window.ZOBAngels.model.FaqEntry.create(),
                        i,len = languages.length;
                    for(i=0; i<len; i+=1) {
                        faqEntry.addLanguage(languages[i].language,languages[i].question,languages[i].answer);
                    }
                    return faqEntry.save();
                },

                update: function(faqEntry, languages) {
                    var key;
                    for (key in languages) {
                        if (languages.hasOwnProperty(key)) {
                            faqEntry.updateLanguage(key,languages[key].question,languages[key].answer);
                        }
                    }
                    return faqEntry.save();
                }

            };

            return FaqService;
        }
    ]);
})();