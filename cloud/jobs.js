/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function(global,factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        if (typeof global.ZOBAngels === 'undefined') {
            global.ZOBAngels = {};
        }
        global.ZOBAngels.model = factory();
    }
})(this,function() {
    return function(config,model,data,texts,helpers,security,moment,mandrill) {
        return {
            informAngels: function(request,status) {
                var query = new Parse.Query(model.Assignment),
                    now = new Date(new Date().toJSON().slice(0,10)) - (60 * 60 * 1000),
                    i,
                    len,
                    users = {},
                    user,
                    assignment,
                    times,
                    driver,
                    angel,
                    normalSections = ['one','two','three'],
                    createFacebookNotification = function(facebookId, times, driver, angel, accessToken) {
                        Parse.Cloud.httpRequest({
                            method: 'POST',
                            url: 'https://graph.facebook.com/v2.5/' + facebookId + '/notifications',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: {
                                access_token: accessToken,
                                href: 'http://zobangels.s3.eu-central-1.amazonaws.com/index.html',
                                template : (0 < times.length ? 'Du bist heute um ' + times + ' ein ZOB Angel.' : '') + (driver ? ' Du bist heute ' + (0 < times.length ? 'auch ' : '') + 'als Fahrer eingetragen.' : '') + (angel ? ' Du bist heute ' + (0 < times.length || driver ? 'auch ' : '') + 'der Tagesengel.' : '')
                            }
                        });
                    },
                    filterNormal = function(a) {
                        return -1 < normalSections.indexOf(a);
                    },
                    mapSection = function(a) {
                        return 'one' === a ? '18-20 Uhr' : 'two' === a ? '20-22 Uhr' : '22-24 Uhr';
                    };
                query.greaterThanOrEqualTo('date',now);
                query.lessThanOrEqualTo('date',now + 24 * 60 * 60 * 1000);
                query.include('user');
                query.find().then(function(assignments) {
                    len = assignments.length;
                    for (i=0; i<len; i+=1) {
                        assignment = assignments[i];
                        user = users[assignment.get('user').id];
                        if (!user) {
                            user = {
                                user: assignment.get('user'),
                                sections: []
                            };
                            users[user.user.id] = user;
                        }
                        user.sections.push(assignment.get('section'));
                    }
                    for (user in users) {
                        if (users.hasOwnProperty(user)) {
                            user = users[user];
                            len = user.sections.length;
                            driver = false;
                            angel = false;
                            times = '';
                            times = user.sections.filter(filterNormal).map(mapSection).join(', ').toString();
                            driver = -1 < user.sections.indexOf('driver');
                            // TODO Fix this as it's not stored that way any longer
                            angel = -1 < user.sections.indexOf('angel');

                            i = times.lastIndexOf(', ');

                            if (-1 < i) {
                                times = times.substring(0, i) + ' und ' + times.substr(i + 2);
                            }

                            createFacebookNotification(user.user.get('facebookId'), times, driver, angel, config.facebook.app.accessToken);
                        }
                    }
                }, function(error) {
                    status.error('got an error: ', error);
                });
            },
            angelStatus: function(request,status) {
                console.log('config: '+config);
                console.log('moment: '+moment);
                //var moment = moment(new Date());
                //moment.utc();
                helpers.helperStats(new Date(new Date().toJSON().slice(0,10)).getTime() - (60 * 60 * 1000),config).then(function(result) {
                    var types = ['angel'],
                        fields = result.fields,
                        config = result.config,
                        i,
                        len = types.length,
                        promises = [];
                    for (i=0; i<len; i+=1) {
                        if (fields[types[i]] && 0 < fields[types[i]].length) {
                            if (!config.slack.hooks.missingAngels) {
                                continue;
                            }
                            promises.push(Parse.Cloud.httpRequest({
                                method: 'POST',
                                url: 'https://hooks.slack.com/services/' + config.slack.team + '/' +  config.slack.hook+ '/' + config.slack.key,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8'
                                },
                                body: {
                                    channel: config.slack.channel.missingAngels,
                                    attachments: [
                                        {
                                            fallback: "Wir brauchen noch Engel für heute!",
                                            title: "Jetzt als Engel eintragen!",
                                            title_link: "http://zobangels.s3.eu-central-1.amazonaws.com/index.html",
                                            pretext: "Wir brauchen noch für die folgenden Schichten Engel:",
                                            color: "#D00000",
                                            fields: fields[types[i]]
                                        }
                                    ],
                                    username : "Der Hilferuf Engel",
                                    icon_emoji: ":angel:"
                                }
                            }));
                        }
                        else {
                            var promise = new Parse.Promise();
                            promise.resolve('Alle Schichten besetzt');
                            promises.push(promise);
                        }
                    }
                    return Parse.Promise.when(promises);
                }).then(function(response) {
                    if ('string' === typeof response) {
                        status.success(response);
                    }
                    else {
                        status.success('Der Aufruf ist raus!');
                    }
                },function(error) {
                    status.error('got an error: ' + error);
                });
            },
            createInventoryOrder: function(request,status) {
                Parse.Cloud.useMasterKey();
                console.log('Jobs - createInventoryOrder');
                moment().utc();
                console.log('Jobs - createInventoryOrder');
                var today = moment().utc().subtract(1,'days'),
                    actualQuery = new Parse.Query(model.Inventory).limit(500),
                    previousQuery = new Parse.Query(model.Inventory).limit(500),
                    key,
                    entry,
                    inventory,
                    i,j,
                    m,n,
                    yesterdayOnly = [],
                    dataQuantity,
                    inventoryQuantity,
                    orderRichel = [],
                    orderVokue = [],
                    orderPwc = [],
                    orderOthers = [],
                    orders = {},
                    text,
                    dayOfWeek = moment().utc().format('d'),
                    slackText,
                    findInResults = function(results,section,key) {
                        n = results.length;
                        for (j=0; j<n; j+=1) {
                            if (section === results[j].get('section') && key === results[j].get('key')) {
                                return results[j];
                            }
                        }
                        return null;
                    },
                    quantityToNumber = function(quantity) {
                        quantity = quantity.replace('+','');
                        if (-1 < quantity.indexOf('/')) {
                            quantity = quantity.replace(' 1/2','.5');
                            quantity = quantity.replace(' 1/4','.25');
                            quantity = quantity.replace('1/2','0.5');
                            quantity = quantity.replace('1/4','0.25');
                        }
                        return parseFloat(quantity);
                    },
                    createText = function(orders) {
                    	return orders.filter(function(order) {
                            return 0 < order.quantity;
                        }).map(function(order) {
                            return '• ' + order.title + ': *' + order.quantity + '* (' + order.unit + ')';
                        }).join('\n');
                    },
                    mandrillSuccessCallback = function() {
                        console.log('Successfully send email to ' + key);
                    },
                    mandrillErrorCallback = function() {
                        console.log('Error sending email to ' + key);
                    };
                actualQuery.equalTo('date',today.format('YYYYMMDD'));
                previousQuery.equalTo('date',today.clone().subtract(1,'days').format('YYYYMMDD'));
                for (key in data.Order) {
                    if (data.Order.hasOwnProperty(key)) {
                        orders[key] = [];
                    }
                }

                console.log('starting createInventoryOrder');

                Parse.Promise.when(actualQuery.find(),previousQuery.find()).then(function(actualResults, previousResults) {
                    status.message('Queried for inventory entries; got #' + actualResults.length + ' for the current day and #' + previousResults.length + ' for the previous day.');
                    console.log('actualResults: ' + actualResults.length + ', previousResults: ' + previousResults.length);
                    for (key in data.Inventory) {
                        if (data.Inventory.hasOwnProperty(key)) {
                            m = data.Inventory[key].entries.length;
                            for (i=0; i<m; i+=1) {
                                entry = data.Inventory[key].entries[i];
                                inventory = findInResults(actualResults,key,entry.id);
                                if (null === inventory) {
                                    inventory = findInResults(previousResults,key,entry.id);
                                    if (undefined !== inventory && null !== inventory) {
                                        yesterdayOnly.push(inventory);
                                    }
                                }
                                dataQuantity = quantityToNumber(entry.quantities[entry.quantities.length - 1]);
                                inventoryQuantity = quantityToNumber(undefined === inventory || null === inventory ? '0' : inventory.get('quantity'));

                                if (orders.hasOwnProperty(entry.source)) {
                                    orders[entry.source].push({
                                        section: key,
                                        key: entry.id,
                                        title: data.Inventory[key].name + ' - ' + entry.name,
                                        quantity: dataQuantity - inventoryQuantity,
                                        unit: entry.unit
                                    });
                                }
                                else {
                                    console.log('Unknown source: ' + entry.source);
                                }
                            }
                        }
                    }
                    status.message('Created the required stuff to order.');
                    m = yesterdayOnly.length;
                    for (i=0; i<m; i+=1) {
                        inventory = model.Inventory.clone(yesterdayOnly[i]);
                        inventory.set('date',moment(inventory.get('date'),'YYYYMMDD').add(1,'days').format('YYYYMMDD'));
                        inventory.save();
                    }
                    status.message('Copied entries that only existed on the previous day over to the current day.');

                    slackText  = '';
                    for (key in orders) {
                        if (orders.hasOwnProperty(key)) {
                            if (0 < slackText.length) {
                                slackText += '\n\n';
                            }
                            text = createText(orders[key]);
                            slackText += '*' + data.Order[key].slack.heading + '*\n' + text;
                            if (undefined === data.Order[key].email.days || 0 === data.Order[key].email.days.indexOf('ALL') || -1 < data.Order[key].email.days.indexOf(dayOfWeek)) {
                                mandrill.sendEmail({
                                    message: {
                                        text: data.Order[key].email.intro + text.replace(/\*/g,'') + (undefined !== data.Order[key].email.day && undefined !== data.Order[key].email.day[dayOfWeek] ? data.Order[key].email.day[dayOfWeek] : '') + data.Order[key].email.extro,
                                        subject: data.Order[key].email.subject,
                                        from_email: 'zobangels@gmail.com',
                                        from_name: 'ZOBAngels',
                                        to: [
                                            {
                                                email: data.Order[key].email.to.email,
                                                name: data.Order[key].email.to.name
                                            }
                                        ],
                                        bcc: [
                                            {
                                                email: 'zobangels@gmail.com',
                                                name: 'ZOBAngels'
                                            }
                                        ]
                                    },
                                    async: true
                                }, {
                                    success: mandrillSuccessCallback,
                                    error: mandrillErrorCallback
                                });
                            }
                            else {
                                console.log('Not sending email due to dayOfWeek: ' + dayOfWeek + ' and days: ' + data.Order[key].email.days);
                            }
                        }
                    }

                    Parse.Cloud.httpRequest({
                        method: 'POST',
                        url: 'https://hooks.slack.com/services/' + config.slack.team + '/' +  config.slack.hook+ '/' + config.slack.key,
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: {
                            channel: config.slack.channel.order,
                            text: slackText,
                            username : "Der Lager Engel",
                            icon_emoji: ":angel:"
                        }
                    }).then(function() {
                        status.success('Successfully posted order');
                    }, function(error) {
                        status.error('got an error: ' + error);
                    });
                }, function(error) {
                    status.error('got an error: ' + error);
                });
            }
        };
    };
});