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
	var gameCtx;
	var pointCanvas;
	var pointCtx;
	var _hasMoving;

	var _curPoint = 0;

	(function(){
		doc = doc_.document;
		console.log("init");
		blocks = {};

		initCtx();
		initAudio();

		//initial block
		createNewBlock();
		drawCanvas();
		
		doc.body.onkeydown = function(evt){
			move(evt.keyCode);
		};
	})();

	function initCtx(){
		gameCanvas = doc.getElementById('game_canvas');
		gameCtx = gameCanvas.getContext('2d');

		pointCanvas = doc.getElementById('point_canvas');
		pointCtx = pointCanvas.getContext('2d');
	}

	var audioCtx;
	var audioList;

	function initAudio(){
		try {
			// Fix up for prefixing
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			audioCtx = new AudioContext();

			var bufLoader = new BufferLoader(
				audioCtx,
				['/audio/bgm/bgm1.wav', 
				'/audio/effects/nothing.mp3',
				'/audio/effects/merge.mp3'],
				function(audioList_){
					audioList = audioList_;
					console.log('audio is ready!');
					playBgm();
				}
			);
			bufLoader.load();
		} catch(e) {
			console.log(e);
			//alert('Web Audio API is not supported in this browser');
		}
	}

	function playSound(idx){
		if(audioCtx){
			var soundBuffer = audioCtx.createBufferSource();
			soundBuffer.buffer = audioList[idx];
			soundBuffer.connect(audioCtx.destination);
			if(soundBuffer){
				soundBuffer.start(0);
			}else{
				console.error('failed to play the sound.');
			}	
		}
		
	}

	function playBgm(){
		if(audioCtx){
			var soundBuffer = audioCtx.createBufferSource();
			soundBuffer.buffer = audioList[0];
			soundBuffer.connect(audioCtx.destination);
			soundBuffer.loop = true;
			if(soundBuffer){
				soundBuffer.start(0);
			}else{
				console.error('failed to play the sound.');
			}	
		}
	}

	function createNewBlock(){
		console.log("createNewBlock!");
		if(Object.keys(blocks).length >= gameGrid*gameGrid){
			console.log("game is end!");
			return;
		}

		var newPos = randomNum(gameGrid*gameGrid);
		if(blocks[newPos]){
			return createNewBlock();
		}
		var newBlock = new Block();
		setPos(newBlock, newPos);
	}

	function setPos(block, newPos){
		block.pos(newPos);
		blocks[newPos] = block;
		//console.log("created["+(Object.keys(blocks).length)+"] : "+block.pos());
	}

	function randomNum(max){
		return Math.floor(Math.random()*max)%max;
	}

	function run(){
		//console.log("inside run");
		if(!isLiveFlag && timer === undefined){
			timer = setInterval(loop, 1000/100);	
		
			isLiveFlag = true;

			for(var i in blocks){
				if(blocks != null){
					blocks[i].move();	
				}
			}
			hasMoving(false);
		}else{
			console.log("thread is already started.");
		}
		
	}

	function loop(){
		clear();

		if(!drawCanvas()){
			stop();
			drawPoint();
		}
		
	};

	function point(v){
		if(v === undefined){
			return _curPoint;
		}else{
			_curPoint += v;
		}
	}

	function drawPoint(){
		clearPoint();
		pointCtx.font="20px dotum";
		pointCtx.fillText(point(), 5,30);
	}

	function drawCanvas(){
		var isMoving = false;
		for(var i in blocks){
			if(!blocks[i]){
				continue;
			}
			// console.log("["+blocks[i].pos()+"]isMoving["+i+"]"+blocks[i].isMoving());
			if(blocks[i].isMoving()){
				isMoving = true;
				hasMoving(true);
			}

			blocks[i].move();
			gameCtx.beginPath();
			gameCtx.rect(
				blocks[i].xCurPos(),
				blocks[i].yCurPos(),
				blocks[i].width(),
				blocks[i].height()
				)
			gameCtx.stroke();
			gameCtx.closePath();
			gameCtx.font="40px dotum";
			gameCtx.fillText(blocks[i].number(), blocks[i].xCurPos()+(blocks[i].width()/2)-10, blocks[i].yCurPos()+(blocks[i].height()/2)+15);
		}
		return isMoving;
	}

	function hasMoving(v){
		if(v === undefined){
			return _hasMoving;
		}else{
			_hasMoving = v;
		}
	}

	function stop(){
		//console.log("stop");
		clearInterval(timer);
		timer = undefined;
		isLiveFlag = false;

		//createNewBlock();
		var isMerged = false;
		for(var i in blocks){
			if(!blocks[i].isLive()){
				delete blocks[i];
				isMerged = true;
			}
		}
		if(isMerged){
			playSound(2);
		}else{
			playSound(1);
		}

		//움직임이 하나도 없는 상태에서는 블럭이 생성되서는 안된다.
		// console.log("hasMoving? : "+hasMoving());
		if(hasMoving()) {
			createNewBlock();
		}

		drawCanvas();
	}


	function clear(){
		gameCtx.clearRect(0,0,600,600);
	}
	function clearPoint(){
		pointCtx.clearRect(0,0,200,100);
	}

	function mergeOrMove(blocks, oldPos, newPos, altPos){
		var isMerged = false;
		if(oldPos != newPos){
			if(blocks[newPos]){//block이 목표점에 있는 경우
				if(blocks[newPos].value() == blocks[oldPos].value()){//머지?
					blocks[newPos].isLive(false);
					blocks[newPos].value(blocks[newPos].value()*2);
					blocks[oldPos].value(blocks[oldPos].value()*2);
					blocks[newPos+'_d'] = blocks[newPos];
					isMerged = true;
					point(blocks[oldPos].value());
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

		return isMerged;
	}

	function move(keyCode){
		// console.log(keyCode);
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


















