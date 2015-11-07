/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function() {
    'use strict';

    var Assignment = Parse.Object.extend('Assignment',{
        mine: function() {
            return this.get('user').isCurrent();
        },
        fits: function(date,section) {
            return date === this.get('date') && section === this.get('section');
        },
        taken: function() {
            return true;
        },
        image: function() {
            if (this.get('user').get('facebookId')) {
                return 'https://graph.facebook.com/' + this.get('user').get('facebookId') + '/picture?type=normal';
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
        create: function(date, section, user) {
            var assignment = new window.ZOBAngels.Assignment();
            assignment.set('date',date);
            assignment.set('section',section);
            assignment.set('user',user);
            return assignment;
        }
    });

    window.ZOBAngels = {
        Assignment: Assignment
    };
})();