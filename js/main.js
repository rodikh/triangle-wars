(function (window, Game, GraphicsEngine, AssetPreloader) {
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
        Drawable.prototype.assetPreloader = assetPreloader;
        var graphicsEngine = new GraphicsEngine(document.getElementById('main_canvas'), assetPreloader);
        window.game = new Game(graphicsEngine);
    });

} (window, window.Game, window.GraphicsEngine, window.AssetPreloader));