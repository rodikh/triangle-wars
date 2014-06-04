(function (window) {
    'use strict';

    /**
     * The EaselJS graphics engine
     * @constructor
     */
    var GraphicsEngine = function () {
        console.log('Graphics: Initializing');
        this.stage = new createjs.Stage(document.getElementById('main_canvas'));
    };

    GraphicsEngine.prototype.loadImages = function (images) {
        var i;
        for (i in images) {
            if (images.hasOwnProperty(i) && typeof images[i] === 'string') {
                images[i] = new createjs.Bitmap(images[i]);
            }
        }
    };

    GraphicsEngine.prototype.addContainer = function (container, name) {
        console.log('Graphics: Container Added', name);
        container.name = name;
        this.stage.addChild(container);
    };

    GraphicsEngine.prototype.setBackground = function (image) {
        console.log('Graphics: Adding Background');
        var container = this.stage.getChildByName('background');
        if (!container) {
            container = new createjs.Container();
            this.addContainer(container, 'background');
        }
        container.removeAllChildren();
        container.addChild(image);
        image.on('load', this.stage.update);
    };

    window.GraphicsEngine = GraphicsEngine;

} (window));