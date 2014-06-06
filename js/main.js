(function (window, Game, GraphicsEngine) {
    'use strict';

    var game = new Game();

    var graphics = new GraphicsEngine();

    window.game = game;

//    game.reset();
    graphics.mainMenuScene();

} (window, window.Game, window.GraphicsEngine));