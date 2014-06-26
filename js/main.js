(function (window, Game, promiseAssets) {
    'use strict';

    promiseAssets().then(function () {
        window.game = new Game();
    });

} (window, window.Game, window.promiseAssets));