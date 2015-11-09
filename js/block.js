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
			//console.log(this._pos+"==>"+v);
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
		// console.log("moveTo : "+v);
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