(function (window, Game, promiseAssets) {
    'use strict';

    window.gui = new dat.GUI();

    promiseAssets().then(function () {
        window.game = new Game();
    });

} (window, window.Game, window.promiseAssets));