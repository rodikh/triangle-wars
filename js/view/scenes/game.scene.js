(function (window, GraphicsEngine, Game, MenuUtils) {
    'use strict';

    var redraw = true;

    GraphicsEngine.prototype.gameScene = function () {
        this.stage.removeAllChildren();
        var gameContainer = new createjs.Container();
        this.setBackground(gameContainer, 'bg-game');
        this.addContainer(gameContainer, 'game');

        var buttonContainer = MenuUtils.createButtonContainer({label: 'Exit', name:'mainMenuScene'}, {x: 20, y:  50});
        buttonContainer.on('click', this.exit, this);
        gameContainer.addChild(buttonContainer);

        var game = window.game = new Game();

        createjs.Ticker.removeAllEventListeners('tick');
        createjs.Ticker.setFPS(10);

        game.reset();
        createjs.Ticker.on('tick', this.gameLoop, this, false, {game: game, container: gameContainer, graphics: this});
        this.stage.update();
    };

    GraphicsEngine.prototype.gameLoop = function (event, args) {
        if (this.shouldRedrawUnits(args.game.units)) {
            redraw = false;
            this.drawUnits(args.game.units.neutral, args.graphics, args.container);
            args.graphics.stage.update();
        }
    };

    GraphicsEngine.prototype.shouldRedrawUnits = function (units) {
        var redraw = false;
        for (var i in units) {
            if (units.hasOwnProperty(i)) {
                var faction = units[i];
                for (var j in faction) {
                    if (faction.hasOwnProperty(j)) {
                        var unit = faction[j];
                        console.log('unit', unit);
                        if (unit.updated) {
                            unit.updated = false;
                            redraw = true;
                        }
                    }
                }
            }
        }

        return redraw;
    };

    GraphicsEngine.prototype.drawUnits = function (units, graphics, container) {
        var unitsContainer = graphics.getContainer('units', container, true);
        for (var i in units) {
            if (units.hasOwnProperty(i)) {
                var unit = units[i];
                console.log('unit', units[i]);
                if (!unit.container) {
                    unit.container = new createjs.Container();
                    var image = this.assetPreloader.preload.getResult(unit.model);
                    var bitmap = new createjs.Bitmap(image);
                    unit.container.addChild(bitmap);
                    unit.container.regX = bitmap.image.width / 2;
                    unit.container.regY = bitmap.image.height / 2;
                }

                unit.container.x = unit.x;
                unit.container.y = unit.y;
                unit.container.rotation = unit.rot;

                unitsContainer.addChild(unit.container);
            }
        }
    }

    GraphicsEngine.prototype.exit = function(event) {
        /*jshint validthis: true */
        createjs.Ticker.removeAllEventListeners('tick');
        MenuUtils.sceneButton.call(this, event);
    }

} (window, window.GraphicsEngine, window.Game, window.MenuUtils));
