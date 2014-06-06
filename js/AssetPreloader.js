(function (window, Deferred) {
    'use strict';
    function assetPreloader() {
        var dfr = new Deferred();

        var manifest = [
            {src: 'images/bg1.jpg', id: 'bg1'},
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

        var preload = new createjs.LoadQueue();
        preload.on('complete', handleComplete);
        preload.on('progress', handleProgress);
        preload.on('fileload', handleFileLoad);

        preload.loadManifest(manifest);

        return dfr.promise();
    }

    window.assetPreloader = assetPreloader;

} (window, $.Deferred));