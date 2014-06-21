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
        this.units.neutral.push(new Unit({x: 50, rot: 45, model: 'blue-frigate'}));
        this.units.neutral.push(new Unit({x: 50, y: 200, model: 'blue-destroyer'}));
        this.units.neutral.push(new Unit({x: 200, y: 250, rot: 23, model: 'red-destroyer'}));
    };

    window.Game = Game;
 
} (window, window.Unit));