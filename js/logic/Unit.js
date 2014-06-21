(function (window) {
    'use strict';

    var Unit = function (options) {
        console.log('Base Unit Created');
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.rot = options.rot || 0;
        this.model = options.model || 'red-frigate';
        this.updated = true;
    };

    Unit.prototype.unitTick = function () {
        this.rot += 1;
        console.log('unit tick');
        this.updated = true;
    };

    window.Unit = Unit;
} (window));