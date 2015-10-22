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
		blocks = new Array();
		gameCanvas = doc.getElementById('game_canvas');
		ctx = gameCanvas.getContext('2d');

		//initial block
		createNewBlock();
		loop();
		
		doc.body.onkeydown = function(evt){
			move(evt.keyCode);
		};
	})();

	function createNewBlock(){
		if(blocks.length >= gameGrid*gameGrid){
			console.log("game is end!");
			return;
		}

		var newBlock = new Block();
		newBlock.pos(randomNum(gameGrid*gameGrid));
		for(var i in blocks){
			if(blocks[i].pos() == newBlock.pos()){
				console.log("skip");
				return;
			}
		}
		console.log("created["+blocks.length+"] : "+newBlock.pos());
		blocks.push(newBlock);
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
				blocks[i].move();
			}
		}else{
			console.log("thread is already started.");
		}
		
	}

	

	function loop(){
		clear();

		var isMoving = false;
		
		for(var i in blocks){
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
			ctx.fillText(blocks[i].number(), blocks[i].xCurPos()+(blocks[i].width()/2), blocks[i].yCurPos()+(blocks[i].height()/2));
		}

		if(!isMoving){
			stop();
		}
		
	};

	function stop(){
		console.log("stop");
		clearInterval(timer);
		timer = undefined;
		isLiveFlag = false;

		createNewBlock();
	}

	function clear(){
		ctx.clearRect(0,0,600,600);
	}

	function move(keyCode){
		console.log(keyCode);
		switch(keyCode){
			case 37 : //to left
				for(var i in blocks){
					var curPos = blocks[i].pos();
					blocks[i].moveTo(curPos - (curPos%gameGrid));
				}
				run();		
			break;	
			case 39 : //to right
				for(var i in blocks){
					var curPos = blocks[i].pos();
					blocks[i].moveTo(curPos + (gameGrid - 1) - (curPos%gameGrid));
				}
				run();		
			break;
		}
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
		return (this._x_grid*this._width != this._x_cur_pos);
	}


}


















