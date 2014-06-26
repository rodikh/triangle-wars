(function (window, AssetPreloader) {
    'use strict';

    /**
     * The EaselJS graphics engine
     * @constructor
     */
    var GraphicsEngine = function () {
        this.stage = new createjs.Stage(document.getElementById('main_canvas'));
    };

    /**
     * Adds a background image to a container using another nested container
     * @param {createjs.Container} ctx A container to add a background to
     * @param imageUrl Background image URL
     */
    GraphicsEngine.prototype.setBackground = function (ctx, imageUrl) {
//        console.log('Graphics: Adding Background');
        var bgContainer = ctx.getChildByName('bg');
        if (!bgContainer) {
            bgContainer = new createjs.Container();
            this.addContainer(bgContainer, 'bg', ctx);
        }

        var image = AssetPreloader.getResult(imageUrl);
        var bitmap = new createjs.Bitmap(image);
        bgContainer.removeAllChildren();
        bgContainer.addChild(bitmap);
    };

    /**
     * Adds the first container as a child of a second container.
     * If no second container passed, adds the first container to the stage.
     * @param container {createjs.Container}
     * @param name
     * @param [ctx] {createjs.Container}
     */
    GraphicsEngine.prototype.addContainer = function (container, name, ctx) {
//        console.log('Graphics: Container Added', name);
        container.name = name;

        if (ctx) {
            return ctx.addChild(container);
        } else {
            return this.stage.addChild(container);
        }
    };

    /**
     * Gets a child container of the passed container by name
     * If a container was not passed, gets child of stage
     * @param name
     * @param ctx {createjs.Container}
     * @param createIfNotFound {bool}
     * @returns {createjs.Container | bool}
     */
    GraphicsEngine.prototype.getContainer = function (name, ctx, createIfNotFound) {

        if (!ctx) {
            ctx = this.stage;
        }

        var child = ctx.getChildByName(name);
        if (child) {
            return child;
        } else if (createIfNotFound) {
            return this.addContainer(new createjs.Container(), name, ctx);
        }

        return false;
    };

    window.GraphicsEngine = GraphicsEngine;

} (window, window.AssetPreloader));