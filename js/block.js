var colorIdx = Math.floor(Math.random()*4);

ColorTable = [
	['FCE4EC', 'F8BBD0', 'F48FB1', 'F06292', 'EC407A', 'E91E63', 'D81B60', 'C2185B', 'AD1457', '880E4F'],		//Pink
	['E1F5FE', 'B3E5FC', '81D4FA', '4FC3F7', '29B6F6', '03A9F4', '039BE5', '0288D1', '0277BD', '01579B'], 	//LightBlue
	['FFF8E1', 'FFECB3', 'FFE082', 'FFD54F', 'FFCA28', 'FFC107', 'FFB300', 'FFA000', 'FF8F00', 'FF6F00'],		//Amber
	['E0F2F1', 'B2DFDB', '80CBC4', '4DB6AC', '26A69A', '009688', '00897B', '00796B', '00695C', '004D40']		//Teal
];

Block = function(){
	this._value = 2;
	this._pos = 0;

	this._width = 120;
	this._height = 120;
	this._x_cur_pos = 0;
	this._y_cur_pos = 0;
	this._isMoving = false;
	
	this._aging = 0.1;
	this._live = true;
};

Block.prototype = {
	fillColor : function(){
		return "#"+ColorTable[colorIdx][Math.log(this._value)/Math.LN2-1];
	},
	pos : function(v){
		if(v){
			//console.log(this._pos+"==>"+v);
			this._pos = v;
			this.xCurPos(this.xGrid()*this._width);
			this.yCurPos(this.yGrid()*this._height);
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
		this.xCurPos(this.xGrid()*this._width);
		this.yCurPos(this.yGrid()*this._height);
		this._pos = v;
	},
	move : function(){
		if(Math.abs((this.xGrid()*this._width)-this._x_cur_pos) < 2){
			this.xCurPos(this.xGrid()*this._width);
		}else{
			if(isOn('cb_tween')){
				this.xCurPos(this._x_cur_pos + this._aging*((this.xGrid()*this._width)-this._x_cur_pos));		
			}else{
				if(((this.xGrid()*this._width)-this._x_cur_pos) > 0){
					this.xCurPos(this._x_cur_pos + 4);
				}else{
					this.xCurPos(this._x_cur_pos - 4);
				}
			}
			
		}
		if(Math.abs((this.yGrid()*this._height)-this._y_cur_pos) < 2){
			this.yCurPos((this.yGrid()*this._height));
		}else{
			if(isOn('cb_tween')){
				this.yCurPos(this._y_cur_pos + this._aging*((this.yGrid()*this._height)-this._y_cur_pos));	
			}else{
				if(((this.yGrid()*this._height)-this._y_cur_pos) > 0){
					this.yCurPos(this._y_cur_pos + 4);
				}else{
					this.yCurPos(this._y_cur_pos - 4);
				}
			}
		}
	},
	xGrid : function(){
		return this._pos % gameGrid;
	},
	yGrid : function(v){
		return Math.floor(this._pos/gameGrid);
	},
	xCurPos : function(v){
		if( v != undefined ){
			if(isNaN(v)){
				throw "["+v+"] is not a number!";
			}else{
				this._x_cur_pos = v;	
			}
		}else{
			return this._x_cur_pos;	
		}
		
	},
	yCurPos : function(v){
		if( v != undefined ){
			if(isNaN(v)){
				throw "["+v+"] is not a number!";
			}else{
				this._y_cur_pos = v;	
			}
		}else{
			return this._y_cur_pos;	
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
		return (this.xGrid()*this._width != this._x_cur_pos) || (this.yGrid()*this._height != this._y_cur_pos);
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