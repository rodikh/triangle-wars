(function (window, Unit) {
    'use strict';

    var Structure = function (options) {
        console.log('Base Unit Created');
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.rot = options.rot || 0;
        this.model = options.model || 'red-frigate';
        this.faction = options.faction || 'red';
        this.updated = true;
    };

    Structure.prototype = Unit.prototype;

    window.Structure = Structure;
} (window, window.Unit));