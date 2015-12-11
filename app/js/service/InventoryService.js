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
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover',
                                name: 'Pullover',
                                unit: 'Stück',
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'jacket_sm',
                                name: 'Jacke (S/M)',
                                unit: 'Stück',
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'jacket_l',
                                name: 'Jacke (L)',
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
                    unisex: {
                        name: 'Unisex',
                        icon: 'fa-users',
                        entries: [
                            {
                                id: 'caps',
                                name: 'Mützen',
                                unit: 'Kiste',
                                quantities: ['0', '1/2', '1', '1 1/2', '2']
                            },
                            {
                                id: 'gloves',
                                name: 'Handschuhe',
                                unit: 'Kiste',
                                quantities: ['0', '1/2', '1', '1 1/2', '2']
                            },
                            {
                                id: 'scarf',
                                name: 'Schal',
                                unit: 'Kiste',
                                quantities: ['0', '1/2', '1', '1 1/2', '2']
                            },
                            {
                                id: 'socks',
                                name: 'Socken',
                                unit: 'Kiste',
                                quantities: ['0', '1/2', '1', '1 1/2', '2']
                            }
                        ]
                    },
                    woman: {
                        name: 'Frauen',
                        icon: 'fa-female',
                        entries: [
                            {
                                id: 'trouser',
                                name: 'Hose',
                                unit: 'Stück',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'pullover',
                                name: 'Pullover',
                                unit: 'Stück',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'jacket',
                                name: 'Pullover',
                                unit: 'Stück',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'stocking',
                                name: 'Strumpfhosen',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'leggings',
                                name: 'Leggings',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'shoe_36',
                                name: 'Schuhe (36)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'shoe_37',
                                name: 'Schuhe (37)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
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
                                id: 'hygiene',
                                name: 'Hygieneartikel',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            }
                        ]
                    },
                    child: {
                        name: 'Kinder',
                        icon: 'fa-child',
                        entries: [
                            {
                                id: 'trouser_134',
                                name: 'Hose (134)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_140',
                                name: 'Hose (140)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_146',
                                name: 'Hose (146)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_152',
                                name: 'Hose (152)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_158',
                                name: 'Hose (158)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_164',
                                name: 'Hose (164)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_170',
                                name: 'Hose (170)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_176',
                                name: 'Hose (176)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_134',
                                name: 'Pullover (134)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_140',
                                name: 'Pullover (140)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_146',
                                name: 'Pullover (146)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_152',
                                name: 'Pullover (152)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_158',
                                name: 'Pullover (158)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_164',
                                name: 'Pullover (164)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_170',
                                name: 'Pullover (170)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'pullover_176',
                                name: 'Pullover (176)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_134',
                                name: 'Jacke (134)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_140',
                                name: 'Jacke (140)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_146',
                                name: 'Jacke (146)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_152',
                                name: 'Jacke (152)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_158',
                                name: 'Jacke (158)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_164',
                                name: 'Jacke (164)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_170',
                                name: 'Jacke (170)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'jacket_176',
                                name: 'Jacke (176)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'trouser_l',
                                name: 'Hose (L)',
                                unit: 'Stück',
                                quantities: ['0','2','4','6','8','10+']
                            },
                            {
                                id: 'shoe_21',
                                name: 'Schuhe (21)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_22',
                                name: 'Schuhe (22)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_23',
                                name: 'Schuhe (23)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_24',
                                name: 'Schuhe (24)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_25',
                                name: 'Schuhe (25)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_26',
                                name: 'Schuhe (26)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_27',
                                name: 'Schuhe (27)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_28',
                                name: 'Schuhe (28)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_29',
                                name: 'Schuhe (29)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_30',
                                name: 'Schuhe (30)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_31',
                                name: 'Schuhe (31)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_32',
                                name: 'Schuhe (32)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_33',
                                name: 'Schuhe (33)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_34',
                                name: 'Schuhe (34)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'shoe_35',
                                name: 'Schuhe (35)',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'socks',
                                name: 'Socken',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'caps',
                                name: 'Mützen',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'gloves',
                                name: 'Handschuhe`',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'scarf',
                                name: 'Schal',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'underwear',
                                name: 'Unterwäsche',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'toys',
                                name: 'Spielzeug',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            }
                        ]
                    },
                    baby: {
                        name: 'Baby',
                        icon: 'fa-child',
                        entries: [
                            {
                                id: 'sleepingbag',
                                name: 'Schlafsack',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'clothing',
                                name: 'KLeindung',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1','1 1/2','2+']
                            },
                            {
                                id: 'socks',
                                name: 'Socken',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'nappies_1',
                                name: 'Windel (1)',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'nappies_2',
                                name: 'Windel (2)',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'nappies_3',
                                name: 'Windel (3)',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'nappies_4',
                                name: 'Windel (4)',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'nappies_5',
                                name: 'Windel (5)',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'nappies_6',
                                name: 'Windel (6)',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'changingmat',
                                name: 'Wickelunterlagen',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'wet_tissues',
                                name: 'Feuchttücher',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'toys',
                                name: 'Kuscheltiere',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            }
                        ]
                    },
                    food: {
                        name: 'Essen & Trinken',
                        icon: 'fa-cutlery',
                        entries: [
                            {
                                id: 'chocolate_cookie',
                                name: 'Kekse & Schokolade',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'fruit',
                                name: 'Obst',
                                unit: 'Kiste',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'banana',
                                name: 'Banane',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'bread',
                                name: 'Brot',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1','1 1/2','2+']
                            },
                            {
                                id: 'banana',
                                name: 'Banane',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'banana',
                                name: 'Banane',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'instant_soup',
                                name: 'Fertigsuppe',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'water_small',
                                name: 'Wasser (klein)',
                                unit: 'Kiste',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'water_big',
                                name: 'Wasser (groß)',
                                unit: 'Liter',
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'savory',
                                name: 'Salziges',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'fruit_whatever',
                                name: 'Fruchtquetschis',
                                unit: 'Stück',
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'milk',
                                name: 'Milch',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'sugar',
                                name: 'Zucker',
                                unit: 'Kilo',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'salt',
                                name: 'Salz',
                                unit: 'Stück',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'baby',
                                name: 'Babynahrung',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            }
                        ]
                    },
                    other: {
                        name: 'Sonstiges',
                        icon: 'fa-cubes',
                        entries: [
                            {
                                id: 'blanket_light',
                                name: 'Decke (leicht)',
                                unit: 'Stück',
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'blanket_heavy',
                                name: 'Decke (warm)',
                                unit: 'Stück',
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'blanket_rescue',
                                name: 'Rettungsdecke',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'isomat',
                                name: 'Isomatte',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'sleepingbag',
                                name: 'Schlafsack',
                                unit: 'Stück',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'hygiene',
                                name: 'Hygieneartikel',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'soles',
                                name: 'Einlegesolen',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'trashbag',
                                name: 'Müllsack',
                                unit: 'Rolle',
                                quantities: ['0','1','2','3','4','5+']
                            },
                            {
                                id: 'zewa',
                                name: 'Zewa',
                                unit: 'Rolle',
                                quantities: ['0','1','2','3+']
                            },
                            {
                                id: 'plate_flat',
                                name: 'Teller',
                                unit: 'Stück',
                                quantities: ['0','5','10','15','20','25+']
                            },
                            {
                                id: 'cup',
                                name: 'Becher',
                                unit: 'Stück',
                                quantities: ['0','50','100','150','200+']
                            },
                            {
                                id: 'spoon',
                                name: 'Löffel',
                                unit: 'Stück',
                                quantities: ['0','50','100','150','200+']
                            },
                            {
                                id: 'plate_deep',
                                name: 'Suppenbecher',
                                unit: 'Stück',
                                quantities: ['0','50','100','150','200+']
                            },
                            {
                                id: 'warmer',
                                name: 'Wärmflasche',
                                unit: 'Kiste',
                                quantities: ['0','1/2','1+']
                            },
                            {
                                id: 'schnuller',
                                name: 'Schnuller',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'baby_bottle',
                                name: 'Babyflasche',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
                            },
                            {
                                id: 'bag_small',
                                name: 'Proviantbeutel',
                                unit: 'Kiste',
                                quantities: ['0','1/4','1/2+']
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