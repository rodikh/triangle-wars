(function(window){
	var bulletImg = new Image();
	bulletImg.src = "images/bullet.png";

	bulletCont = new Container(canvas);
	var BulletC = Class.extend({
		init: function(shooter, trajectory, shooterId){
			this.body = new Bitmap(bulletImg);
			this.body.x = shooter.x;
			this.body.y = shooter.y;
			this.body.rotation = trajectory;
			this.body.regX = 2;
			this.body.regY = 2;
			this.originX = shooter.x;
			this.originY = shooter.y;
			this.velocity = 4;
			this.trajectory = trajectory;
			this.status = "shooting";

			bulletCont.addChild(this.body);
			this.shooter = shooter;
			this.shooterId = shooterId;
			this.body.parentId = bullets.push(this)-1;

		},
		tick: function(){
			var dx = this.velocity * Math.cos(this.trajectory * (Math.PI/180));
			this.body.x += dx;
			var dy = this.velocity * Math.sin(this.trajectory * (Math.PI/180));
			this.body.y += dy;
			if (distance(this.body.x,this.body.y,this.originX,this.originY)> 200){
				this.destroy();
			}
			bullet_collisionDetector(this);
			return true;
		},
		destroy: function(){
			bulletCont.removeChild(this.body);
			delete(bullets[this.body.parentId]);
		}
	});
	function bullet_collisionDetector(bullet){
		for(i in units){
			var unit = units[i];
			if(unit.name != bullet.shooterId && !unit.dead){
				if (distance(unit.body.x,unit.body.y,bullet.body.x,bullet.body.y)<5){
						// TODO: also check if owner is same as shooter's owner.
					bullet.destroy();
					unit.health--;
					break;
				}
			}
		}
	}

	window.BulletC = BulletC;
})(window);