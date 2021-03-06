(function (window, Deferred) {
    'use strict';

    var dfr = new Deferred();

    var manifest = [
        {src: 'bg-menu.jpg', id: 'bg-menu'},
        {src: 'bg-game.jpg', id: 'bg-game'},
        {src: 'units/building.png', id: 'building'},
        {src: 'units/frigate.png', id: 'frigate'},
        {src: 'units/destroyer.png', id: 'destroyer'}
    ];

    function handleProgress(event) {
//            console.log('asset loading progress', event.progress);
    }

    function handleFileLoad(event) {
//            console.log('FILE LOAD', event);
    }

    function handleComplete(event) {
//            console.log('finished loading', event);
        dfr.resolve(event);
    }

    var AssetPreloader = new createjs.LoadQueue(true, 'images/');
    AssetPreloader.on('complete', handleComplete);
    AssetPreloader.on('progress', handleProgress);
    AssetPreloader.on('fileload', handleFileLoad);

    AssetPreloader.loadManifest(manifest);

    window.promiseAssets = function () {
        return dfr.promise();
    };
    window.AssetPreloader = AssetPreloader;

} (window, $.Deferred));