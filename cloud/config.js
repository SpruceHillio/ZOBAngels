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

    return {
        slack: {
            team: '__SLACK_TEAM__',
            hook: '__SLACK_HOOK__',
            key: '__SLACK_KEY__',
            hooks: {
                takeRelease: "__SLACK_HOOKS_TAKERELEASE__",
                missingAngels: "__SLACK_HOOKS_MISSINGANGELS__"
            },
            channel: {
                takeRelease: '__SLACK_CHANNEL_TAKERELEASE__',
                order: '__SLACK_CHANNEL_ORDER__',
                missingAngels: '__SLACK_CHANNEL_MISSINGANGELS__'
            }
        },
        facebook: {
            app: {
                accessToken: '__FACEBOOK_APP_ACCESSTOKEN__'
            }
        }
    };
});