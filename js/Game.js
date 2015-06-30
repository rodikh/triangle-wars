(function (window, UnitFactories, GraphicsEngine, Building) {
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
        this.addUnit(UnitFactories.Frigate, {id: 'jack', x: 100, y: 100, rot: 0, faction: 'red', verbose: true});
        this.addUnit(UnitFactories.Destroyer, {id: 'dessy', x: 120, y: 100, rot: 0, faction: 'red', verbose: true});
        this.addUnit(UnitFactories.Frigate, {id: 'mel', x: 600, y: 500, rot: 270, faction: 'blue', verbose: true});
        this.addUnit(Building, {x: 400, y: 400, faction: 'blue'});
    };

    /**
     * Spawn a new unit from arguments
     * @param {*} args
     */
    Game.prototype.addUnit = function (Factory, args) {
        var unit = new Factory(args);
        if (args.verbose) {
            var unitf = gui.addFolder(args.id);
            unitf.add(unit, 'x').listen();
            unitf.add(unit, 'y').listen();
            unitf.add(unit, 'hp').listen();
            unitf.add(unit, 'rot').listen();
            unitf.add(unit, 'status').listen();
            unitf.add(unit, 'velocity').listen();
        }
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
 
} (window, window.UnitFactories, window.GraphicsEngine, window.Building));