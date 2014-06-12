(function (window, GraphicsEngine, Game, MenuUtils) {
    'use strict';

    var redraw = false;

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
        createjs.Ticker.on('tick', gameLoop, this, false, {game: game, container: gameContainer});

        this.stage.update();
    };

    function gameLoop(event, args) {
        console.log('gameLoop', event, args.game);

        if (redraw) {
            redraw = false;
            drawUnits(args.game.units.neutral, args.container);
        }
    }

    function drawUnits(units, container) {
        container.getChildByName('');
        for (var i in units) {
            if (units.hasOwnProperty(i)) {

            }
        }
    }

    function exit(event) {
        /*jshint validthis: true */
        createjs.Ticker.removeAllEventListeners('tick');
        MenuUtils.sceneButton.call(this, event);
    }

} (window, window.GraphicsEngine, window.Game, window.MenuUtils));
