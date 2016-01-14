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
        global.ZOBAngels.data = factory();
    }
})(this,function() {
    'use strict';

    return {
        Order: {
            richel: {
                email: {
                    to: {
                        email: 'anika.baumgart@gmail.com',
                        name: 'RichelOrga'
                    },
                    subject: 'Bestellung',
                    intro: 'Liebe RichelOrga,\n\nunten findet ihr die Bestellung für die ZOB Angels.\n\n',
                    extro: '\n\nLiebe Grüße\nDie ZOBAngels'
                },
                slack: {
                    heading: 'Richel'
                }
            },
            pwc: {
                email: {
                    to: {
                        email: 'anika.baumgart@gmail.com',
                        name: 'PWC'
                    },
                    subject: 'Bestellung',
                    intro: 'Liebe PWC,\n\nunten findet ihr die Bestellung für die ZOB Angels.\n\n',
                    extro: '\n\nLiebe Grüße\nDie ZOBAngels',
                    days: [
                        '1','2','3','4','5'
                    ],
                    day: {
                        '5' : '\n\nBitte zusätzlich zu den oben genannten Sachen noch das Folgende der Bestellungen hinzufügen:\n• Wasser: 10 (Kiste)\n• Bananen: 5 (Kiste)'
                    }
                },
                slack: {
                    heading: 'PWC'
                }
            },
            vokue: {
                email: {
                    to: {
                        email: 'anika.baumgart@gmail.com',
                        name: 'Vokü'
                    },
                    subject: 'Bestellung',
                    intro: 'Liebe VoKü,\n\nunten findet ihr die Bestellung für die ZOB Angels.\n\n',
                    extro: '\n\nLiebe Grüße\nDie ZOBAngels'
                },
                slack: {
                    heading: 'Vokü'
                }
            },
            others: {
                email: {
                    to: {
                        email: 'anika.baumgart@gmail.com',
                        name: 'Anika Baumgart'
                    },
                    subject: 'Bestellung',
                    intro: 'Liebe Anika,\n\nunten findest du die Bestellung für die ZOB Angels.\n\n',
                    extro: '\n\nLiebe Grüße\nDie ZOBAngels'
                },
                slack: {
                    heading: 'Sonstiges'
                }
            }
        },
        Inventory: {
            man: {
                name: 'Männer',
                icon: 'fa-male',
                entries: [
                    {
                        id: 'trouser_sm',
                        name: 'Hose (S/M)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','5','10','15','20','25+']
                    },
                    {
                        id: 'trouser_l',
                        name: 'Hose (L)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'pullover',
                        name: 'Pullover',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','5','10','15','20','25+']
                    },
                    {
                        id: 'jacket_sm',
                        name: 'Jacke (S/M)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','5','10','15','20','25+']
                    },
                    {
                        id: 'jacket_l',
                        name: 'Jacke (L)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'shoe_41',
                        name: 'Schuhe (41)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'shoe_42',
                        name: 'Schuhe (42)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'shoe_43',
                        name: 'Schuhe (43)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'shoe_44',
                        name: 'Schuhe (44)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'shoe_45',
                        name: 'Schuhe (45)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'socks',
                        name: 'Socken',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    },                    
                    {
                        id: 'caps',
                        name: 'Mützen',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    },
                    {
                        id: 'gloves',
                        name: 'Handschuhe',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    },
                    {
                        id: 'scarf',
                        name: 'Schal',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    }
                ]
            },
            woman: {
                name: 'Frauen',
                icon: 'fa-female',
                entries: [
                    {
                        id: 'trouser',
                        name: 'Hose',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','2','4','6','8','10+']
                    },
                    {
                        id: 'pullover',
                        name: 'Pullover',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','2','4','6','8','10+']
                    },
                    {
                        id: 'jacket',
                        name: 'Pullover',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','2','4','6','8','10+']
                    },
                    {
                        id: 'stocking',
                        name: 'Strumpfhosen',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'leggings',
                        name: 'Leggings',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'shoe_36',
                        name: 'Schuhe (36)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_37',
                        name: 'Schuhe (37)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_38',
                        name: 'Schuhe (38)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_39',
                        name: 'Schuhe (39)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_40',
                        name: 'Schuhe (40)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_41',
                        name: 'Schuhe (41)',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2+']
                    },
                    {
                        id: 'socks',
                        name: 'Socken',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    },                    
                    {
                        id: 'caps',
                        name: 'Mützen',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    },
                    {
                        id: 'gloves',
                        name: 'Handschuhe',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    },
                    {
                        id: 'scarf',
                        name: 'Schal',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0', '1/2', '1+']
                    },
                    {
                        id: 'hygiene',
                        name: 'Hygieneartikel',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    }
                ]
            },
            child: {
                name: 'Kinder',
                icon: 'fa-child',
                entries: [
                    {
                        id: 'trouser_98',
                        name: 'Hose (98)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_104',
                        name: 'Hose (104)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_110',
                        name: 'Hose (110)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_116',
                        name: 'Hose (116)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_122',
                        name: 'Hose (122)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_128',
                        name: 'Hose (128)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_134',
                        name: 'Hose (134)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_140',
                        name: 'Hose (140)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_146',
                        name: 'Hose (146)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_152',
                        name: 'Hose (152)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_158',
                        name: 'Hose (158)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_164',
                        name: 'Hose (164)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_170',
                        name: 'Hose (170)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'trouser_176',
                        name: 'Hose (176)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_134',
                        name: 'Pullover (134)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_140',
                        name: 'Pullover (140)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_146',
                        name: 'Pullover (146)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_152',
                        name: 'Pullover (152)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_158',
                        name: 'Pullover (158)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_164',
                        name: 'Pullover (164)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_170',
                        name: 'Pullover (170)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'pullover_176',
                        name: 'Pullover (176)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_134',
                        name: 'Jacke (134)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_140',
                        name: 'Jacke (140)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_146',
                        name: 'Jacke (146)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_152',
                        name: 'Jacke (152)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_158',
                        name: 'Jacke (158)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_164',
                        name: 'Jacke (164)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_170',
                        name: 'Jacke (170)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'jacket_176',
                        name: 'Jacke (176)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_21',
                        name: 'Schuhe (21)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_22',
                        name: 'Schuhe (22)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_23',
                        name: 'Schuhe (23)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_24',
                        name: 'Schuhe (24)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_25',
                        name: 'Schuhe (25)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_26',
                        name: 'Schuhe (26)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_27',
                        name: 'Schuhe (27)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_28',
                        name: 'Schuhe (28)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_29',
                        name: 'Schuhe (29)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_30',
                        name: 'Schuhe (30)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_31',
                        name: 'Schuhe (31)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_32',
                        name: 'Schuhe (32)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_33',
                        name: 'Schuhe (33)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_34',
                        name: 'Schuhe (34)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'shoe_35',
                        name: 'Schuhe (35)',
                        source: 'richel',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'socks',
                        name: 'Socken',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'caps',
                        name: 'Mützen',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'gloves',
                        name: 'Handschuhe`',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'scarf',
                        name: 'Schal',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'underwear',
                        name: 'Unterwäsche',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'toys',
                        name: 'Spielzeug',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    }
                ]
            },
            baby: {
                name: 'Baby',
                icon: 'fa-child',
                entries: [
                    {
                        id: 'sleepingbag',
                        name: 'Schlafsack',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'clothing',
                        name: 'Kleindung',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1','1 1/2','2+']
                    },
                    {
                        id: 'socks',
                        name: 'Socken',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'nappies_1',
                        name: 'Windel (1)',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'nappies_2',
                        name: 'Windel (2)',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'nappies_3',
                        name: 'Windel (3)',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'nappies_4',
                        name: 'Windel (4)',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'nappies_5',
                        name: 'Windel (5)',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'nappies_6',
                        name: 'Windel (6)',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'changingmat',
                        name: 'Wickelunterlagen',
                        source: 'richel',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'wet_tissues',
                        name: 'Feuchttücher',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'toys',
                        name: 'Kuscheltiere',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    }
                ]
            },
            food: {
                name: 'Essen & Trinken',
                icon: 'fa-cutlery',
                entries: [
                    {
                        id: 'chocolate_cookie',
                        name: 'Kekse & Schokolade',
                        source: 'vokue',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'fruit',
                        name: 'Obst',
                        source: 'vokue',
                        unit: 'Kiste',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'banana',
                        name: 'Banane',
                        source: 'pwc',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'bread',
                        name: 'Brot',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1','1 1/2','2+']
                    },
                    {
                        id: 'instant_soup',
                        name: 'Fertigsuppe',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'water_small',
                        name: 'Wasser (klein)',
                        source: 'pwc',
                        unit: 'Kiste',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'juice',
                        name: 'Saft / Caprisonne',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'savory',
                        name: 'Salziges',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'fruit_whatever',
                        name: 'Fruchtquetschis',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','5','10','15','20','25+']
                    },
                    {
                        id: 'milk',
                        name: 'Milch',
                        source: 'pwc',
                        unit: 'Liter',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'sugar',
                        name: 'Zucker',
                        source: 'others',
                        unit: 'Kilo',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'salt',
                        name: 'Salz',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'baby',
                        name: 'Babynahrung',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    }
                ]
            },
            other: {
                name: 'Sonstiges: Kleidercontainer',
                icon: 'fa-archive',
                entries: [
                    {
                        id: 'blanket',
                        name: 'Decke',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','5','10','15','20','25+']
                    },
                    {
                        id: 'blanket_rescue',
                        name: 'Rettungsdecke',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'hygiene',
                        name: 'Hygieneartikel',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'soles',
                        name: 'Einlegesolen',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'warmer',
                        name: 'Wärmflasche',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/2','1+']
                    },
                    {
                        id: 'backpack',
                        name: 'Rucksack / Tasche',
                        source: 'others',
                        unit: 'Stück',
                        quantities: ['0','5','10','15','20','25+']
                    }
                ]
            },
            other_food: {
                name: 'Sonstiges: Essenscontainer',
                icon: 'fa-cubes',
                entries: [
                    {
                        id: 'trashbag',
                        name: 'Müllsack',
                        source: 'others',
                        unit: 'Rolle',
                        quantities: ['0','1','2','3','4','5+']
                    },
                    {
                        id: 'plate_flat',
                        name: 'Teller',
                        source: 'vokue',
                        unit: 'Stück',
                        quantities: ['0','5','10','15','20','25+']
                    },
                    {
                        id: 'cup',
                        name: 'Becher',
                        source: 'vokue',
                        unit: 'Stück',
                        quantities: ['0','50','100','150','200+']
                    },
                    {
                        id: 'spoon',
                        name: 'Löffel',
                        source: 'vokue',
                        unit: 'Stück',
                        quantities: ['0','50','100','150','200+']
                    },
                    {
                        id: 'plate_deep',
                        name: 'Suppenbecher',
                        source: 'vokue',
                        unit: 'Stück',
                        quantities: ['0','50','100','150','200+']
                    },
                    {
                        id: 'schnuller',
                        name: 'Schnuller',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'baby_bottle',
                        name: 'Babyflasche',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'bag_small',
                        name: 'Proviantbeutel',
                        source: 'others',
                        unit: 'Kiste',
                        quantities: ['0','1/4','1/2+']
                    },
                    {
                        id: 'disposable_gloves_s',
                        name: 'Einweghandschuhe (S)',
                        source: 'pwc',
                        unit: 'Packung',
                        quantities: ['0','1/2','1','1 1/2','2+']
                    },
                    {
                        id: 'disposable_gloves_m',
                        name: 'Einweghandschuhe (M)',
                        source: 'pwc',
                        unit: 'Packung',
                        quantities: ['0','1/2','1','1 1/2','2+']
                    },
                    {
                        id: 'disposable_gloves_l',
                        name: 'Einweghandschuhe (L)',
                        source: 'pwc',
                        unit: 'Packung',
                        quantities: ['0','1/2','1','1 1/2','2+']
                    },
                    {
                        id: 'duck_tape',
                        name: 'Textilklebeband',
                        source: 'others',
                        unit: 'Rolle',
                        quantities: ['0','1','2','3+']
                    }
                ]
            },
            cleaning: {
                name: 'Reinigung & Hygiene',
                icon: 'fa-flask',
                entries: [
                    {
                        id: 'dish_liquid',
                        name: 'Pril',
                        source: 'others',
                        unit: 'Flasche',
                        quantities: ['0','1+']
                    },
                    {
                        id: 'all_purpose_cleaner',
                        name: 'Sagrotan Allzweckreiniger',
                        source: 'others',
                        unit: 'Flasche',
                        quantities: ['0','1','2','3+']
                    },
                    {
                        id: 'vinegar_essence',
                        name: 'SURIG- Essig-Essenz',
                        source: 'others',
                        unit: 'Flasche',
                        quantities: ['0','1','2','3','4+']
                    },
                    {
                        id: 'citric_acid',
                        name: 'HEITMANN  Citronensäure flüssig',
                        source: 'others',
                        unit: 'Flasche',
                        quantities: ['0','1','2','3','4+']
                    },
                    {
                        id: 'glass_cleaner',
                        name: 'Sidolin-Glasreiniger',
                        source: 'others',
                        unit: 'Flasche',
                        quantities: ['0','1','2+']
                    },
                    {
                        id: 'sterillum',
                        name: 'Sterillum',
                        source: 'others',
                        unit: 'Flasche',
                        quantities: ['0','3','6','9','12+']
                    },
                    {
                        id: 'kitchen_roll',
                        name: 'ZEWA wisch&fort',
                        source: 'others',
                        unit: 'Rolle',
                        quantities: ['0','5','10','15','20+']
                    },
                    {
                        id: 'disinfection_area_spraying',
                        name: 'Sagrotan-Desinfektions-Reiniger zum Sprühen',
                        source: 'others',
                        unit: 'Flasche',
                        quantities: ['0','2','4','6','8+']
                    }
                ]
            }
        }
    };
});