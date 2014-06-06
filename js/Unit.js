(function (window) {
    'use strict';

    var Unit = function (options) {
        console.log('Base Unit Created');
        this.x = options.x || 50;
        this.y = options.y || 50;
    };

    window.Unit = Unit;
} (window));