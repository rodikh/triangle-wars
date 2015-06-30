(function (window, UnitFactories, Drawable) {
    'use strict';

    /**
     * Base Unit Class,
     * Implements a mobile navigating body.
     * @constructor
     */
    var Building = function (options) {
        console.log('Base Building Created');

        // Building physical properties
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.rot = options.rot || 0;
        this.model = options.model || 'building';

        // Building vitals
        this.maxHp = 100;
        this.hp = this.maxHp;

        this.faction = options.faction || 'red';

        this.status = 'idle';

        // development
        this.verbose = options.verbose || false;
    };

    Building.prototype.unitTick = function () {
        return true;
    };

    Building.prototype.buildUnit = function (unitType) {
        if (!UnitFactories[unitType]) {
            console.error('No unit', unitType);
        }
        game.addUnit(UnitFactories[unitType], {x: this.x, y: this.y, faction: this.faction})
    };

    window.Building = Building;
} (window, window.UnitFactories, window.Drawable));