// ==UserScript==
// @name         HearthPwn Deck Simulator Ranker
// @namespace    http://userscripts.org/users/386397
// @version      0.9.0
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
    counter: GM_getValue('counter', 0),
    autoclick: GM_getValue('autoclick', false),
    autoskip: GM_getValue('autoskip', false),
    autodelay: GM_getValue('autodelay', 1000),
    maxscore: GM_getValue('maxscore', 0),
    location: window.location.pathname.split('/'),
    allowed: ['1-hearthpwn-wild-pack', '2-hearthstone-tgt'],
    content: $('#content'),
    menuCss: {
        "width" : "240px",
        "padding" : "5px 10px",
        "position" : "fixed",
        "left" : "10px",
        "top" : "10px",
        "background" : "#f3f3f3",
        "border" : "1px solid #9f9f9f",
        "border-radius" : "10px",
        "box-shadow" : "0 0 15px rgba(0,0,0,0.15)"
    },

    packs: function() {
        var results = $('ul.pack-results', Simulator.content),
            score = $('span.pack-score', Simulator.content).data('score');

        console.log('Ready to open pack with score ' + score);

        if (isNaN(Simulator.maxscore) !== false || parseInt(score) > parseInt(Simulator.maxscore)) {
            Simulator.maxscore = score;

            if (Simulator.maxscore > 100000) {
                $('div#form-field-title input', Simulator.content).val('vortex ' + Simulator.maxscore);
                $('form.pack-save-form', Simulator.content).submit();
            }

            GM_setValue('maxscore', Simulator.maxscore);

            if (Simulator.autoclick === true) {
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

                Simulator.save(2500);
            }
        } else {
            console.log('No maxscore, skipping.');

            Simulator.next(Simulator.autodelay);
        }
    },

    forward: function() {
        console.log('Fast forward autoskip clicking simulate');

        window.location = $('a.pack-link', Simulator.content).prop('href');
    },

    save: function(delay) {
        console.log('This is a high score deck, data should be saved locally');

        window.setTimeout(function() {
            window.location = '//www.hearthpwn.com/packs/simulator/1-hearthpwn-wild-pack';
        }, delay);
    },

    next: function(delay) {
        window.setTimeout(function() {
            window.location = $('a#next-pack', Simulator.content).prop('href');
        }, delay);
    },

    init: function() {
        window.setTimeout(function(){
            console.clear();
            console.log('This script has been run ' + Simulator.counter + ' times.');
            console.log('Highest value opened pack was: ' + Simulator.maxscore);
            console.log(Simulator.location);
            if (Simulator.location[2] != 'simulator' && Simulator.autoskip === true) {
                Simulator.save();
            }

            else if (typeof(Simulator.location[3]) == 'undefined' && Simulator.autoskip === true) {
                Simulator.forward();
            }

            else if (typeof(Simulator.location[3]) !== 'undefined' && Simulator.allowed.indexOf(Simulator.location[3]) >= 0 && Simulator.location.length > 3) {
                Simulator.packs();
            }
        }, Simulator.autodelay);
    }
};

GM_setValue('counter', ++Simulator.counter);

$(document).ready(function(){
    Simulator.init();
});
