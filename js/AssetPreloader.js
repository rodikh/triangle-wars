(function (window, Deferred) {
    'use strict';
    function AssetPreloader() {

        var dfr = new Deferred();

        var manifest = [
            {src: 'bg-menu.jpg', id: 'bg-menu'},
            {src: 'bg-game.jpg', id: 'bg-game'},
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

        this.preload = new createjs.LoadQueue(true, 'images/');
        this.preload.on('complete', handleComplete);
        this.preload.on('progress', handleProgress);
        this.preload.on('fileload', handleFileLoad);

        this.preload.loadManifest(manifest);

        this.promiseAssets = function () {
            return dfr.promise();
        }
    }

    window.AssetPreloader = AssetPreloader;

} (window, $.Deferred));