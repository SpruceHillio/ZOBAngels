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
                _data: ZOBAngels.data.Inventory,

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
                        var key,
                            successCallback = function(entry) {
                                return function(count) {
                                    entry.today = count;
                                };
                            },
                            entry,
                            today = moment.utc();
                        if (today.hour() < 10) {
                            today = today.subtract(1,'days');
                        }
                        today = today.format('YYYYMMDD');
                        for (key in this._data) {
                            if (this._data.hasOwnProperty(key)) {
                                entry = {
                                    id: key,
                                    name: this._data[key].name,
                                    icon: this._data[key].icon,
                                    today: '-',
                                    overall: this._data[key].entries.length/*,
                                     unit: this._data[key].unit,
                                     quantities: this._data[key].quantities*/
                                };
                                this._list.push(entry);
                                new Parse.Query('Inventory').equalTo('section',key).equalTo('date',today).count().then(successCallback(entry));
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
                    var today = moment().utc(),
                        yesterday,
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
                        },
                        todayQuery,
                        yesterdayQuery;
                    if (today.hour() < 10) {
                        today = today.subtract(1,'days');
                    }
                    yesterday = today.clone().subtract(1,'days');

                    todayQuery = new Parse.Query(window.ZOBAngels.model.Inventory)
                            .equalTo('date',today.format('YYYYMMDD'))
                            .equalTo('section',section);
                    yesterdayQuery = new Parse.Query(window.ZOBAngels.model.Inventory)
                            .equalTo('date',yesterday.format('YYYYMMDD'))
                            .equalTo('section',section);

                    Parse.Promise.when(todayQuery.find(),yesterdayQuery.find()).then(function(todayResults,yesterdayResults) {
                        len = todayResults.length;
                        for (i=0; i<len; i+=1) {
                            inventory = todayResults[i];
                            setQuantity(data,inventory,true);
                        }
                        len = yesterdayResults.length;
                        for (i=0; i<len; i+=1) {
                            inventory = yesterdayResults[i];
                            setQuantity(data,inventory,false);
                        }
                    });
                    return data;
                },

                save: function(section, id, quantity) {
                    var date = moment().utc(),
                        defer = $q.defer(),
                        self = this;

                    if (date.hour() < 10) {
                        date.subtract(1,'days');
                    }
                    date = date.format('YYYYMMDD');

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
                                self._list = null;
                                defer.resolve();
                            },
                            function(inventory,error) {
                                $log.debug('failed: ',error);
                                defer.reject(error);
                            });
                    });
                    return defer.promise;

                }
            };

            return InventoryService;
        }
    ]);
})();