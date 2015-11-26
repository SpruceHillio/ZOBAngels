/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    angular.module('ZOBAngels.service.InventoryService',[
        'ZOBAngels.service.AccountService'
    ]).factory('ZOBAngels.service.InventoryService',[
        '$q',
        'ZOBAngels.service.AccountService',
        '$log',
        function($q,AccountService,$log) {

            var InventoryService = {

                /**
                 *
                 */
                _data: {
                    man: {
                        name: 'Männer',
                        icon: 'fa-male',
                        entries: [
                            {
                                id: 'trouser_sm',
                                name: 'Hose (S/M)'
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)'
                            },
                            {
                                id: 'shoe_38',
                                name: 'Schuhe (38)'
                            },
                            {
                                id: 'shoe_39',
                                name: 'Schuhe (39)'
                            },
                            {
                                id: 'shoe_40',
                                name: 'Schuhe (40)'
                            },
                            {
                                id: 'shoe_41',
                                name: 'Schuhe (41)'
                            },
                            {
                                id: 'shoe_42',
                                name: 'Schuhe (42)'
                            },
                            {
                                id: 'shoe_43',
                                name: 'Schuhe (43)'
                            },
                            {
                                id: 'shoe_44',
                                name: 'Schuhe (44)'
                            },
                            {
                                id: 'shoe_45',
                                name: 'Schuhe (45)'
                            }
                        ]
                    },
                    woman: {
                        name: 'Frauen',
                        icon: 'fa-female',
                        entries: [
                            {
                                id: 'trouser_sm',
                                name: 'Hose (S/M)'
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)'
                            },
                            {
                                id: 'shoe_38',
                                name: 'Schuhe (38)'
                            },
                            {
                                id: 'shoe_39',
                                name: 'Schuhe (39)'
                            },
                            {
                                id: 'shoe_40',
                                name: 'Schuhe (40)'
                            },
                            {
                                id: 'shoe_41',
                                name: 'Schuhe (41)'
                            },
                            {
                                id: 'shoe_42',
                                name: 'Schuhe (42)'
                            }
                        ]
                    },
                    child: {
                        name: 'Kinder',
                        icon: 'fa-child',
                        entries: [
                            {
                                id: 'trouser_sm',
                                name: 'Hose (S/M)'
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)'
                            },
                            {
                                id: 'shoe_38',
                                name: 'Schuhe (38)'
                            }
                        ]
                    },
                    food: {
                        name: 'Essen & Trinken',
                        icon: 'fa-cutlery',
                        entries: [
                            {
                                id: 'shoe_39',
                                name: 'Schuhe (39)'
                            },
                            {
                                id: 'shoe_40',
                                name: 'Schuhe (40)'
                            }
                        ]
                    },
                    other: {
                        name: 'Sonstiges',
                        icon: 'fa-cubes',
                        entries: [
                            {
                                id: 'trouser_sm',
                                name: 'Hose (S/M)'
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)'
                            }
                        ]
                    }
                },

                /**
                 *
                 */
                _list: null,

                /**
                 *
                 * @returns {object}
                 */
                list: function() {
                    if (!this._list) {
                        this._list = [];
                        var key;
                        for (key in this._data) {
                            if (this._data.hasOwnProperty(key)) {
                                this._list.push({
                                    id: key,
                                    name: this._data[key].name,
                                    icon: this._data[key].icon
                                });
                            }
                        }
                    }
                    return this._list;
                },

                /**
                 *
                 * @param {string} section
                 * @returns {object }
                 */
                detail: function(section) {
                    return this._data[section];
                }
            };

            return InventoryService;
        }
    ]);
})();