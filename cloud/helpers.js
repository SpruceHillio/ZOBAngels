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
    return function(config,model,texts,moment) {
        return {
            helperStats: function(date, config) {
                var sectionKeys = ['driver','one','two','three'],
                    types = ['angel'],
                    query = new Parse.Query(model.Assignment),
                    now = date,
                    i,j,
                    len, m,
                    sections = {
                        driver: {
                            angel : {
                                required: 1,
                                users: []
                            }
                        },
                        one: {
                            angel : {
                                required: 6,
                                users: []
                            },
                            archangel: {
                                required: 1,
                                users: []
                            }
                        },
                        two: {
                            angel : {
                                required: 6,
                                users: []
                            },
                            archangel: {
                                required: 1,
                                users: []
                            }
                        },
                        three: {
                            angel : {
                                required: 6,
                                users: []
                            },
                            archangel: {
                                required: 1,
                                users: []
                            }
                        }
                    },
                    result,
                    section,
                    type,
                    fields = {},
                    promise = new Parse.Promise();

                query.greaterThanOrEqualTo('date',now);
                query.lessThan('date',now + (24 * 60 * 60 * 1000));
                query.find({
                    success: function(results) {
                        len = results.length;

                        console.log('now: ' + new Date(now));
                        console.log('we have ' + len + ' results');

                        for (i=0; i<len; i+=1) {
                            result = results[i];
                            section = result.get('section');
                            type = result.get('type');
                            if (!type) {
                                type = 'angel';
                            }
                            if (sections[section] && sections[section][type]) {
                                sections[section][type].users.push(result.get('user'));
                                console.log('added user to ' + section + ' for ' + type);
                            }
                            else {
                                console.log('not found: ' + section + '/' + type);
                            }
                        }

                        len = sectionKeys.length;
                        for (i=0; i<len; i+=1) {
                            section = sections[sectionKeys[i]];
                            if (section) {
                                console.log('looking into section: ' + sectionKeys[i]);
                                m = types.length;
                                for (j=0; j<m; j+=1) {
                                    if (section[types[j]]) {
                                        console.log('looking into type: ' + types[j] + ' with ' + section[types[j]].required + '/' + section[types[j]].users.length);
                                        if (section[types[j]].required > section[types[j]].users.length) {
                                            if (!fields[types[j]]) {
                                                fields[types[j]] = [];
                                            }
                                            fields[types[j]].push({
                                                title: texts[sectionKeys[i]].title,
                                                value: texts[sectionKeys[i]].texts[types[j]].replace('__COUNT__',section[types[j]].required - section[types[j]].users.length),
                                                short: false
                                            });
                                        }
                                    }
                                }
                            }
                        }

                        promise.resolve({
                            fields: fields,
                            config: config
                        });
                    },
                    error: function(error) {
                        promise.reject(error);
                    }
                });
                return promise;
            }
        };
    };
});