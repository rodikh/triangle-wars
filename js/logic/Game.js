(function (window, Unit) {
    'use strict';

    var Game = function () {
    };

    Game.prototype.reset = function () {
        console.log('Game: Resetting');
        this.units = [];
        this.addUnit({x: 15, faction: 'red'});
        this.addUnit({x: 50, rot: 45, model: 'blue-frigate', faction: 'red'});
        this.addUnit({x: 50, y: 200, model: 'blue-destroyer', faction: 'red'});
        this.addUnit({x: 200, y: 250, rot: 23, model: 'red-destroyer', faction: 'red'});
    };

    Game.prototype.addUnit = function (args) {
        var unit = new Unit(args);
        this.units.push(unit);
    };

    Game.prototype.removeUnit = function (unit) {
        this.units.splice(createjs.indexOf(this.units, unit), 1);
    };

    Game.prototype.logicLoop = function () {
        var i,
            updated = {},
            unitsLength = this.units.length;

        for (i = 0; i < unitsLength; i++) {
            if (this.units[i].unitTick()) {
                updated.units = true;
            }
        }

        return updated;
    };

    window.Game = Game;
 
} (window, window.Unit));