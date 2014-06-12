(function (window, GraphicsEngine, Game, MenuUtils) {
    'use strict';

    var redraw = true;

    GraphicsEngine.prototype.gameScene = function () {
        this.stage.removeAllChildren();
        var gameContainer = new createjs.Container();
        this.setBackground(gameContainer, 'images/bg-game.jpg');
        this.addContainer(gameContainer, 'game');

        var buttonContainer = MenuUtils.createButtonContainer({label: 'Exit', name:'mainMenuScene'}, {x: 20, y:  50});
        buttonContainer.on('click', exit, this);
        gameContainer.addChild(buttonContainer);

        var game = window.game = new Game();

        game.reset();

        createjs.Ticker.removeAllEventListeners('tick');
        createjs.Ticker.setFPS(10);
        createjs.Ticker.on('tick', gameLoop, this, false, {game: game, container: gameContainer, graphics: this});

        this.stage.update();
    };

    function gameLoop(event, args) {
        if (redraw) {
            redraw = false;
            drawUnits(args.game.units.neutral, args.graphics, args.container);
            args.graphics.stage.update();
        }
    }

    function drawUnits(units, graphics, container) {
        var unitsContainer = graphics.getContainer('units', container, true);
        for (var i in units) {
            if (units.hasOwnProperty(i)) {
                var unit = units[i];
                console.log('unit', units[i]);
                if (!unit.container) {
                    unit.container = new createjs.Container();
                    unit.container.addChild(new createjs.Bitmap('images/units/' + unit.model + '.png'));
                }

                unit.container.x = unit.x;
                unit.container.y = unit.y;

                unitsContainer.addChild(unit.container);
            }
        }
    }

    function exit(event) {
        /*jshint validthis: true */
        createjs.Ticker.removeAllEventListeners('tick');
        MenuUtils.sceneButton.call(this, event);
    }

} (window, window.GraphicsEngine, window.Game, window.MenuUtils));
