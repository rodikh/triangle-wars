(function (window, Deferred) {
    'use strict';
    function assetPreloader() {
        var dfr = new Deferred();

        var manifest = [
            {src: 'bg-menu.jpg', id: 'bg1'},
            {src: 'bg-game.jpg', id: 'bg2'},
            {src: 'units/red-frigate.png', id: 'red-frigate'},
            {src: 'units/blue-frigate.png', id: 'blue-frigate'},
            {src: 'units/red-destroyer.png', id: 'blue-destroyer'},
            {src: 'units/blue-destroyer.png', id: 'blue-destroyer'}
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

        var preload = new createjs.LoadQueue(true, 'images/');
        preload.on('complete', handleComplete);
        preload.on('progress', handleProgress);
        preload.on('fileload', handleFileLoad);

        preload.loadManifest(manifest);

        return dfr.promise();
    }

    window.assetPreloader = assetPreloader;

} (window, $.Deferred));