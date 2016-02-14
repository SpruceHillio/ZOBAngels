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
                    orders = {},
                    text,
                    dayOfWeek = moment().utc().format('d'),
                    slackText,
                    facebookText,
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
                    createFacebookText = function(orders) {
                        return orders.filter(function(order) {
                            return 0 < order.quantity;
                        }).map(function(order) {
                            return '• ' + order.title;
                        }).join('\n');
                    },
                    mailchimpSuccessCallback = function(data,key,text,dayOfWeek,promise) {
                        return function(response) {
                            var recipients = [];
                            if (response.data.total) {
                                recipients = response.data.data.map(function(member) {
                                    return {
                                        email: member.email,
                                        type: 'bcc'
                                    };
                                });
                            }
                            if (undefined !== data.Order[key].email.to && null !== data.Order[key].email.to) {
                                recipients.push({
                                    email: data.Order[key].email.to.email,
                                    name: data.Order[key].email.to.name,
                                    type: 'bcc'
                                });
                            }

                            if (0 < recipients.length) {
                                console.log('Sending email to #' + recipients.length + ' recipients for key: ' + key);
                                mandrillSendEmail(recipients,data,key,text,dayOfWeek,promise);
                            }
                            else {
                                console.log('No recipients for key: ' + key);
                                promise.resolve();
                            }
                        };
                    },
                    mailchimpErrorCallback = function(data,key,text,dayOfWeek,promise) {
                        return function(response) {
                            console.log('Got an error from the MailChimp callback: ' + response.text);
                            if (undefined !== data.Order[key].email.to && null !== data.Order[key].email.to) {
                                mandrillSendEmail([{
                                    email: data.Order[key].email.to.email,
                                    name: data.Order[key].email.to.name,
                                    type: 'bcc'
                                }],data,key,text,dayOfWeek,promise);
                            }
                            else {
                                promise.resolve();
                            }
                        };
                    },
                    mandrillSendEmail = function(recipients,data,key,text,dayOfWeek,promise) {
                        console.log('Sending email to #' + recipients.length + ' bcc ...');
                        recipients.push({
                            email: 'anika.baumgart@googlemail.com',
                            name: 'Anika Baumgart',
                            type: 'to'
                        });
                        mandrill.sendEmail({
                            message: {
                                text: data.Order[key].email.intro + text.replace(/\*/g,'') + (undefined !== data.Order[key].email.day && undefined !== data.Order[key].email.day[dayOfWeek] ? data.Order[key].email.day[dayOfWeek] : '') + data.Order[key].email.extro,
                                subject: data.Order[key].email.subject.replace(/__DATE__/g,moment().tz('Europe/Berlin').format('YYYY-MM-DD')),
                                from_email: 'anika.baumgart@googlemail.com',
                                from_name: 'Anika Baumgart',
                                to: recipients
                            },
                            async: true
                        }, {
                            success: mandrillSuccessCallback(promise,key),
                            error: mandrillErrorCallback(promise,key)
                        });
                        return promise;
                    },
                    mandrillSuccessCallback = function(promise,key) {
                        return function() {
                            console.log('Successfully send email to ' + key);
                            promise.resolve();
                        };
                    },
                    mandrillErrorCallback = function(promise,key) {
                        return function() {
                            console.log('Error sending email to ' + key);
                            promise.reject();
                        };
                    },
                    facebookSuccessCallback = function(promise,key,accessToken) {
                        return function(response) {
                            new Parse.Query(model.Config).equalTo('key',key).first().then(function(config) {
                                if (undefined !== config && null !== config) {
                                    var postId = config.get('value');
                                    config.set('value',response.data.id);
                                    config.save().then(function() {
                                        Parse.Cloud.httpRequest({
                                            method: 'DELETE',
                                            url: 'https://graph.facebook.com/v2.5/' + postId + '?access_token=' + accessToken
                                        }).then(function(response) {
                                            promise.resolve();
                                        }, function(response) {
                                            promise.resolve();
                                        });
                                    }, function() {
                                        promise.resolve();
                                    });
                                }
                                else {
                                    model.Config.create(key,response.data.id).save().then(function() {
                                        promise.resolve();
                                    }, function() {
                                        promise.resolve();
                                    });
                                }
                            }, function() {
                                promise.resolve();
                            });
                        };
                    },
                    facebookErrorCallback = function(promise) {
                        return function(response) {
                            console.log(response);
                            promise.reject();
                        };
                    },
                    promises = [], promise,
                    successCallback, errorCallback;
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
                    // We create entries for today for whatever entries have not been manually updated
                    m = yesterdayOnly.length;
                    for (i=0; i<m; i+=1) {
                        inventory = model.Inventory.clone(yesterdayOnly[i]);
                        inventory.set('date',moment(inventory.get('date'),'YYYYMMDD').add(1,'days').format('YYYYMMDD'));
                        inventory.save();
                    }
                    status.message('Copied entries that only existed on the previous day over to the current day.');

                    slackText  = '';
                    facebookText = '';
                    for (key in orders) {
                        if (orders.hasOwnProperty(key)) {
                            orders[key] = orders[key].filter(function(order) {
                                return 0 < order.quantity;
                            });
                            if (0 === orders[key].length) {
                                continue;
                            }
                            if (0 < slackText.length) {
                                slackText += '\n\n';
                            }
                            text = createText(orders[key]);
                            slackText += '*' + data.Order[key].slack.heading + '*\n' + text;
                            // Check whether we want to send an email at all for that section based upon the current day
                            if (undefined === data.Order[key].email.days || 0 === data.Order[key].email.days.indexOf('ALL') || -1 < data.Order[key].email.days.indexOf(dayOfWeek)) {
                                // We need a promise here we can pass through the system in order for the job to only
                                // finish after the emails have been sent
                                promise = new Parse.Promise();
                                promises.push(promise);
                                // If we have a MailChimp list configured for that section, let's query it first for
                                // the contacts on it
                                if (undefined !== data.Order[key].email.mailchimp && null !== data.Order[key].email.mailchimp && undefined !== data.Order[key].email.mailchimp.list && null !== data.Order[key].email.mailchimp.list) {
                                    // We need to assign it here in order to bind the correct key when it's called on
                                    // the loop afterwards
                                    successCallback = mailchimpSuccessCallback(data,key,text,dayOfWeek,promise);
                                    errorCallback = mailchimpErrorCallback(data,key,text,dayOfWeek,promise);
                                    Parse.Cloud.httpRequest({
                                        method: 'POST',
                                        url: '__MAILCHIMP_API_BASE__/lists/members.json',
                                        body: JSON.stringify({
                                            apikey: '__MAILCHIMP_API_KEY__',
                                            id: data.Order[key].email.mailchimp.list
                                        })
                                    }).then(successCallback,errorCallback);
                                }
                                // If we don't have a MailChimp list configured for that section just check whether we
                                // have an email contact
                                else {
                                    if (undefined !== data.Order[key].email.to && null !== data.Order[key].email.to) {
                                        mandrillSendEmail([{
                                            email: data.Order[key].email.to.email,
                                            name: data.Order[key].email.to.name,
                                            type: 'bcc'
                                        }],data,key,text,dayOfWeek,promise);
                                    }
                                    // If we don't have an email contact, simply resolve the promise
                                    else {
                                        promise.resolve();
                                    }
                                }
                            }
                            else {
                                // No need here to resolve any promises as we only create them when we might need to
                                // send and email
                                console.log('Not sending email due to dayOfWeek: ' + dayOfWeek + ' and days: ' + data.Order[key].email.days);
                            }
                            if (undefined !== data.Order[key].facebook && null !== data.Order[key].facebook && undefined !== data.Order[key].facebook.group && null !== data.Order[key].facebook.group && undefined !== data.Order[key].facebook.accessToken && null !== data.Order[key].facebook.accessToken) {
                                facebookText = createFacebookText(orders[key]);
                                if (0 < facebookText.length) {
                                    promise = new Parse.Promise();
                                    promises.push(promise);
                                    if (undefined !== data.Order[key].facebook.intro && null !== data.Order[key].facebook.intro) {
                                        facebookText = data.Order[key].facebook.intro + facebookText;
                                    }
                                    if (undefined !== data.Order[key].facebook.extro && null !== data.Order[key].facebook.extro) {
                                        facebookText += data.Order[key].facebook.extro;
                                    }
                                    Parse.Cloud.httpRequest({
                                        method: 'POST',
                                        url: 'https://graph.facebook.com/v2.5/' + data.Order[key].facebook.group + '/feed',
                                        body: {
                                            message: facebookText,
                                            access_token: data.Order[key].facebook.accessToken
                                        }
                                    }).then(facebookSuccessCallback(promise,'donation:facebook:post:id',data.Order[key].facebook.accessToken), facebookErrorCallback(promise));
                                }
                            }
                        }
                    }

                    // Let's also push the promise for sending the Slack notification
                    promises.push(Parse.Cloud.httpRequest({
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
                    }));

                    // We're done with that job when all promises (sending emails and posting to Slack) have resolved
                    Parse.Promise.when(promises).then(function() {
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