// JavaScript Document
window.onload = start;
var canvas = document.getElementById('main_canvas');

var units = new Array;
var bullets = new Array;
var stage;
var map= new Object;

function start(){
	stage = new createjs.Stage(canvas);

	setTimeout(function(){
		stage.addChild(map.mapCont);				
		stage.addChild(selector.selCont);		
		stage.addChild(unitCont);
		stage.addChild(bulletCont);
	}, 300);

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setFPS(40);
	
	new TriangleC("Rodik");
	new TriangleC("Bunny");
	new RepeaterC("Tom");
	new DefenderC("Bob");
}
function handleTick(){
	var update= 0;
	for (i in units){
		if(units[i].tick()){
			update = 1;
		}
	}
	for (i in bullets){
		if(bullets[i].tick()){
			update = 1;
		}
	}
	track("fps", createjs.Ticker.getMeasuredFPS());
	if (update){
		stage.update();
	}
}

function track(who, what){
	if($('.console .val_'+who).length == 0){
		$('.console').append('<div class="val_'+who+'"><span class="title">'+who+': </span> <span class="val"></span></div>');
	}
	$('.console .val_'+who+' .val').text(what);
}
function angleDiff(firstAngle, secondAngle){
	var difference = secondAngle - firstAngle;
	if (difference < -180) difference += 360;
	else if (difference > 180) difference -= 360;
	return difference;
}
function distance( x1,y1, x2,y2 )
{
	var xs = 0;
	var ys = 0;
	xs = x2 - x1;
	xs = xs * xs;
	ys = y2 -y1;
	ys = ys * ys;
	return Math.sqrt( xs + ys );
}