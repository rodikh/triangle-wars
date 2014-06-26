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
        createjs.Ticker.setFPS(30);

        game.reset();
        createjs.Ticker.on('tick', this.gameLoop, this, false, {game: game, container: gameContainer, graphics: this});
        this.stage.update();
    };

    GraphicsEngine.prototype.gameLoop = function (event, args) {
        var updated = args.game.logicLoop();

        if (updated.units) {
            this.drawUnits(args.game, args.graphics, args.container);
            args.graphics.stage.update();
        }
    };

    GraphicsEngine.prototype.drawUnits = function (game, graphics, container) {
        var i,
            unitsLength = game.units.length,
            unitsContainer = graphics.getContainer('units', container, true);
        for (i = 0; i < unitsLength; i++) {
            var unit = game.units[i];
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
            unit.container.rotation = unit.rot + 90;

            unitsContainer.addChild(unit.container);
        }
    }

    GraphicsEngine.prototype.exit = function(event) {
        /*jshint validthis: true */
        createjs.Ticker.removeAllEventListeners('tick');
        MenuUtils.sceneButton.call(this, event);
    }

} (window, window.GraphicsEngine, window.Game, window.MenuUtils));
