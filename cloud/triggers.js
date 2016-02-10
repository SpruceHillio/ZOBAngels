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
            User : {
                afterSave: {
                    assignAdminRole: function(request) {
                        Parse.Cloud.useMasterKey();
                        var adminFacebookIds = ['__PARSE_ADMINS__'],
                            query;
                        console.log('User - afterSave - assignAdminRole');
                        if (request.object && request.object.get('facebookId') && -1 < adminFacebookIds.indexOf(request.object.get('facebookId'))) {
                            new Parse.Query(Parse.Role).equalTo('name','admin').first().then(function(adminRole) {
                                adminRole.getUsers().add(request.object);
                                return adminRole.save();
                            }).then(function() {
                                console.log('success adding admin role to ' + request.object.get('name'));
                            }, function(error) {
                                console.log('error adding admin tole to ' + request.object.get('name') + error);
                            });
                        }
                        else {
                            console.log('not matched');
                            console.log([request.object.get('facebookId')]);
                            console.log(adminFacebookIds);
                            console.log(adminFacebookIds.indexOf(request.object.get('facebookId')));
                        }
                    }
                }
            },
            Assignment: {
                beforeSave: {
                    checkForDuplicate: function(request,response) {
                        if (30000000 < request.object.get('date')) {
                            response.error('Old client version');
                        }
                        var query = new Parse.Query(model.Assignment).
                            equalTo('user',request.object.get('user')).
                            equalTo('section',request.object.get('section')).
                            equalTo('type',request.object.get('type')).
                            equalTo('date',request.object.get('date'));
                        query.first().then(function(result) {
                            if (result) {
                                response.error('Already signed up!');
                            }
                            else {
                                response.success();
                            }
                        },function() {
                            // TODO Not sure how we should handle errors here
                            response.success();
                        });
                    }
                },
                afterSave: {
                    postToSlack: function(request) {
                        console.log('Assignment.afterSave.postToSlack');
                        if (!config.slack.hooks.takeRelease) {
                            console.log('disabled');
                            return;
                        }
                        var postToSlack = function(assignment,user) {
                            var name = (undefined === user || null === user) ? assignment.get('user').objectId : user.get('name');
                            Parse.Cloud.httpRequest({
                                method: 'POST',
                                url: 'https://hooks.slack.com/services/' + config.slack.team + '/' +  config.slack.hook+ '/' + config.slack.key,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8'
                                },
                                body: {
                                    channel: config.slack.channel.takeRelease,
                                    attachments: [
                                        {
                                            fallback: '*' + name + '* hat sich für *' + texts[assignment.get('section')].title + '* am *' + moment(new Date(assignment.get('date'))).format('YYYY-MM-DD') + '* angemeldet.',
                                            color: "#00D000",
                                            title: "Anmeldung (" + texts.type[assignment.get('type')] + ")",
                                            fields: [
                                                {
                                                    title: texts[assignment.get('section')].title + ' am ' + moment(assignment.get('date'),"YYYYMMDD").format('YYYY-MM-DD'),
                                                    value: name,
                                                    short: false
                                                }
                                            ]
                                        }
                                    ],
                                    username : "Der Schicht Engel",
                                    icon_emoji: ":angel:"
                                }
                            });
                        };
                        new Parse.Query(Parse.User).get(request.object.get('user').id).then(function(user) {
                            postToSlack(request.object,user);
                        }, function(message) {
                            console.log('Assignment.afterSave.postToSlack - fetching user failed: ' + message);
                            postToSlack(request.object);
                        });
                    }
                },
                afterDelete: {
                    postToSlack: function(request) {
                        console.log('Assignment.afterDelete.postToSlack');
                        if (!config.slack.hooks.takeRelease) {
                            return;
                        }
                        var postToSlack = function(assignment,user) {
                            var name = (undefined === user || null === user) ? assignment.get('user').objectId : user.get('name');
                            Parse.Cloud.httpRequest({
                                method: 'POST',
                                url: 'https://hooks.slack.com/services/' + config.slack.team + '/' +  config.slack.hook+ '/' + config.slack.key,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8'
                                },
                                body: {
                                    channel: config.slack.channel.takeRelease,
                                    attachments: [
                                        {
                                            fallback: '*' + name + '* hat sich für *' + texts[assignment.get('section')].title + '* am *' + moment(new Date(assignment.get('date'))).format('YYYY-MM-DD') + '* abgemeldet.',
                                            color: "#D00000",
                                            title: "Abmeldung (" + texts.type[assignment.get('type')] + ")",
                                            fields: [
                                                {
                                                    title: texts[assignment.get('section')].title + ' am ' + moment(assignment.get('date'),"YYYYMMDD").format('YYYY-MM-DD'),
                                                    value: name,
                                                    short: false
                                                }
                                            ]
                                        }
                                    ],
                                    username : "Der Schicht Engel",
                                    icon_emoji: ":angel:"
                                }
                            });
                        };
                        new Parse.Query(Parse.User).get(request.object.get('user').id).then(function(user) {
                            postToSlack(request.object,user);
                        }, function(message) {
                            console.log('Assignment.afterDelete.postToSlack - fetching user failed: ' + message);
                            postToSlack(request.object);
                        });
                    }
                }
            },
            Inventory: {
                afterSave: {
                    createAuditLog: function(request) {
                        model.AuditLog.create(request.user,JSON.stringify({
                            type: 'save',
                            section: request.object.get('section'),
                            key: request.object.get('key'),
                            quantity: request.object.get('quantity')
                        })).save();
                    }
                },
                afterDelete: {
                    createAuditLog: function(request) {
                        model.AuditLog.create(request.user,JSON.stringify({
                            type: 'delete',
                            section: request.object.get('section'),
                            key: request.object.get('key'),
                            quantity: request.object.get('quantity')
                        })).save();
                    }
                }
            }
        };
    };
});