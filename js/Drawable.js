(function (window, AssetPreloader) {
    'use strict';

    /**
     * An extender for unit objects that handles graphics containers.
     * @param {Unit} object the Unit to extend
     * @constructor
     */
    var Drawable = function (object) {
        this.object = object;
        this.container = new createjs.Container();

        var image = AssetPreloader.getResult(object.model);
        var bitmap = new createjs.Bitmap(image);
        this.container.addChild(bitmap);
        this.container.regX = bitmap.image.width / 2;
        this.container.regY = bitmap.image.height / 2;

    };

    /**
     * Sync the graphics to the logic
     */
    Drawable.prototype.update = function () {
        this.container.x = this.object.x;
        this.container.y = this.object.y;
        this.container.rotation = this.object.rot + 90;
    };

    window.Drawable = Drawable;
} (window, window.AssetPreloader));