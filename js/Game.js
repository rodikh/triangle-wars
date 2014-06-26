(function (window, Unit, GraphicsEngine) {
    'use strict';

    /**
     * Game manager
     * @constructor
     */
    var Game = function () {
        this.graphics = new GraphicsEngine();
        gameScene(this);
    };

    /**
     * Reset the game data to a new game state
     */
    Game.prototype.reset = function () {
        console.log('Game: Resetting');
        this.units = [];
        this.addUnit({x: 100, y: 100, rot: 0, model: 'blue-frigate', faction: 'red', verbose: true});
//        this.addUnit({x: 15, faction: 'red'});
//        this.addUnit({x: 50, y: 200, model: 'blue-destroyer', faction: 'red'});
//        this.addUnit({x: 200, y: 250, rot: 23, model: 'red-destroyer', faction: 'red'});
    };

    /**
     * Spawn a new unit from arguments
     * @param {*} args
     */
    Game.prototype.addUnit = function (args) {
        var unit = new Unit(args);
        this.units.push(unit);
    };

    /**
     * Game loop that only deals with game logic
     * @returns {*} list of updates that were made for rerendering
     */
    Game.prototype.logicLoop = function () {
        var i,
            updated = {},
            unitsLength = this.units.length;

        for (i = 0; i < unitsLength; i++) {
            if (this.units[i].unitTick()) {
                updated.units = true;
            }
        }

        return updated;
    };

    /**
     * Loop that only deals with rendering
     */
    Game.prototype.graphicLoop = function () {
        var updated = this.logicLoop();

        if (updated.units) {
            var i,
                unitsLength = this.units.length,
                unitsContainer = this.graphics.getContainer('units', this.gameContainer, true);
            for (i = 0; i < unitsLength; i++) {
                var unit = this.units[i];
                unit.drawable.update();
                unitsContainer.addChild(unit.drawable.container);
            }
            this.graphics.stage.update();
        }
    };

    window.Game = Game;

    /**
     * Creates the game stage and containers for a new game
     * @param {Game} game
     */
    function gameScene(game) {
        game.graphics.stage.removeAllChildren();
        game.gameContainer = new createjs.Container();
        game.graphics.setBackground(game.gameContainer, 'bg-game');
        game.graphics.addContainer(game.gameContainer, 'game');

        createjs.Ticker.removeAllEventListeners('tick');
        createjs.Ticker.setFPS(30);

        game.reset();
        createjs.Ticker.on('tick', game.graphicLoop, game);
        game.graphics.stage.update();
    }
 
} (window, window.Unit, window.GraphicsEngine));