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

		//initial block
		createNewBlock();
		loop();
		
		doc.body.onkeydown = function(evt){
			move(evt.keyCode);
		};
	})();

	function createNewBlock(){
		var newBlock = new Block();
		newBlock.pos(0);
		for(var i in blocks){
			if(blocks[i].xGrid() == newBlock.xGrid()
				&& blocks[i].yGrid() == newBlock.yGrid()){
				return;
			}
		}
		blocks.push(newBlock);
		
	}

	function run(){
		console.log("inside run");
		if(!isLiveFlag && timer === undefined){
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

		var isMoving = false;
		
		for(i in blocks){
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
	var value = 2;
	var pos = 0;

	var width = 120;
	var height = 120;
	var x_cur_pos = 0;
	var y_cur_pos = 0;
	var isMoving = false;
	
	var x_grid;
	var y_grid = Math.floor(pos/gameGrid);

	var aging = 0.1;

	Block.prototype.pos = function(v){
		if(v){
			pos = v;
			x_grid = pos % gameGrid;
			y_grid = Math.floor(pos/gameGrid);
		}else{
			return pos;
		}
	}

	Block.prototype.number = function(v){
		if(v){
			value = v;
			return;
		}
		return value;
	}

	Block.prototype.move = function(){
		if(Math.abs((x_grid*width)-x_cur_pos) < 2){
			x_cur_pos = (x_grid*width);
		}else{
			x_cur_pos = x_cur_pos + aging*((x_grid*width)-x_cur_pos);		
		}
	}

	Block.prototype.xGrid = function(v){
		if(isNaN(v)){
			return x_grid;
		}else{
			x_grid = v;
		}
	}

	Block.prototype.yGrid = function(v){
		if(isNaN(v)){
			return y_grid;
		}else{
			y_grid = v;
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
