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
    return function(config,model,texts,helpers,security,moment) {
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
            }
        };
    };
});