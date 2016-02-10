/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.controller.FaqController',[
        'ZOBAngels.service'
    ]).controller('ZOBAngels.controller.FaqController',[
        '$scope',
        'ZOBAngels.service.NavigationService',
        'ZOBAngels.service.FaqService',
        '$log',
        function($scope,NavigationService,FaqService,$log) {

            NavigationService.page(NavigationService.PAGE.FAQ);

            $scope.NavigationService = NavigationService;

            $scope.languages = ['de', 'en'];

            $scope.lang = 'de';

            $scope.changeLanguage = function(lang) {
                $scope.lang = lang;
            };

            $scope.faqEntries = [];

            $scope.newFaqEntry = createNewFaqEntry();

            $scope.adding = false;
            $scope.loading = false;
            $scope.addOpen = false;

            $scope.addButtonDisabled = function() {
                var disabled = false,
                    i, len = $scope.languages.length,
                    hasText = function(property) {
                        return undefined !== property && null !== property && 0 < property.length;
                    };
                for (i=0; i<len; i+=1) {
                    disabled |= !hasText($scope.newFaqEntry[$scope.languages[i]].question);
                    disabled |= !hasText($scope.newFaqEntry[$scope.languages[i]].answer);
                }
                return disabled;
            };

            $scope.create = function() {
                $scope.adding = true;
                var languages = [], i, len = $scope.languages.length;
                for (i=0; i<len; i+=1) {
                    languages.push({
                        language: $scope.languages[i],
                        question: $scope.newFaqEntry[$scope.languages[i]].question,
                        answer: $scope.newFaqEntry[$scope.languages[i]].answer
                    });
                }
                FaqService.create(languages).then(function() {
                    $scope.newFaqEntry = createNewFaqEntry();
                    $scope.adding = false;
                    refreshList();
                }, function(error) {
                    $scope.adding = false;
                    $log.error('error adding new FAQ entry: ',error);
                });
            };

            $scope.update = function(faqEntry) {

            };

            $scope.edit = function(faqEntry) {
                var i,len = $scope.languages.length;
                faqEntry._language = 'de';
                faqEntry._languages = {};
                for (i=0; i<len; i+=1) {
                    faqEntry._languages[$scope.languages[i]] = {
                        question: faqEntry.question($scope.languages[i]),
                        answer: faqEntry.answer($scope.languages[i])
                    };
                }
                faqEntry.edit = true;
            };

            $scope.cancel = function(faqEntry) {
                faqEntry._languages = null;
                faqEntry.edit = false;
            };

            $scope.save = function(faqEntry) {
                faqEntry.saving = true;
                FaqService.update(faqEntry,faqEntry._languages).then(function() {
                    refreshList();
                    faqEntry.saving = true;
                    faqEntry.edit = false;
                }, function() {
                    faqEntry.saving = true;
                });
            };

            refreshList();

            function refreshList() {
                $scope.loading = true;
                FaqService.listWithPromise().then(function(faqEntries) {
                    $scope.faqEntries.length = 0;
                    Array.prototype.push.apply($scope.faqEntries,faqEntries);
                    $scope.loading = false;
                }, function() {
                    $scope.loading = false;
                });
            }

            function createNewFaqEntry() {
                var i,len = $scope.languages.length,
                    newFaqEntry = {};

                for (i=0; i<len; i+=1) {
                    newFaqEntry[$scope.languages[i]] = {
                        question: '',
                        answer: ''
                    };
                }

                return newFaqEntry;
            }

            $log.debug('ZOBAngels.controller.FaqController loaded');
        }
    ]);
})();