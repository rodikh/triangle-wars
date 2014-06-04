(function (window, GraphicsEngine) {
    'use strict';

    var Game = function () {
        console.log('Game: Creating');
        this.graphics = new GraphicsEngine();
        this.reset();
    };

    Game.prototype.reset = function () {
        console.log('Game: Resetting');
//        this.graphics.setBackground(imageAssets.mainBg);
    };

    window.Game = Game;
 
} (window, window.GraphicsEngine));