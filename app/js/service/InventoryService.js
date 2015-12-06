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
                                name: 'Hose (S/M)',
                                unit: 'Stück',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)',
                                unit: 'Stück',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'gloves',
                                name: 'Handschuhe',
                                unit: 'Kiste',
                                quantities: ['0', '1/2', '1', '1 1/2', '2']
                            },
                            {
                                id: 'socks',
                                name: 'Socken',
                                unit: 'Kiste',
                                quantities: ['0', '1/2', '1', '1 1/2', '2']
                            },
                            {
                                id: 'caps',
                                name: 'Mützen',
                                unit: 'Kiste',
                                quantities: ['0', '1/2', '1', '1 1/2', '2']
                            },
                            {
                                id: 'shoe_38',
                                name: 'Schuhe (38)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_39',
                                name: 'Schuhe (39)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_40',
                                name: 'Schuhe (40)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_41',
                                name: 'Schuhe (41)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_42',
                                name: 'Schuhe (42)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_43',
                                name: 'Schuhe (43)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_44',
                                name: 'Schuhe (44)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_45',
                                name: 'Schuhe (45)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            }
                        ]
                    },
                    woman: {
                        name: 'Frauen',
                        icon: 'fa-female',
                        entries: [
                            {
                                id: 'trouser_sm',
                                name: 'Hose (S/M)',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'shoe_38',
                                name: 'Schuhe (38)',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_39',
                                name: 'Schuhe (39)',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_40',
                                name: 'Schuhe (40)',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_41',
                                name: 'Schuhe (41)',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_42',
                                name: 'Schuhe (42)',
                                quantities: ['0','1','2','3','4','5+']
                            }
                        ]
                    },
                    child: {
                        name: 'Kinder',
                        icon: 'fa-child',
                        entries: [
                            {
                                id: 'trouser_sm',
                                name: 'Hose (S/M)',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'shoe_38',
                                name: 'Schuhe (38)',
                                quantities: ['0','1','2','3','4','5+']
                            }
                        ]
                    },
                    food: {
                        name: 'Essen & Trinken',
                        icon: 'fa-cutlery',
                        entries: [
                            {
                                id: 'shoe_39',
                                name: 'Schuhe (39)',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_40',
                                name: 'Schuhe (40)',
                                quantities: ['0','1','2','3','4','5+']
                            }
                        ]
                    },
                    other: {
                        name: 'Sonstiges',
                        icon: 'fa-cubes',
                        entries: [
                            {
                                id: 'trouser_sm',
                                name: 'Hose (S/M)',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)',
                                quantities: ['0','1','2','3','4','5+']
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
                                    icon: this._data[key].icon/*,
                                    unit: this._data[key].unit,
                                    quantities: this._data[key].quantities*/
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
                    var today = moment().format('YYYYMMDD'),
                        yesterday = moment().subtract(1,'days').format('YYYYMMDD'),
                        i,
                        len,
                        inventory,
                        data = this._data[section],
                        setQuantity = function(data,inventory,today) {
                            var i,len = data.entries.length;
                            for (i=0; i<len; i+=1) {
                                if (data.entries[i].id === inventory.key() && (undefined === data.entries[i].quantity || null === data.entries[i].quantity)) {
                                    data.entries[i].quantity = inventory.quantity();
                                    data.entries[i].today = today;
                                    break;
                                }
                            }
                        };

                    var todayQuery = new Parse.Query(window.ZOBAngels.model.Inventory)
                            .equalTo('date',today)
                            .equalTo('section',section),
                        yesterdayQuery = new Parse.Query(window.ZOBAngels.model.Inventory)
                            .equalTo('date',yesterday)
                            .equalTo('section',section);
                    Parse.Promise.when(todayQuery.find(),yesterdayQuery.find()).then(function(todayResults,yesterdayResults) {
                        len = todayResults.length;
                        for (i=0; i<len; i+=1) {
                            inventory = todayResults[i];
                            setQuantity(data,inventory,true);
                        }
                        len = yesterdayResults.length;
                        for (i=0; i<len; i+=1) {
                            inventory = todayResults[i];
                            setQuantity(data,inventory,false);
                        }
                    });
                    return data;
                },

                save: function(section, id, quantity) {
                    var date = moment().format('YYYYMMDD');

                    $log.debug('date: ',date,' section: ',section,' id: ',id, ' quantity: ',quantity);

                    var query = new Parse.Query(window.ZOBAngels.model.Inventory)
                        .equalTo('date',date)
                        .equalTo('section',section)
                        .equalTo('key',id);

                    query.first().then(function(inventory) {
                        $log.debug('queried inventory: ',inventory);
                        if (undefined === inventory || null === inventory) {
                            inventory = window.ZOBAngels.model.Inventory.create(date,section,id,quantity);
                        }
                        inventory.quantity(quantity);

                        inventory.save()
                            .then(
                            function(inventory) {
                                $log.debug('created');
                            },
                            function(inventory,error) {
                                $log.debug('failed: ',error);
                            });
                    });

                }
            };

            return InventoryService;
        }
    ]);
})();