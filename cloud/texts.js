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
        type: {
            angel: 'Engel',
            archangel: 'Tagesengel'
        },
        driver: {
            title: 'Fahrer',
            texts: {
                angel: 'Es fehlt uns noch der Fahrer'
            }
        },
        one: {
            title: '18-20 Uhr',
            texts: {
                angel : 'Es fehlesn uns noch __COUNT__ Engel',
                archangel : 'Es fehlt uns noch der Tagesengel'
            }
        },
        two: {
            title: '20-22 Uhr',
            texts: {
                angel : 'Es fehlen uns noch __COUNT__ Engel',
                archangel : 'Es fehlt uns noch der Tagesengel'
            }
        },
        three: {
            title: '22-24 Uhr',
            texts: {
                angel : 'Es fehlen uns noch __COUNT__ Engel',
                archangel : 'Es fehlt uns noch der Tagesengel'
            }
        }
    };
});