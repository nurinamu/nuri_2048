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
		this.doc = doc_.document;
		console.log("init");
		this.blocks = [];
		this.gameCanvas = this.doc.getElementById('game_canvas');
		// this.gameCanvas.onclick = function(){
		// 		if(newGame.isLive()){
		// 			newGame.stop();	
		// 		}else{
		// 			newGame.run();
		// 		}
		// 	}
		this.ctx = this.gameCanvas.getContext('2d');
		console.log(this.ctx);
		
		this.doc.body.onkeydown = function(evt){
			createNewBlock();	
			move(evt.keyCode);
		};
	})();

	function createNewBlock(){
		var newBlock = new Block();
		console.log(this.blocks);
		for(var i in this.blocks){
			if(this.blocks[i].x_grid == newBlock.x_grid
				&& this.blocks[i].y_grid == newBlock.y_grid){
				return;
			}
		}

		this.blocks.push(newBlock);
		
	}

	GameThread.prototype.run = function(){
		console.log(this.ctx);
		console.log("run");
		this.timer = setInterval(this.loop, 1000/24);	
		
		this.isLiveFlag = true;
	};

	GameThread.prototype.loop = function(){
		console.log("test "+this.blocks.length);
		this.ctx.clearRect(0,0,400,400);
		for(i in this.blocks){
			console.log('draw rect! - '+this.blocks[i].width)
			this.blocks[i].move();
			this.ctx.rect(
				this.blocks[i].x_cur_pos,
				this.blocks[i].y_cur_pos,
				this.blocks[i].width,
				this.blocks[i].height
				)
			this.ctx.stroke();
			if(!this.blocks[i].isMoving){
				this.stop();
			}
		}
	};

	GameThread.prototype.stop = function(){
		console.log("stop");
		clearInterval(this.timer);
		this.isLiveFlag = false;
	};

	GameThread.prototype.isLive = function(){
		return this.isLiveFlag;
	};

	function move(evt){
		console.log(evt);
		switch(evt){
			case 37:
				console.log(this.blocks);
				for(i in this.blocks){
					this.blocks[0].x_grid = 3;
				}
			break;
		}
		newGame.run();		
	}
};

Block = function(){
	this.width = 20;
	this.height = 20;
	this.x_grid = 0;
	this.y_grid = 0;
	this.x_cur_pos = 0;
	this.y_cur_pos = 0;
	this.isMoving = false;
	this.value = 2;

	Block.prototype.move = function(){
		console.log("move!");
		if(this.x_grid*this.width > this.x_cur_pos){
			this.isMoving = true;
			this.x_cur_pos += 1;	
			console.log("x : "+this.x_cur_pos);
		}else{
			this.isMoving = false;
		}
	}
};
