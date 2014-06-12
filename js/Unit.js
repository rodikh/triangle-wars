(function (window) {
    'use strict';

    var Unit = function (options) {
        console.log('Base Unit Created');
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.model = 'red-frigate';
    };

    window.Unit = Unit;
} (window));