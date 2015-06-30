(function (window) {
    var unitsImg = new Image();
    unitsImg.src = "images/units.png";
    var unitsSprite;
    unitsImg.onload = function (e) {			/// should not be here, should initialize after load.
        unitsSprite = new SpriteSheet({
            images: [unitsImg],
            frames: {width: 20, height: 20, regX: 10, regY: 10}
        });
    }

    unitCont = new Container(canvas);
    var UnitC = Class.extend({
        init: function (obj) {
            this.body.x = 150;
            this.body.y = 150;
            this.body.rotation = 0;
            this.body.regX = 10;
            this.body.regY = 10;

            var tint = new ColorFilter(0.7, 0.7, 0.9, 1); // (red, green, blue, alpha)
            this.body.cache(0, 0, 20, 20);
            this.body.filters = [tint];
            this.body.updateCache();

            this.tx = 150;
            this.ty = 150;
            this.dead = 0;
            this.health = 10;
            this.velocity = 0.5;
            this.speed = 2;
            this.status = "idle";
            this.accuracy = 0.7;
            this.bullets = new Array();

            this.label = new Text(this.name, "20px Arial", "orange");
            this.label.textAlign = "center";
            this.label.x = this.body.x;
            this.label.y = this.body.y;

            unitCont.addChild(this.body);
            this.body.onClick = handlShipClick;
            this.body.parentId = units.push(this) - 1;
        },
        flyTo: function (tx, ty, start) {			// set and recalibrate heading to target per tick
            if (start == 1) {
                this.tx = tx;					// set a new waypoint
                this.ty = ty;
                this.status = "flying";
            }
            var destdeg = Math.atan2(-(this.body.y - this.ty), this.tx - this.body.x) * 180 / Math.PI; 	//(angle between the points)
            var ddeg = angleDiff(this.body.rotation, destdeg);											// delta degree - by how much ship is off course.
            if (ddeg > 4 || ddeg < -4) {								// if ship is too off course
                var drot = 2 * this.velocity;								// turning speed is relative to speed
                if (ddeg > 0) {
                    this.body.rotation += drot;						// turn right
                } else {
                    this.body.rotation -= drot;						// turn left
                }
                if (this.body.rotation < -180) this.body.rotation += 360;		// don't overflow over 180+ and 180-
                else if (this.body.rotation > 180) this.body.rotation -= 360;
            }
            if (Math.abs(this.body.x - this.tx) > 20 || Math.abs(this.body.y - this.ty) > 20) {		// if further than 10 pixels away
                if (this.velocity < this.speed) {
                    this.velocity += this.speed / 25;					// speed up to top speed over 25 frames
                }
            } else {
                selector.selCont.removeChild(this.lineTo);				// got to waypoint.
                delete(this.lineTo);
                if (start == -1) {
                } else {
                    this.status = "idle";
                }
            }
        },
        idle: function (type) {			// make ship patrol in place.
            if (type == "capturing") {
                var idleSpeed = this.speed;
            } else {
                var idleSpeed = this.speed / 4;
            }
            if (this.velocity < idleSpeed) {				// Maintain idle velocity (speed/4)
                this.velocity = idleSpeed;
            } else if (this.velocity > idleSpeed) {
                this.velocity -= idleSpeed / 6;						// if over idle speed, slow down
            }
            if (Math.abs(this.body.x - this.tx) > 15 || Math.abs(this.body.y - this.ty) > 15) {		// if further than 15 pixels away from target
                var destdeg = Math.atan2(-(this.body.y - this.ty), this.tx - this.body.x) * 180 / Math.PI;
                var ddeg = angleDiff(this.body.rotation, destdeg);
                if (ddeg > 2 || ddeg < -2) {											// Same algorithm to face the waypoint.
                    if (type != "capturing") {
                        var rand = Math.random();											// max rotation speed at idle is 9 angles per frame
                        var rotfric = this.velocity * rand;								// random rotation speed
                    } else {
                        var rand = Math.random();
                        var rotfric = this.speed / 1.5;
                    }
                    var drot = 5 * rotfric;
                    if (drot > 9) {
                        drot = 10;
                    }
                    if (ddeg > 0) {
                        this.body.rotation += drot;
                    } else {								// gradually rotate body to waypoint
                        this.body.rotation -= drot;
                    }
                    if (this.body.rotation < -180) this.body.rotation += 360;		// don't overflow angles
                    else if (this.body.rotation > 180) this.body.rotation -= 360;
                }

            } else {
                // finished idle cycle (got to waypoint again)
            }
        },
        capture: function (cell, start) {
            if (start == 1) {
                this.status = "capture";
                this.target = cell;
                this.tx = cell.body.x;
                this.ty = cell.body.y;
            }
            if (Math.abs(this.body.x - cell.body.x) > 50 || Math.abs(this.body.y - cell.body.y) > 50) {
                this.flyTo(cell.body.x, cell.body.y, -1);
            } else {
                this.idle("capturing");
                if (cell.owner > 1) {
                    if (cell.loyalty > 0) {
                        cell.loyalty -= 1;
                    } else {
                        cell.changeOwner(0);
                    }
                } else if (cell.owner == 0) {
                    if (cell.loyalty < 300) {
                        cell.loyalty += 1;
                    } else {
                        cell.changeOwner(1);
                    }
                } else if (cell.owner == 1 && cell.loyalty < 100) {
                    cell.loyalty += 1;
                }
                if (cell.owner == 1) {
                    selector.selCont.removeChild(this.lineTo);
                    this.status = "idle";
                }
            }
            track('Owner', cell.owner);
            track('Loyalty', cell.loyalty);

        },
        attack: function (target, start) {
            if (!unitExists(target.name)) {
                selector.selCont.removeChild(this.lineTo);
                delete(this.lineTo);
                this.status = "idle";
                return 1;
            }
            if (start == 1) {
                this.status = "attack";
                this.target = target;
                this.lastShot = 0;
            }
            var atkSpeed = this.speed;

            var destdeg = Math.atan2(-(this.body.y - this.target.body.y), this.target.body.x - this.body.x) * 180 / Math.PI;
            var ddeg = angleDiff(this.body.rotation, destdeg);
//			if(Math.abs(this.body.x - this.tx) > 30 || Math.abs(this.body.y - this.ty) > 30){		// if further than 15 pixels away from target
            if (Math.abs(ddeg) > 170) {			// enemy directly behind me
                var escapeModifier = atkSpeed + 0.5;				// SPEED UP, HE'S BEHIND ME
                if (this.velocity < escapeModifier) {
                    this.velocity += escapeModifier / 10;
                } else if (this.velocity > escapeModifier) {
                    this.velocity = escapeModifier;
                }
                var rand = Math.random();
                var rotfric = this.velocity * rand;
                var drot = 4 * rotfric;					// EVASIVE MANUVERS!
                if (drot > 10) {
                    drot = 10;
                }
                if (ddeg > 0) {
                    this.body.rotation += drot;
                } else {								// gradually rotate body to waypoint
                    this.body.rotation -= drot;
                }
            } else if (Math.abs(ddeg) > 4) {		// enemy behind me
                if (this.velocity < this.speed) {
                    this.velocity += this.speed / 10;
                } else if (this.velocity > this.speed) {
                    this.velocity = this.speed;
                }

                if (distance(this.body.x, this.body.y, this.target.body.x, this.target.body.y) < 60 && Math.abs(ddeg) > 90) {
                } else {
                    var rand = Math.random();
                    var rotfric = this.speed / 1.5;
                    var drot = 5 * rotfric;
                    if (drot > 12) {
                        drot = 13;
                    }
                    if (ddeg > 0) {
                        this.body.rotation += drot;
                    } else {								// gradually rotate body to waypoint
                        this.body.rotation -= drot;
                    }
                    if (this.body.rotation < -180) this.body.rotation += 360;		// don't overflow angles
                    else if (this.body.rotation > 180) this.body.rotation -= 360;
                }
            } else if (Math.abs(ddeg) <= 4) {
                if (this.velocity < atkSpeed) {
                    this.velocity += atkSpeed / 10;
                } else if (this.velocity > atkSpeed) {
                    this.velocity = atkSpeed;
                }
                this.shoot();
            }
        },
        shoot: function () {
            if (this.lastShot < Ticker.getTicks() - this.fireRate) {
                this.lastShot = Ticker.getTicks();
                var destdeg = Math.atan2(-(this.body.y - this.target.body.y), this.target.body.x - this.body.x) * 180 / Math.PI;
                var origin = new Object;
                origin.x = this.body.x;
                origin.y = this.body.y;
                var rand = Math.random() * 10 - 5;
                var accuracy = (1 - this.accuracy) * rand;
                var trajectory = this.body.rotation + accuracy;
                this.bullets.push(new BulletC(origin, trajectory, this.name));
            }
        },
        tick: function () {
            if (this.health < 1) {
                this.destroy();
                return 1;
            }
            if (this.status == "flying") {
                this.drawLineTo(this.tx, this.ty, "blue");
                this.flyTo();
            } else if (this.status == "attack") {
                // todo: be at flying until in range to attack (don't shoot when far away)
                this.drawLineTo(this.target.body.x, this.target.body.y, "red");
                this.attack(this.target);
            } else if (this.status == "idle") {
                this.idle();
            } else if (this.status == "capture") {
                this.drawLineTo(this.tx, this.ty, "red");
                this.capture(this.target);
            }
            track('velocity', this.velocity);
            track('status', this.status);
            track('target', this.target);

            if (this.velocity > 0) {			// move ship
                var dx = this.velocity * Math.cos(this.body.rotation * (Math.PI / 180));
                this.body.x += dx;
                var dy = this.velocity * Math.sin(this.body.rotation * (Math.PI / 180));
                this.body.y += dy;
                var id = this.id;
                if (typeof(this.selectElement) != "undefined") {
                    this.selectElement.x = this.body.x;
                    this.selectElement.y = this.body.y;
                }
                return 1;
            } else {
                return 0;
            }
        },
        drawLineTo: function (ltx, lty, color) {
            if ($.inArray(this.body.parentId, selector.selected) > -1) {
                var myGraphics = new Graphics();
                myGraphics.beginStroke(color).moveTo(this.body.x, this.body.y).lineTo(ltx, lty);
                var s = new Shape(myGraphics);
                selector.selCont.removeChild(this.lineTo);
                this.lineTo = s;
                selector.selCont.addChild(this.lineTo);
            }
        },
        destroy: function () {
            unitCont.removeChild(this.body);
            this.dead = 1;
            // todo: remove selector
            //this.selCont.removeChild(units[selector.selected[index]].selectElement);
            //selector.selected.splice(index);
        }

    });

    function handlShipClick(that) {
        if (that.nativeEvent.button == 0) {				// left click
            selector.selectUnits(this.parentId);
        } else if (that.nativeEvent.button == 2) {
            if (selector.selected.length && selector.selected[0] != this.parentId) {
                for (i in selector.selected) {
                    units[selector.selected[i]].attack(units[this.parentId], 1);
                }
            }
        }
    }

    var TriangleC = UnitC.extend({
        init: function (name) {
            this.body = new Bitmap(unitsSprite.getFrame(0).image);
            this.body.sourceRect = unitsSprite.getFrame(0).rect;
            this.name = name;
            this._super(false);
            this.fireRate = 15;
        }
    });
    var RepeaterC = UnitC.extend({
        init: function (name) {
            this.body = new Bitmap(unitsSprite.getFrame(1).image);
            this.body.sourceRect = unitsSprite.getFrame(1).rect;
            this.name = name;
            this._super(false);
            this.speed = 1.6;
            this.fireRate = 3;
            this.accuracy = 0.1;
        }
    });
    var DefenderC = UnitC.extend({
        init: function (name) {
            this.body = new Bitmap(unitsSprite.getFrame(2).image);
            this.body.sourceRect = unitsSprite.getFrame(2).rect;
            this.name = name;
            this._super(false);
            this.speed = 1;
            this.fireRate = 60;
        },
        attack: function (target, start) {
            if (start == 1) {
                this.status = "attack";
                this.target = target;
                this.lastShot = 0;
            }
            var atkSpeed = this.speed;

            var destdeg = Math.atan2(-(this.body.y - this.target.body.y), this.target.body.x - this.body.x) * 180 / Math.PI;
            var ddeg = angleDiff(this.body.rotation, destdeg);
            var distToTarget = distance(this.body.x, this.body.y, this.target.body.x, this.target.body.y);

            if (distToTarget > 80) {			// IF FAR AWAY, FLY TO TARGET
                if (ddeg > 4 || ddeg < -4) {								// if ship is too off course
                    var drot = 2 * this.velocity;								// turning speed is relative to speed
                    if (ddeg > 0) {
                        this.body.rotation += drot;						// turn right
                    } else {
                        this.body.rotation -= drot;						// turn left
                    }
                    if (this.body.rotation < -180) this.body.rotation += 360;		// don't overflow over 180+ and 180-
                    else if (this.body.rotation > 180) this.body.rotation -= 360;
                }
                if (this.velocity < this.speed) {
                    this.velocity += this.speed / 25;					// speed up to top speed over 25 frames
                }
            } else {				// YOU ARE IN THE VICINITY OF ENEMY
                if (this.velocity < atkSpeed) {
                    this.velocity += atkSpeed / 25;					// speed up to top speed over 25 frames
                }
                if (Math.abs(ddeg) > 95 || Math.abs(ddeg) < 85) {
                    var rand = Math.random();
                    var rotfric = this.speed / 1.5;
                    var drot = 5 * rotfric;
                    if (drot > 12) {
                        drot = 13;
                    }
                    if (ddeg > 90) {
                        this.body.rotation += drot;
                    } else {								// gradually rotate body to waypoint
                        this.body.rotation -= drot;
                    }
                    if (this.body.rotation < -180) this.body.rotation += 360;		// don't overflow angles
                    else if (this.body.rotation > 180) this.body.rotation -= 360;
                }

                if (distToTarget < 40 || distToTarget > 60) {
                    var rand = Math.random();
                    var rotfric = this.speed / 1.5;
                    var drot = 5 * rotfric;
                    if (drot > 12) {
                        drot = 13;
                    }
                    if (distToTarget > 50) {
                        this.body.rotation += drot;
                    } else {								// gradually rotate body to waypoint
                        this.body.rotation -= drot;
                    }
                    if (this.body.rotation < -180) this.body.rotation += 360;		// don't overflow angles
                    else if (this.body.rotation > 180) this.body.rotation -= 360;
                }
                if (distToTarget > 20 && distToTarget < 90) {
                    this.shoot();
                }
            }
        },
        shoot: function () {
            // TODO: aim to where the unit will be not where it is now, because you miss alot
            if (this.lastShot < Ticker.getTicks() - this.fireRate) {
                this.lastShot = Ticker.getTicks();
                var destdeg = Math.atan2(-(this.body.y - this.target.body.y), this.target.body.x - this.body.x) * 180 / Math.PI;
                var origin = new Object;
                origin.x = this.body.x;
                origin.y = this.body.y;
                var rand = Math.random() * 10 - 5;
                var accuracy = (1 - this.accuracy) * rand;
                var trajectory = destdeg + accuracy;
                this.bullets.push(new BulletC(origin, trajectory, this.name));
            }
        }
    });

    window.TriangleC = TriangleC;
    window.RepeaterC = RepeaterC;
    window.DefenderC = DefenderC;
})(window);

