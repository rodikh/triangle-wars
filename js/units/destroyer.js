/**
 * Created by rodik on 4/14/15.
 */
(function (Unit, UnitFactories) {
    function Destroyer (options) {
        options.model = "destroyer";
        Unit.call(this, options);

    }

    Destroyer.prototype = Object.create(Unit.prototype);
    Destroyer.prototype.constructor = Destroyer;

    UnitFactories.Destroyer = Destroyer;
}(window.Unit, window.UnitFactories));