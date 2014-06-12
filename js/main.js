(function (window, Game, GraphicsEngine) {
    'use strict';

    var graphics = new GraphicsEngine();
    graphics.promiseAssets.then(function () {
        graphics.mainMenuScene();
    });

} (window, window.Game, window.GraphicsEngine));