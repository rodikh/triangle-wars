(function (window, Unit) {
    'use strict';

    var Game = function () {
    };

    Game.prototype.reset = function () {
        console.log('Game: Resetting');
        this.units = {
            neutral: []
        };
        this.units.neutral.push(new Unit({x: 15}));
    };

    window.Game = Game;
 
} (window, window.Unit));