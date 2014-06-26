(function (window, AssetPreloader) {
    'use strict';

    var Drawable = function (object) {
        this.object = object;
        this.container = new createjs.Container();

        var image = AssetPreloader.getResult(object.model);
        var bitmap = new createjs.Bitmap(image);
        this.container.addChild(bitmap);
        this.container.regX = bitmap.image.width / 2;
        this.container.regY = bitmap.image.height / 2;

    };

    Drawable.prototype.update = function () {
        this.container.x = this.object.x;
        this.container.y = this.object.y;
        this.container.rotation = this.object.rot + 90;
    };

    window.Drawable = Drawable;
} (window, window.AssetPreloader));