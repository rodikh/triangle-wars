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
            if (evt.nativeEvent.button === 2) {
                console.log('lclick');
                // left click
                var i = self.selection.length;
                while (i--) {
                    if (self.selection[i].flyTo) {
                        self.selection[i].flyTo({x: evt.stageX, y: evt.stageY});
                    }
                }
            } else if (evt.nativeEvent.button === 0) {
                console.log('TARGETS', evt);
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
                    return;
                }

                self.clearSelection();
                self.selectUnit(unit);
            } else if (evt.nativeEvent.button === 2) {
                // interact with unit
                self.selectionInteractWith(unit);
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

    UserControls.prototype.clearSelection = function () {
        var i = this.selection.length;
        while (i--) {
            this.deselectUnit(this.selection[i]);
        }
    };
    window.UserControls = UserControls;

}(window));