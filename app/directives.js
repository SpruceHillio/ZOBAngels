/**
 * Created by duergner on 08/11/15.
 */
(function() {
    'use strict';

    console.log('loading directives');

    var directives = angular.module('ZOBAngels.directives',[]);

    directives.directive('angelListPrint',[
        '$compile',
        '$templateCache',
        '$controller',
        '$timeout',
        '$log',
        function($compile,$templateCache,$controller,$timeout,$log) {
            $log.debug('angelListPrint directive');
            return {
                restrict: 'A',
                scope: {
                    sections: '=',
                    date: '='
                },
                link: function($scope,element,attrs) {

                    element.on('click',function() {
                        $scope.$apply(function() {
                            var templateScope = $scope.$new(),
                                isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1,
                                popupWin = window.open('', '_blank', 'width=600,height=600' + (isChrome ? ',scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no' : '')),
                                i, j,m,
                                l = $scope.sections.length,
                                section,slot;
                            templateScope.title = 'Engel Liste für ' + $scope.date;
                            templateScope.sections = [];
                            $log.debug($scope.sections);
                            for (i=0; i<l; i+=1) {
                                section = {
                                    headline: $scope.sections[i].title,
                                    slots: []
                                };
                                m = $scope.sections[i].extendedSlots.length;
                                for (j=0; j<m; j+=1) {
                                    if ($scope.sections[i].extendedSlots[j].taken()) {
                                        slot = {
                                            name: $scope.sections[i].extendedSlots[j].name(),
                                            type: $scope.sections[i].extendedSlots[j].typeName()
                                        };
                                        section.slots.push(slot);
                                    }
                                }
                                templateScope.sections.push(section);
                            }
                            var compiled = $compile($templateCache.get('templates/_angelListPrint.html'))(templateScope);
                            var div = $('<div></div>');
                            div.append(compiled);
                            if (isChrome) {
                                popupWin.window.focus();
                            }
                            else {
                                popupWin.document.open();
                            }
                            $timeout(function() {
                                popupWin.document.write(div[0].innerHTML);
                                if (!isChrome) {
                                    popupWin.document.close();
                                }
                                popupWin.window.print();
                            },500);
                            if (isChrome) {
                                popupWin.onbeforeunload = function (event) {
                                    popupWin.close();
                                    return '.\n';
                                };
                                popupWin.onabort = function (event) {
                                    popupWin.document.close();
                                    popupWin.close();
                                };
                            }
                        });
                    });
                }
            };
        }
    ]);
})();