function unitExists(name) {
    for (i in units) {
        if (units[i].name == name && !units[i].dead) {
            return units[i];
        }
    }
    return 0;
}

(function (window) {
    var selImg = new Image();
    selImg.src = "images/selection.png";

    var selector = {
        selected: new Array,
        selCont: new Container(canvas),
        remove: function (index) {
            this.selCont.removeChild(units[selector.selected[index]].selectElement);
            this.selCont.removeChild(units[selector.selected[index]].lineTo);
            delete(units[selector.selected[index]].selectElement);
            selector.selected.splice(index);
        },
        add: function (index) {
            var el = new Bitmap(selImg);
            el.regX = 10;
            el.regY = 10;
            el.x = units[index].body.x;
            el.y = units[index].body.y;
            j = $.inArray(index, selector.selected);
            if (j > -1) {
                selector.remove(j);
            }
            units[index].selectElement = el;
            selector.selected.push(index);
            this.selCont.addChild(el);
        },
        selectUnits: function (index, x1, x2, y1, y2) {
            while (selector.selected.length) {
                selector.remove(selector.selected.length - 1);
            }
            if (index > -1) {
                selector.add(index);
            } else {
                if (index != -2) {
                    for (i in units) {
                        if (!units[i].dead) {
                            if ((x1 < x2 ? units[i].body.x >= x1 && units[i].body.x <= x2 : units[i].body.x >= x2 && units[i].body.x <= x1) && (y1 < y2 ? units[i].body.y >= y1 && units[i].body.y <= y2 : units[i].body.y >= y2 && units[i].body.y <= y1)) {
                                selector.add(parseInt(i));
                            }
                        }
                    }
                }
            }
        }
    }

    window.selector = selector;
})(window);