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
    'use strict';

    var Assignment = Parse.Object.extend('Assignment',{
        mine: function() {
            return this.get('user').isCurrent();
        },
        fits: function(date,section) {
            return date === this.get('date') && section === this.get('section');
        },
        type: function() {
            var type = this.get('type');
            return type ? type : 'angel';
        },
        typeName: function() {
            switch (this.type()) {
                case 'archangel':
                    return 'Tagesengel';
                case 'translator':
                    return 'Übersetzerin / Übersetzer';
                case 'medical':
                    return 'Ärztin / Arzt';
                default:
                    return 'Engel';
            }
        },
        taken: function() {
            return true;
        },
        image: function() {
            if (this.get('user').get('facebookId')) {
                return 'https://graph.facebook.com/' + this.get('user').get('facebookId') + '/picture?width=200&height=200';
            }
            else if (this.get('user').get('gender')) {
                return 'HOSTING_BASEassets/images/' + this.get('user').get('gender') + '.png';
            }
            else {
                return '';
            }
        },
        popoverTitle: function() {
            return this.name();
        },
        facebookId: function() {
            return this.get('user').get('facebookId');
        },
        isFacebook: function() {
            return undefined !== this.get('user').get('facebookId') && null !== this.get('user').get('facebookId');
        },
        gender: function() {
            return 'male' === this.get('user').get('gender') ? 'männlich' : 'weiblich';
        },
        name: function() {
            if (this.get('user').get('name')) {
                return this.get('user').get('name');
            }
            else {
                return '';
            }
        }
    }, {
        create: function(date, section, user, type) {
            if (!type) {
                type = 'angel';
            }
            var assignment = new Assignment(),
                acl = new Parse.ACL(user);
            acl.setPublicReadAccess(true);
            acl.setRoleWriteAccess('orga',true);
            assignment.set('date',date);
            assignment.set('section',section);
            assignment.set('user',user);
            assignment.set('type',type);
            assignment.setACL(acl);
            return assignment;
        }
    });

    return {
        Assignment: Assignment
    };
});