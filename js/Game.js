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
        this.units.neutral.push(new Unit({x: 50, model: 'blue-frigate'}));
        this.units.neutral.push(new Unit({x: 50, y: 200, model: 'blue-destroyer'}));
    };

    window.Game = Game;
 
} (window, window.Unit));