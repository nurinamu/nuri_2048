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
		blocks = [];
		gameCanvas = doc.getElementById('game_canvas');
		ctx = gameCanvas.getContext('2d');
		
		doc.body.onkeydown = function(evt){
			createNewBlock();	
			move(evt.keyCode);
		};
	})();

	function createNewBlock(){
		var newBlock = new Block();
		for(var i in blocks){
			if(blocks[i].x_grid == newBlock.x_grid
				&& blocks[i].y_grid == newBlock.y_grid){
				return;
			}
		}

		blocks.push(newBlock);
		
	}

	function run(){
		console.log("inside run");
		if(timer === undefined){
			timer = setInterval(loop, 1000/100);	
		
			isLiveFlag = true;

			for(i in blocks){
				blocks[i].move();
			}
		}else{
			console.log("thread is already started.");
		}
		
	}

	

	function loop(){
		clear();
		ctx.beginPath();
		for(i in blocks){
			blocks[i].move();
			ctx.rect(
				blocks[i].xCurPos(),
				blocks[i].yCurPos(),
				blocks[i].width(),
				blocks[i].height()
				)
			ctx.stroke();
			if(!blocks[i].isMoving()){
				stop();
			}
		}
		ctx.closePath();
	};

	function stop(){
		console.log("stop");
		clearInterval(timer);
		timer = undefined;
		isLiveFlag = false;
	}

	function clear(){
		ctx.clearRect(0,0,400,400);
	}

	function move(evt){
		switch(evt){
			case 37:
				for(i in blocks){
					blocks[i].xGrid(3);
				}
			break;
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
	var width = 20;
	var height = 20;
	var x_grid = 0;
	var y_grid = 0;
	var x_cur_pos = 0;
	var y_cur_pos = 0;
	var isMoving = false;
	var value = 2;

	Block.prototype.move = function(){
		x_cur_pos += 1;	
	}

	Block.prototype.xGrid = function(v){
		if(isNaN(v)){
			return x_grid;
		}else{
			x_grid = v;
		}
	}

	Block.prototype.xCurPos = function(v){
		if(isNaN(v)){
			return x_cur_pos;	
		}else{
			x_cur_pos = v;
		}
		
	}

	Block.prototype.yCurPos = function(v){
		if(isNaN(v)){
			return y_cur_pos;	
		}else{
			y_cur_pos = v;
		}
	}

	Block.prototype.width = function(v){
		if(isNaN(v)){
			return width;	
		}else{
			width = v;
		}
	}

	Block.prototype.height = function(v){
		if(isNaN(v)){
			return height;	
		}else{
			height = v;
		}
	}

	Block.prototype.isMoving = function(v){
		return (x_grid*width > x_cur_pos);
	}
};
