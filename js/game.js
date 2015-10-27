var newGame;

var gameGrid = 4;

function main(){
	
	newGame = new GameThread(window);
	
	

	
	// newGame.run();
}

GameThread = function(doc_){

	var timer;
	var isLiveFlag = false;

	var blocks;

	var doc;
	var gameCanvas;
	var ctx;

	(function(){
		doc = doc_.document;
		console.log("init");
		blocks = {};
		gameCanvas = doc.getElementById('game_canvas');
		ctx = gameCanvas.getContext('2d');

		//initial block
		createNewBlock();
		drawCanvas();
		
		doc.body.onkeydown = function(evt){
			move(evt.keyCode);
		};
	})();

	function createNewBlock(){
		if(Object.keys(blocks).length >= gameGrid*gameGrid){
			console.log("game is end!");
			return;
		}

		var newPos = randomNum(gameGrid*gameGrid);
		if(blocks[newPos]){
			console.log("skip");
			return;
		}
		var newBlock = new Block();
		setPos(newBlock, newPos);
	}

	function setPos(block, newPos){
		block.pos(newPos);
		blocks[newPos] = block;
		console.log("created["+(Object.keys(blocks).length)+"] : "+block.pos());
	}

	function randomNum(max){
		return Math.floor(Math.random()*max)%max;
	}

	function run(){
		console.log("inside run");
		if(!isLiveFlag && timer === undefined){
			timer = setInterval(loop, 1000/100);	
		
			isLiveFlag = true;

			for(var i in blocks){
				if(blocks != null){
					blocks[i].move();	
				}
			}
		}else{
			console.log("thread is already started.");
		}
		
	}

	

	function loop(){
		clear();

		if(!drawCanvas()){
			stop();
		}
		
	};

	function drawCanvas(){
		var isMoving = false;
		for(var i in blocks){
			if(!blocks[i]){
				continue;
			}
			// console.log("["+blocks[i].pos()+"]isMoving["+i+"]"+blocks[i].isMoving());
			if(blocks[i].isMoving()){
				isMoving = true;
			}

			blocks[i].move();
			ctx.beginPath();
			ctx.rect(
				blocks[i].xCurPos(),
				blocks[i].yCurPos(),
				blocks[i].width(),
				blocks[i].height()
				)
			ctx.stroke();
			ctx.closePath();
			ctx.font="40px dotum";
			ctx.fillText(blocks[i].number(), blocks[i].xCurPos()+(blocks[i].width()/2)-10, blocks[i].yCurPos()+(blocks[i].height()/2)+15);
		}
		return isMoving;
	}

	function stop(){
		console.log("stop");
		clearInterval(timer);
		timer = undefined;
		isLiveFlag = false;

		createNewBlock();

		for(var i in blocks){
			if(!blocks[i].isLive()){
				delete blocks[i];
			}
		}

		drawCanvas();
	}


	function clear(){
		ctx.clearRect(0,0,600,600);
	}

	function mergeOrMove(blocks, oldPos, newPos, altPos){
		if(oldPos != newPos){
			if(blocks[newPos]){//block이 목표점에 있는 경우
				if(blocks[newPos].value() == blocks[oldPos].value()){//머지?
					blocks[newPos].isLive(false);
					blocks[newPos].value(blocks[newPos].value()*2);
					blocks[oldPos].value(blocks[oldPos].value()*2);
					blocks[newPos+'_d'] = blocks[newPos];
				}else{//alt
					if(altPos != undefined && !isNaN(altPos)){
						//alt가 이전 값이랑 동일하면 do nothing!
						if(altPos == oldPos) return;
						newPos = altPos;	
					}
				}
			}else{	//block이 목표점에 없는 경우

			}
			

			blocks[newPos] = blocks[oldPos];
			delete blocks[oldPos];
			blocks[newPos].moveTo(newPos);	
		}
	}

	function move(keyCode){
		console.log(keyCode);
		switch(keyCode){
			case 37 : //to left
				mergeToLeft();		
			break;	
			case 38 : //to top
				mergeToTop();
			break;
			case 39 : //to right
				mergeToRight();
			break;
			case 40: //to down
				mergeToBottom();
			break;
			default :
			break;
		}
	}

	function mergeToLeft(){
		for(var x=1;x<gameGrid;x++){
			for(var y=0;y<gameGrid;y++){
				if(blocks[y*gameGrid+x]){
					var dest = x;
					var alt;
					for(var z=x-1;z>=0;z--){
						if(blocks[y*gameGrid+z]){
							alt = dest;
							dest = z;
							break;
						}else{
							dest = z;
						}
					}
					
					var i = y*gameGrid+dest;
					mergeOrMove(blocks, y*gameGrid+x, i, y*gameGrid+alt);	
				}
				
			}
		}

		run();
	}

	function mergeToTop(){
		for(var y=1;y<gameGrid;y++){
			for(var x=0;x<gameGrid;x++){
				if(blocks[y*gameGrid+x]){
					var dest = y;
					var alt;
					for(var z=y-1;z>=0;z--){
						if(blocks[z*gameGrid+x]){
							alt = dest;
							dest = z;
							break;
						}else{
							dest = z;
						}
					}
					
					var i = dest*gameGrid + x;
					mergeOrMove(blocks, y*gameGrid+x, i, alt*gameGrid + x);	
				}
				
			}
		}

		run();

	}

	function mergeToRight(){
		for(var x=gameGrid-2;x>=0;x--){
			for(var y=0;y<gameGrid;y++){
				if(blocks[y*gameGrid+x]){
					var dest = x;
					var alt;
					for(var z=x+1;z<gameGrid;z++){
						if(blocks[y*gameGrid+z]){
							alt = dest;
							dest = z;
							break;
						}else{
							dest = z;
						}
					}
					
					var i = y*gameGrid+dest;
					mergeOrMove(blocks, y*gameGrid+x, i, y*gameGrid+alt);	
				}
				
			}
		}

		run();
	}

	function mergeToBottom(){
		for(var y=gameGrid-2;y>=0;y--){
			for(var x=0;x<gameGrid;x++){
				if(blocks[y*gameGrid+x]){
					var dest = y;
					var alt;
					for(var z=y+1;z<gameGrid;z++){
						if(blocks[z*gameGrid+x]){
							alt = dest;
							dest = z;
							break;
						}else{
							dest = z;
						}
					}
					
					var i = dest*gameGrid + x;
					mergeOrMove(blocks, y*gameGrid+x, i, alt*gameGrid + x);	
				}
				
			}
		}

		run();
	}

	GameThread.prototype.run = function(){
		run();
	};

	GameThread.prototype.stop = function(){
		stop();
	};

	GameThread.prototype.isLive = function(){
		return isLiveFlag;
	};

	GameThread.prototype.clear = function(){
		clear();
	}
};

