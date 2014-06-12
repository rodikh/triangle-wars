(function (window, GraphicsEngine, MenuUtils) {
    'use strict';

    var menuButtons = [
        {label: 'Back', name: 'mainMenuScene'}
    ];

    GraphicsEngine.prototype.testMenuScene = function () {
        this.stage.removeAllChildren();
        var menuContainer = new createjs.Container();
        this.setBackground(menuContainer, 'images/bg-menu.jpg');

        var i, length = menuButtons.length;
        for (i = 0; i < length; i++) {
            var buttonContainer = MenuUtils.createButtonContainer(menuButtons[i], {x: 20, y: (i * 50) + 20});
            buttonContainer.on('click', MenuUtils.sceneButton, this);
            menuContainer.addChild(buttonContainer);
        }

        this.addContainer(menuContainer, 'menu');

        this.stage.update();
    };
} (window, window.GraphicsEngine, window.MenuUtils));
