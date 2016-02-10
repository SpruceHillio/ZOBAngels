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
                    return 'ÜbersetzerIn';
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
                return '__HOSTING_BASE__assets/images/' + this.get('user').get('gender') + '.png';
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

    var Inventory = Parse.Object.extend('Inventory',{
        date: function() {
            return this.get('date');
        },
        section: function() {
            return this.get('section');
        },
        key: function() {
            return this.get('key');
        },
        quantity: function(quantity) {
            if (quantity) {
                this.set('quantity',quantity);
            }
            return this.get('quantity');
        }
    },{
        create: function(date, section, key, quantity) {
            var inventory = new Inventory(),
                acl = new Parse.ACL();
            acl.setPublicReadAccess(false);
            acl.setRoleReadAccess('inventory',true);
            acl.setRoleWriteAccess('inventory',true);
            inventory.set('date',date);
            inventory.set('section',section);
            inventory.set('key',key);
            inventory.set('quantity',quantity);
            inventory.setACL(acl);
            return inventory;
        },
        clone: function(inventory) {
            var clone = new Inventory(),
                acl = new Parse.ACL();
            acl.setPublicReadAccess(false);
            acl.setRoleReadAccess('inventory',true);
            acl.setRoleWriteAccess('inventory',true);
            clone.set('date',inventory.get('date'));
            clone.set('section',inventory.get('section'));
            clone.set('key',inventory.get('key'));
            clone.set('quantity',inventory.get('quantity'));
            clone.setACL(acl);
            return clone;
        }
    });

    var AuditLog = Parse.Object.extend('AuditLog',{
    },{
        create: function(user, entry) {
            var auditLog = new AuditLog(),
                acl = new Parse.ACL();
            acl.setPublicReadAccess(false);
            acl.setRoleReadAccess('admin',true);
            acl.setRoleWriteAccess('admin',true);
            auditLog.set('user',user);
            auditLog.set('entry',entry);
            auditLog.setACL(acl);
            return auditLog;
        }
    });

    var FaqEntry = Parse.Object.extend('FaqEntry', {
        addLanguage: function(language, question,answer) {
            var languages = this.get('languages');
            if (undefined === languages || null === languages) {
                languages = {};
            }
            languages[language] = {
                question: question,
                answer: answer
            };
            this.set('languages',languages);
            return this;
        },

        updateLanguage: function(language, question, answer) {
            var languages = this.get('languages');
            if (undefined === languages || null === languages) {
                languages = {};
            }
            languages[language] = {
                question: question,
                answer: answer
            };
            this.set('languages',languages);
            return this;
        },

        question: function(language) {
            var languages = this.get('languages');
            return languages[language].question;
        },

        answer: function(language) {
            var languages = this.get('languages');
            return languages[language].answer;
        }
    }, {
        create: function() {
            var faqEntry = new FaqEntry(),
                acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setRoleWriteAccess('orga',true);
            faqEntry.setACL(acl);
            return faqEntry;
        }
    });

    return {
        Assignment: Assignment,
        Inventory: Inventory,
        AuditLog: AuditLog,
        FaqEntry: FaqEntry
    };
});