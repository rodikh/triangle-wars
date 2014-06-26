(function (window) {
    'use strict';

    var Unit = function (options) {
        console.log('Base Unit Created');

        // Unit physical properties
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.rot = options.rot || 0;
        this.model = options.model || 'red-frigate';
        this.velocity = 0.5;

        // Unit spec properties
        this.speed = 2;
        this.faction = options.faction || 'red';

        // Unit behaviour properties
        this.target = {x: 150, y: 150};
        this.status = 'idle';
    };


    /**
     * Distance between two points
     */
    function distance(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }

    /**
     * Angle between two points
     */
    function direction(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    /**
     * Angle difference between two angles
     */
    function correction(a1, a2) {
        return (a2 - a1 + 180) % 360 - 180;
    }

    /**
     * Accelerate or Decelerate to a given speed
     */
    function throttleTo(unit, targetVelocity) {
        // TODO: Implement acceleration and deceleration
        if (unit.velocity < targetVelocity) {
            unit.velocity += targetVelocity / 15;
        }else if (unit.velocity > targetVelocity) {
            unit.velocity -= targetVelocity / 15;
        }
    }

    /**
     * Steadily turn a unit to face a direction
     */
    function bankTo(unit, targetAngle) {
        var navAngleAccuracy = 2; // The allowed amount of degree error during navigation
        // TODO: rotate easeinout
        var deltaAngle = correction(unit.rot, targetAngle);
        if (deltaAngle > navAngleAccuracy || deltaAngle < -navAngleAccuracy) {// Same algorithm to face the waypoint.
            var rand = Math.random();	// max rotation speed at idle is 9 angles per frame
            var rotationFriction = unit.velocity;							// random rotation speed
            var drot = 5 * rotationFriction * rand;
            if (drot > 9){
                drot = 10;
            }
            if (deltaAngle > 0) {
                unit.rot += drot;
            } else {								// gradually rotate body to waypoint
                unit.rot -= drot;
            }
            if (unit.rot < -180) {
                unit.rot += 360;
            }		// don't overflow angles
            else if (unit.rot > 180) {
                unit.rot -= 360;
            }
        }
    }

    /**
     * Idle behaviour
     */
    Unit.prototype.idle = function () {

        // Maintain idle velocity
        var idleSpeed = this.speed/4;
        throttleTo(this, idleSpeed);

        if (distance(this, this.target) > 15) {		// if further than 15 pixels away from target
            bankTo(this, direction(this, this.target));
        }
    };

    /**
     * Flying to point behaviour
     */
    Unit.prototype.flyTo = function (target) {			// set and recalibrate heading to target per tick
        if(target !== undefined){
            this.target.x = target.x;					// set a new waypoint
            this.target.y = target.y;
            this.status = 'flying';
        }

        bankTo(this, direction(this, this.target));

        if (distance(this, this.target) > 20) {		// if further than 10 pixels away
            throttleTo(this, this.speed);
        } else {
            this.status = 'idle';
        }
    };

    /**
     * Unit's tick function, updates position and behaviour
     */
    Unit.prototype.unitTick = function () {
        if(this.status === 'flying'){
            this.flyTo();
        }else if(this.status === 'idle'){
            this.idle();
        }

        // move unit
        if(this.velocity > 0){
            this.x += this.velocity * Math.cos(this.rot * (Math.PI/180));
            this.y += this.velocity * Math.sin(this.rot * (Math.PI/180));
        }

        return true;
    };

    window.Unit = Unit;
} (window));