(function (window, Game, GraphicsEngine) {
    'use strict';

    var graphics = new GraphicsEngine();
    graphics.assetPreloader.promiseAssets().then(function () {
//        graphics.mainMenuScene();
        graphics.gameScene();
    });

    window.graphics = graphics;

} (window, window.Game, window.GraphicsEngine));