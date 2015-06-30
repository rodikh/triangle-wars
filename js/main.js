(function (window, Game, promiseAssets) {
    'use strict';

    window.gui = new dat.GUI();
    var manifest = [
        {src: 'bg-menu.jpg', id: 'bg-menu'},
        {src: 'bg-game.jpg', id: 'bg-game'},
        {src: 'units/building.png', id: 'building'},
        {src: 'units/frigate.png', id: 'frigate'},
        {src: 'units/destroyer.png', id: 'destroyer'}
    ];

    window.assets = new AssetPreloader(manifest, 'images/');
    window.assets.promiseAssets().then(function (evt, assetPreloader) {
        window.game = new Game(assetPreloader);
    });

} (window, window.Game, window.promiseAssets));