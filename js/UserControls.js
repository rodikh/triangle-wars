(function (window) {
    'use strict';

    /**
     * UserControls manager
     * @constructor
     */
    var UserControls = function (game) {
        this.game = game;
    };

    UserControls.prototype.reset = function () {
        this.selection = [];
        this.game.gameContainer.off();
        this.bindMouseEvents();

    };

    UserControls.prototype.bindMouseEvents = function () {
        var self = this;
        this.game.gameContainer.on("click", function (evt) {
            console.log('click', evt);
            if (evt.nativeEvent.button === 2) {
                // left click
                var i = self.selection.length;
                while (i--) {
                    if (self.selection[i].flyTo) {
                        self.selection[i].flyTo({x: evt.stageX, y: evt.stageY});
                    }
                }
            } else if (evt.nativeEvent.button === 0) {
                self.clearSelection();
            }
        });
        this.handleSelectBox(this.game.gameContainer);

    };

    UserControls.prototype.handleSelectBox = function (ctx) {
        var self = this;
        var selectBox = new createjs.Shape();
        selectBox.graphics.beginFill("rgba(0,0,200,0.3)").drawRect(0, 0, 0, 0);
        this.game.selectionContainer = this.game.graphics.addContainer(null, 'selection');
        this.game.selectionContainer.addChild(selectBox);
        selectBox.visible = false;

        ctx.on("mousedown", function (evt) {
            selectBox.x = evt.stageX;
            selectBox.y = evt.stageY;
            selectBox.graphics.command.w = 0;
            selectBox.graphics.command.h = 0;
            selectBox.visible = true;
        });
        ctx.on("pressmove", function (moveEvt) {
            selectBox.graphics.command.w = moveEvt.stageX - selectBox.x;
            selectBox.graphics.command.h = moveEvt.stageY - selectBox.y;
        });

        ctx.on("pressup", function () {
            selectBox.visible = false;
            if (selectBox.graphics.command.w !== 0) {
                self.selectInBox(selectBox);
            }
        });
    };

    /**
     * Registers a new unit to control
     * @param unit
     */
    UserControls.prototype.registerUnit = function (unit) {
        var self = this;
        unit.drawable.on("click", function (evt) {
            if (evt.nativeEvent.button === 0) {
                if (evt.nativeEvent.ctrlKey) {
                    if (unit.selected) {
                        self.deselectUnit(unit);
                    } else {
                        self.selectUnit(unit);
                    }
                } else {
                    self.clearSelection();
                    self.selectUnit(unit);
                }
                evt.stopPropagation();
            } else if (evt.nativeEvent.button === 2) {
                // interact with unit
                self.selectionInteractWith(unit);
                evt.stopPropagation();
            }
        });
    };

    UserControls.prototype.selectionInteractWith = function (unit) {
        var i = this.selection.length;
        while (i--) {
            if (this.selection[i].interactWith) {
                this.selection[i].interactWith(unit);
            }
        }
    };

    UserControls.prototype.selectUnit = function (unit) {
        if (this.selection.indexOf(unit) === -1) {
            unit.selected = true;
            this.selection.push(unit);
        }
    };
    UserControls.prototype.deselectUnit = function (unit) {
        var index = this.selection.indexOf(unit);
        if (index !== -1) {
            unit.selected = false;
            this.selection.splice(index, 1);
        }
    };

    UserControls.prototype.selectInBox = function (selectionBox) {
        var rect = {
            x: selectionBox.x|0,
            y: selectionBox.y|0,
            width: selectionBox.graphics.command.w|0,
            height: selectionBox.graphics.command.h|0
        };

        if (rect.width < 0) {
            rect.width = -rect.width;
            rect.x -= rect.width;
        }
        if (rect.height < 0) {
            rect.height = -rect.height;
            rect.y -= rect.height;
        }

        var i = this.game.units.length;
        this.clearSelection();
        while (i--) {
            var unitDrawable = this.game.units[i].drawable;
            if (unitDrawable.collidesWith(rect)) {
                this.selectUnit(this.game.units[i]);
            }
        }
    };

    UserControls.prototype.clearSelection = function () {
        var i = this.selection.length;
        while (i--) {
            this.deselectUnit(this.selection[i]);
        }
    };
    window.UserControls = UserControls;

}(window));