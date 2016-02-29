// ==UserScript==
// @name         HearthPwn Deck Simulator
// @namespace    http://userscripts.org/users/386397
// @version      1.1.8
// @description  Easy pack opener
// @author       TED Vortex
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @match        http://www.hearthpwn.com/packs/*
// ==/UserScript==
/* jshint -W097 */
'use strict';

var Simulator = {
    uriBase: '//www.hearthpwn.com',
    counter: GM_getValue('counter', 0),
    autoScript: GM_getValue('autoscript', true),
    autoDelay: GM_getValue('autodelay', 1000),
    highScore: GM_getValue('highscore', {
        "wild": 0,
        "standard": 0
    }),
    highScoreThreshold: 50000,
    location: window.location.pathname.split('/'),
    allowed: ['1-hearthpwn-wild-pack', '2-hearthstone-tgt'],
    regexp: {
        "save": /([0-9]+\-vortex\-[0-9]+)/gi
    },
    content: $('#content'),
    menuCss: {
        "width": "240px",
        "padding": "5px 10px",
        "position": "fixed",
        "left": "10px",
        "top": "10px",
        "background": "#f3f3f3",
        "border": "1px solid #9f9f9f",
        "border-radius": "10px",
        "box-shadow": "0 0 15px rgba(0,0,0,0.15)"
    },

    pack: function(type) {
        var results = $('ul.pack-results', Simulator.content),
            score = $('span.pack-score', Simulator.content).data('score');

        console.log('Total packs opened: ' + Simulator.counter);
        console.log('Ready to open ' + type + ' pack with score ' + score);
        console.log('Highest value opened ' + type + ' pack was: ' + Simulator.highScore[type]);

        if (isNaN(Simulator.highScore[type]) !== false || parseInt(score) > parseInt(Simulator.highScore[type])) {
            Simulator.highScore[type] = score;

            GM_setValue('highscore', Simulator.highScore);

            Hearth.showPackScore();

            if (Simulator.highScore[type] >= Simulator.highScoreThreshold) {
                $('div#form-field-title input', Simulator.content).val('vortex ' + Simulator.highScore[type]);
                $('form.pack-save-form', Simulator.content).submit();
            } else {
                if (Simulator.autoScript === true) {
                    Simulator.content.find('#reveal-all')
                        .trigger('click')
                        .delay(2000)
                        .end()
                        .find('li.shake')
                        .each(function (index, element) {
                            window.setTimeout(function () {
                                $(element).trigger('mouseup');
                            }, index * 500);
                        })
                        .end();

                    Simulator.start(2500);
                }
            }
        } else {
            // no high score, skipping
            Simulator.content.find('.pack-score em')
                .text(score)
                .end()
                .find('.pack-score')
                .addClass('score-total')
                .end();

            Simulator.start();
        }
    },

    start: function(delay) {
        if (typeof(delay) === 'undefined' || parseInt(delay) <= 1000) {
            delay = Simulator.autoDelay;
        }

        var returnUri = Simulator.uriBase + '/packs/simulator/' + Simulator.allowed[1];

        if (Simulator.autoScript === true) {
            window.setTimeout(function() {
                window.location = returnUri;
            }, delay);
        }
    },

    init: function() {
        if (typeof(Simulator.location[1]) !== 'undefined' && Simulator.location[1] == "packs") {
            // Detected packs uri

            if (typeof(Simulator.location[2]) !== 'undefined' && Simulator.location[2] == "simulator") {
                // detected simulator uri

                if (typeof(Simulator.location[3]) !== 'undefined') {
                    var type = Simulator.allowed.indexOf(Simulator.location[3]);

                    if (type === 0) {
                        console.log('Detected WILD pack');
                        // open wild pack
                    } else if (type === 1) {
                        // standard pack detected
                        Simulator.pack('standard');
                    }
                } else {
                    // we are on the selection page
                    Simulator.start();
                }
            } else {
                var match = Simulator.location[2].match(Simulator.regexp.save);
                if (match !== null) {
                    // we just opened high score pack
                    Simulator.start();
                }
            }
        }
    }
};

GM_setValue('counter', ++Simulator.counter);

$(document).ready(function(){
    window.setTimeout(function() {
        Simulator.init();
    }, Simulator.autoDelay);
});