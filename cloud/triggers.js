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
            Assignment: {
                beforeSave: {
                    checkForDuplicate: function(request,response) {
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
                                        fallback: '*' + request.object.get('user').get('name') + '* hat sich für *' + texts[request.object.get('section')].title + '* am *' + moment(new Date(request.object.get('date'))).format('YYYY-MM-DD') + '* angemeldet.',
                                        color: "#00D000",
                                        title: "Anmeldung (" + texts.type[request.object.get('type')] + ")",
                                        fields: [
                                            {
                                                title: texts[request.object.get('section')].title + ' am ' + moment(new Date(request.object.get('date'))).format('YYYY-MM-DD'),
                                                value: request.object.get('user').get('name'),
                                                short: false
                                            }
                                        ]
                                    }
                                ],
                                username : "Der Schicht Engel",
                                icon_emoji: ":angel:"
                            }
                        });
                    }
                },
                afterDelete: {
                    postToSlack: function(request) {
                        if (!config.slack.hooks.takeRelease) {
                            return;
                        }
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
                                        fallback: '*' + request.object.get('user').get('name') + '* hat sich für *' + texts[request.object.get('section')].title + '* am *' + moment(new Date(request.object.get('date'))).format('YYYY-MM-DD') + '* abgemeldet.',
                                        color: "#D00000",
                                        title: "Abmeldung (" + texts.type[request.object.get('type')] + ")",
                                        fields: [
                                            {
                                                title: texts[request.object.get('section')].title + ' am ' + moment(new Date(request.object.get('date'))).format('YYYY-MM-DD'),
                                                value: request.object.get('user').get('name'),
                                                short: false
                                            }
                                        ]
                                    }
                                ],
                                username : "Der Schicht Engel",
                                icon_emoji: ":angel:"
                            }
                        });
                    }
                }
            }
        };
    };
});