(function (window, Drawable) {
    'use strict';

    /**
     * Base Unit Class,
     * Implements a mobile navigating body.
     * @constructor
     */
    var Unit = function (options) {
        console.log('Base Unit Created');

        // Unit physical properties
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.rot = options.rot || 0;
        this.model = options.model || 'red-frigate';
        this.velocity = 0;
        this.acceleration = options.acceleration || 0.1;

        // Unit vitals
        this.maxHp = 10;
        this.hp = this.maxHp;

        // Unit spec properties
        this.maxSpeed = 3;
        this.faction = options.faction || 'red';

        // Unit behaviour properties
        this.target = {x: options.x, y: options.y};
        this.status = 'idle';

        // Unit graphics
        this.drawable = new Drawable(this);

        // development
        this.verbose = options.verbose || false;
    };

    /**
     * Distance between two points
     * @param {{number, number}} p1 Point to measure distance from
     * @param {{number, number}} p2 Point to measure distance to
     * @returns {number} Distance between the points
     */
    function distance(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }

    /**
     * Angle between two points
     * @param {{number, number}} p1 Point to measure angle from
     * @param {{number, number}} p2 Point to measure amg;e to
     * @returns {number} Angle between p2 and x axis for p1.
     */
    function direction(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    /**
     * Angle difference between two angles
     * @param {number} a1 Angle to measure difference from
     * @param {number} a2 Angle to measure difference to
     * @returns {number} Angle between angles.
     */
    function correction(a1, a2) {
        return (a2 - a1 + 180) % 360 - 180;
    }

    /**
     * Accelerate or Decelerate a unit to a given speed
     * @param {Unit} unit
     * @param {number} targetVelocity
     */
    function throttleTo(unit, targetVelocity) {
        // TODO: Implement acceleration and deceleration
        if (unit.velocity < targetVelocity) {
            unit.velocity += (unit.velocity + unit.acceleration < targetVelocity) ? unit.acceleration : targetVelocity - unit.velocity;
        }else if (unit.velocity > targetVelocity) {
            unit.velocity -= (unit.velocity - unit.acceleration > targetVelocity) ? unit.acceleration : unit.velocity - targetVelocity;
        }
    }

    /**
     * Steadily turn a unit to face a direction
     * @param {Unit} unit
     * @param {number} targetAngle
     */
    function bankTo(unit, targetAngle) {
        var navAngleAccuracy = 2; // The allowed amount of degree error during navigation
        // TODO: rotate easeinout
        var deltaAngle = correction(unit.rot, targetAngle);
        if (Math.abs(deltaAngle) > navAngleAccuracy) {

            //var rotationFriction = unit.velocity;							// random rotation speed
            //var drot = 3 * rotationFriction;
            var drot = 3 + (Math.random() * 2 - 1);
            //if (drot > 5){
            //    drot = 5;
            //}

            if (deltaAngle > 2) {
                unit.rot += drot;
            } else {								// gradually rotate body to waypoint
                unit.rot -= drot;
            }

            if (unit.rot < -180) {
                unit.rot += 360;
            } else if (unit.rot > 180) {
                unit.rot -= 360;
            }
        }
    }

    /**
     * Idle behaviour
     */
    Unit.prototype.idle = function () {

        // Maintain idle velocity
        var idleSpeed = this.maxSpeed/4;
        throttleTo(this, idleSpeed);

        if (distance(this, this.target) > 15) {		// if further than 15 pixels away from target
            bankTo(this, direction(this, this.target));
        }
    };

    /**
     * Flying to point behaviour
     * @param {{number, number}} [target] Target waypoint to fly to
     */
    Unit.prototype.flyTo = function (target) {			// set and recalibrate heading to target per tick
        if(target !== undefined){
            this.target.x = target.x;					// set a new waypoint
            this.target.y = target.y;
            this.status = 'flying';
        }

        if (distance(this, this.target) > 20) {		// if further than 10 pixels away
            throttleTo(this, this.maxSpeed);
        } else {
            this.status = 'idle';
        }

        bankTo(this, direction(this, this.target));

    };

    /**
     * Unit's tick function, updates position and behaviour
     */
    Unit.prototype.unitTick = function () {
        if (this.hp <= 0) {
            this.destroy();
            return true;
        }

        if(this.status === 'flying'){
            this.flyTo();
        }else if(this.status === 'idle'){
            this.idle();
        }

        if (this.velocity !== 0) {
            this.x += this.velocity * Math.cos(this.rot * (Math.PI/180));
            this.y += this.velocity * Math.sin(this.rot * (Math.PI/180));

            return true;
        }

        return false;
    };

    Unit.prototype.destroy = function () {
        var index = game.units.indexOf(this);
        game.units.splice(index, 1);
    };

    window.Unit = Unit;
    window.UnitFactories = {};
} (window, window.Drawable));