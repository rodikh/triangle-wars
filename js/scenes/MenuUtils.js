(function (window) {
    'use strict';

    var MenuUtils = {
        /**
         * Creates a button container for navigational menus
         * @param buttonConfig {{label, sceneId}}
         * @param settings {{x, y}}
         * @returns {createjs.Container}
         */
        createButtonContainer: function (buttonConfig, settings) {
            var width = 100, height = 30;
            var buttonContainer = new createjs.Container();
            buttonContainer.name = buttonConfig.scene;
            var rect = new createjs.Shape();
            rect.graphics.beginFill('#6e7e8e').drawRect(0, 0, width, height);
            buttonContainer.addChild(rect);

            var text = new createjs.Text();
            text.set({
                text: buttonConfig.label,
                textAlign: 'center',
                textBaseline: 'middle',
                x: width/2,
                y: height/2
            });
            buttonContainer.addChild(text);

            buttonContainer.x = settings.x;
            buttonContainer.y = settings.y;

            return buttonContainer;
        },
        /**
         * handles click on navigational buttons
         * @param event
         */
        sceneButton: function (event) {
        /*jshint validthis: true */
            var sceneId = event.currentTarget.name;
            if (typeof this[sceneId] === 'function') {
                this[sceneId]();
            } else {
                console.error('Scene not found: ' + sceneId);
            }
        }
    };

    window.MenuUtils = MenuUtils;
} (window));