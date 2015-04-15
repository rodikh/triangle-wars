/**
 * Created by rodik on 4/14/15.
 */
(function (Unit, UnitFactories) {
    function Frigate (options) {
        options.model = "frigate";
        Unit.call(this, options);

    }

    Frigate.prototype = Object.create(Unit.prototype);
    Frigate.prototype.constructor = Frigate;

    UnitFactories.Frigate = Frigate;
}(window.Unit, window.UnitFactories));