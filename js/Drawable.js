(function (window) {
    'use strict';

    var factionColors = {
        'red': new createjs.ColorFilter(1,.2,.2,1),
        'blue': new createjs.ColorFilter(.2,.2,1,1)
    };

    /**
     * An extender for unit objects that handles graphics containers.
     * @param {Unit} object the Unit to extend
     * @constructor
     */
    var Drawable = function (object, assetPreloader) {
        this.object = object;
        this.container = new createjs.Container();

        var image = assetPreloader.getAsset(object.model);
        this.unitBitmap = new createjs.Bitmap(image);
        this.unitBitmap.filters = [factionColors[object.faction]];
        this.unitBitmap.cache(0, 0, image.width, image.height);
        this.container.addChild(this.unitBitmap);
        this.unitBitmap.regX = this.unitBitmap.image.width / 2;
        this.unitBitmap.regY = this.unitBitmap.image.height / 2;

        this.hpLine = new createjs.Shape();
        this.hpLine.regX = this.unitBitmap.image.width / 2;
        this.hpLine.regY = this.unitBitmap.image.height / 2 + 5;
        this.updateHp();
        this.container.addChild(this.hpLine);
    };

    /**
     * Sync the graphics to the logic
     */
    Drawable.prototype.update = function () {
        this.container.x = this.object.x;
        this.container.y = this.object.y;
        this.unitBitmap.rotation = this.object.rot + 90;

        this.updateHp();
    };

    Drawable.prototype.updateHp = function () {
        if (this.lastHP == this.object.hp) {
            return false;
        }

        this.hpLine.visible = this.object.hp != this.object.maxHp;
        if (!this.hpLine.visible) {
            return;
        }

        var color = "rgba(0,255,0,1)";
        if (this.object.hp / this.object.maxHp < 0.25) {
            color = "rgba(255,0,0,1)";
        }

        this.hpLine.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0, 1)");
        this.hpLine.graphics.moveTo(0, 0);
        this.hpLine.graphics.lineTo(this.unitBitmap.image.width, 0);

        this.hpLine.graphics.setStrokeStyle(1).beginStroke(color);
        this.hpLine.graphics.moveTo(0, 0);
        this.hpLine.graphics.lineTo(this.unitBitmap.image.width * (this.object.hp / this.object.maxHp), 0);
        this.hpLine.graphics.endStroke();

        this.lastHP = this.object.hp;s
    };

    window.Drawable = Drawable;
}(window));