Block = function(){
	this._value = 2;
	this._pos = 0;

	this._width = 120;
	this._height = 120;
	this._x_cur_pos = 0;
	this._y_cur_pos = 0;
	this._isMoving = false;
	
	this._x_grid;
	this._y_grid;

	this._aging = 0.1;
	this._live = true;
};

Block.prototype = {
	pos : function(v){
		if(v){
			console.log(this._pos+"==>"+v);
			this._pos = v;
			this._x_grid = this._pos % gameGrid;
			this._y_grid = Math.floor(this._pos/gameGrid);
			this._x_cur_pos = this._x_grid*this._width;
			this._y_cur_pos = this._y_grid*this._height;
		}else{
			return this._pos;
		}
	},
	number :  function(v){
		if(v){
			this._value = v;
			return;
		}
		return this._value;
	},
	moveTo : function(v){
		if(v >= gameGrid*gameGrid){
			console.log("error!");
			return;
		}
		console.log("moveTo : "+v);
		this._x_cur_pos = this._x_grid*this._width;
		this._y_cur_pos = this._y_grid*this._height;
		this._pos = v;
		this._x_grid = this._pos % gameGrid;
		this._y_grid = Math.floor(this._pos/gameGrid);
	},
	move : function(){
		if(Math.abs((this._x_grid*this._width)-this._x_cur_pos) < 2){
			this._x_cur_pos = (this._x_grid*this._width);
		}else{
			this._x_cur_pos = this._x_cur_pos + this._aging*((this._x_grid*this._width)-this._x_cur_pos);		
		}
		if(Math.abs((this._y_grid*this._height)-this._y_cur_pos) < 2){
			this._y_cur_pos = (this._y_grid*this._height);
		}else{
			this._y_cur_pos = this._y_cur_pos + this._aging*((this._y_grid*this._height)-this._y_cur_pos);		
		}
	},
	xGrid : function(v){
		if(isNaN(v)){
			return this._x_grid;
		}else{
			this._x_grid = v;
		}
	},
	yGrid : function(v){
		if(isNaN(v)){
			return this._y_grid;
		}else{
			this._y_grid = v;
		}
	},
	xCurPos : function(v){
		if(isNaN(v)){
			return this._x_cur_pos;	
		}else{
			this._x_cur_pos = v;
		}
		
	},
	yCurPos : function(v){
		if(isNaN(v)){
			return this._y_cur_pos;	
		}else{
			this._y_cur_pos = v;
		}
	},
	width : function(v){
		if(isNaN(v)){
			return this._width;	
		}else{
			this._width = v;
		}
	},
	height : function(v){
		if(isNaN(v)){
			return this._height;	
		}else{
			this._height = v;
		}
	},
	isMoving : function(v){
		return (this._x_grid*this._width != this._x_cur_pos) || (this._y_grid*this._height != this._y_cur_pos);
	},
	isLive : function(v){
		if(v != undefined){
			this._live = v;
		}else{
			return this._live;
		}
	},
	value : function(v){
		if(v){
			this._value = v;
		}else{
			return this._value;
		}
	}


}


















