(function(window){
	map.cells = new Array;
	
	var bg = new Image();
	bg.src = "images/bg.jpg";
	bg.onload = function(){
		var world = new createjs.Bitmap(bg);
		world.onClick = handleWorldClick;
		world.onPress = handleWorldPress;		
		map.mapCont.addChildAt(world,0);
	}		
	
	var cellImg = new Image();
	cellImg.src = "images/cell.png";
	cellImg.onload = function(){


//		new CellC(300,200);
//		new CellC(500,200);
//		new CellC(400,300);
//		new CellC(400,100);
	}
	
	map.mapCont = new createjs.Container(canvas);
	var CellC = Class.extend({
		init: function(x,y){
			this.body = new createjs.Bitmap(cellImg);

			this.body.x = x;
			this.body.y = y;
			this.body.rotation = 0;
			this.body.regX = 90;
			this.body.regY = 90;				
			
			this.body.onClick = onCellClick;
			this.body.onPress = handleWorldPress;

			this.loyalty = 0;
			this.owner = 0;
			
			this.label = new Text(this.owner.toString(), "20px Arial", "orange");
			this.label.textAlign = "center";
			this.label.x = x;
			this.label.y = y;
			
			map.mapCont.addChild(this.body);
			map.mapCont.addChild(this.label);			
			
			this.body.parentId = map.cells.push(this)-1;
		},
		changeOwner: function(who){
			this.owner = who;
			this.label.text = who;
			if (who == "0"){
				var tint = new ColorFilter(0.2,0.2,0.2,1); // (red, green, blue, alpha)
			}else if (who == "1"){
				var tint = new ColorFilter(0.2,0.2,0.6,1); // (red, green, blue, alpha)
			}
			this.body.cache(0, 0, 180 , 180);
			this.body.filters = [tint];
			this.body.updateCache();
		}
	});	
	function onCellClick(e){
		if(e.nativeEvent.button == 2 && selector.selected.length){
			if(map.cells[this.parentId].owner != 1){
				for(i in selector.selected){
					units[selector.selected[i]].capture(map.cells[this.parentId],1);
				}
			}else{
				for(i in selector.selected){
					units[selector.selected[i]].flyTo(this.x,this.y,1);
				}				
			}
		}
	}
	function handleWorldClick(that){
		if(that.nativeEvent.button == 0){				// left click
			if(typeof(selector.unbindClick)=="undefined" || selector.unbindClick == 0)
			if (selector.selected.length > 0){			
				selector.selectUnits(-2);
			}
		}else if(that.nativeEvent.button == 2){		// right click
			if (selector.selected.length > 0){
				for (i in selector.selected){
					units[selector.selected[i]].flyTo(that.stageX,that.stageY, 1);
				}			
			}		
		}
	}
	function handleWorldPress(pressEvent){
		if(pressEvent.nativeEvent.button == 0){
			selector.sx = pressEvent.stageX;
			selector.sy = pressEvent.stageY;
			
			pressEvent.onMouseMove = function(moveEvent){	
				selector.selCont.removeChild(selector.shape);
				var g = new Graphics();
				g.setStrokeStyle(1);
				g.beginStroke(Graphics.getRGB(255,255,255));
				g.beginFill(Graphics.getRGB(255,0,0,0.25));
				g.drawRect(0,0,moveEvent.stageX - selector.sx,moveEvent.stageY - selector.sy);
				selector.shape = new Shape(g);
				selector.shape.x = selector.sx;
				selector.shape.y = selector.sy;
				selector.selCont.addChild(selector.shape);		
			}
			pressEvent.onMouseUp = function(upEvent){		
				selector.selectUnits(-1,selector.sx,upEvent.stageX,selector.sy,upEvent.stageY); 
				selector.selCont.removeChild(selector.shape);
				selector.unbindClick = 1;
				return;
			}
		}
	}

	window.CellC = CellC;	
})(window);