// JavaScript Document
window.onload = function(){
	start();
	
}
function start(){
	var score = document.getElementsByClassName('score');
	score.innerText =0;
	var hint = document.getElementsByClassName('hint')[0];
	hint.style.cssText = "visibility:hidden";
	
	var box = new Box(0,8,17,17);
	
	clearInterval(Box.timer);
	
	box.initGameGround();
	box.initTerics();
	box.initKeyboardEvent();
	
	Box.timer = setInterval(function(){box.moveDown();},300);
	
	
}
function Box(x,y,width,height){//x,y表示teric的初始位置，width和height分别表示游戏区域的大小
	this.width = width;
	this.height = height;
	this.originalX = x;
	this.originalY = y;
	this.lines=0;
	this.table = document.getElementsByClassName('playGround')[0];
	while(this.table.hasChildNodes()){
		this.table.removeChild(this.table.firstChild);
	}
	//游戏区域的二维数组
	this.boxArray = new Array();
	for(var i=0;i<height+1;i++){
		 this.boxArray[i] = new Array();
		for(var j=0;j<width+2;j++){
			if(j==0 || j==width+1 || i==height){
				this.boxArray[i][j] = -1;
			}else{
				this.boxArray[i][j] = 0;
			}
		}
	}
	//方块的七种样式和颜色,其实可以调用翻转函数，对初始图形进行翻转，提高图形的随机性
	this.terics = new Array();
	this.terics[0] = [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]];//I
	this.terics[1] = [[1,0,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]];//T
	this.terics[2] = [[1,1,0,0],[1,0,0,0],[1,0,0,0],[0,0,0,0]];//J
	this.terics[3] = [[1,0,0,0],[1,0,0,0],[1,1,0,0],[0,0,0,0]];//L
	this.terics[4] = [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]];//0
	this.terics[5] = [[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]];//Z
	this.terics[6] = [[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]];//S
	this.color = new Array();
	this.color[0]="#FF0000";
	this.color[1]="#CC9900";
	this.color[2]="#0033CC";
	this.color[3]="#33FFFF";
	this.color[4]="#FFFF66";
	this.color[5]="#663399";
	this.color[6]="#9999CC";
}
Box.prototype = {
	//初始游戏区域的网格样式
	initGameGround:function(){
		var content = "";
		for(var i=0;i<this.height+1;i++){
			var tr="<tr>";
			var td="";
			for(var j=0;j<this.width+2;j++){
				if(this.boxArray[i][j] ==-1){
					td+="<td class='wall'></td>";
				}else{
					td+="<td class='ground'></td>";
				}//if
				
			}//for j
			tr = tr+td+"</tr>";
			content +=tr;
		}//for i
		this.table.innerHTML = content;
	},//function initGameGround
	//随机初始化一个teric以及位置
    initTerics:function(){
		this.num = Math.floor(Math.random()*7);
		this.x=this.originalX;
		this.y = this.originalY;
		this.teric = this.terics[this.num];
		var length = 4;
		this.draw(length);
		
		
	},//function initTeric
	//在页面上画出teric
	draw:function(length){
		var teric = this.teric;
		var color = this.color[this.num];
		for(var i=0;i<length;i++ ){
			for(var j=0;j<length;j++){
				if(this.y+j<this.width+1 && this.x+i <this.height){
					var tr = this.table.firstChild.childNodes.item(this.x+i);
				 	var td = tr.childNodes.item(this.y+j);
				 	if(teric[i][j]==1 && this.boxArray[this.x+i][this.y+j] == 0){
					 	td.style.cssText="background:"+color;
					 }
				}
				
			}//for j
		}//for i
		
	},//function draw
	//清除页面上teric的显示
	clearTrack:function(length){
		var teric = this.teric;
		var color = this.color[this.num];
		for(var i=0;i<length;i++ ){
			for(var j=0;j<length;j++){
				if(this.y+j<this.width+1 && this.x+i <this.height){
					var tr = this.table.firstChild.childNodes.item(this.x+i);
				 	var td = tr.childNodes.item(this.y+j);
					if(teric[i][j]==1 && this.boxArray[this.x+i][this.y+j] !=-1){
						td.style.cssText="";
					}
					
				}
				
			}//for j
		}//for i
	},//function clearTrack
	
	moveDown:function(){
		var _x = this.x+1;
		if(this.canMove(_x,this.y)){
			this.clearTrack(4);
			this.x=_x;
			this.draw(4);
		}else{
			var teric = this.teric;
			for(var i=0;i<length;i++ ){
				for(var j=0;j<length;j++){
					if(this.y+j<this.width+1 && this.x+i <this.height){
						if(teric[i][j]==1 && this.boxArray[this.x+i][this.y+j] ==0){
							this.boxArray[this.x+i][this.y+j]=1;
						}
					}
				}
			}
			if(_x==1){
				clearInterval(Box.timer);
				var hint = document.getElementsByClassName('hint')[0];
				hint.style.cssText = "visibility:visible";
				console.log("game over");
				return;
		     }else{
				 //消去构建的行
				this.clipLines()
				//新的teric
				this.initTerics();
			}//if
			
				
		}//if
	},//function moveDown
	
	moveRight:function(){
		var _y = this.y+1;
		if(this.canMove(this.x,_y)){
			this.clearTrack(4);
			this.y=_y;
			 this.draw(4);
		}//if
	},//function moveRight
	
	moveLeft:function(){
		var _y = this.y-1;
		if(this.canMove(this.x,_y)){
			this.clearTrack(4);
			this.y=_y;
			 this.draw(4);
		}//if
	},//function moveLeft
	
	rotate:function(teric){
		this.clearTrack(4);
		var length = 4;
		var row=0,col=0;
		var cloneTeric = new Array();
		for(var i=0;i<length;i++){
			cloneTeric[i] = new Array();
			for(var j=0;j<length;j++){
				cloneTeric[i][j] = teric[i][j];
				if(teric[i][j]==1){
					if(i>row){row=i;}
					if(j>col){col=j;}
				}
			}
		}
		var dem = row>col?row:col;
		for(var i=0;i<=dem;i++){
			for(var j=0;j<=dem;j++){
				teric[i][j]=cloneTeric[j][dem-i];//逆时针翻转
			}
		}
		if(this.y+dem>this.width){
			this.y = this.y-dem;
	    }
		this.draw(4);
	},//function rotate
	
	canMove:function(x,y){
		length=4;
		var teric = this.teric;
		for(var i=0;i<length;i++){
			for(var j=0;j<length;j++){
				if(y+j<this.width+2 && x+i <this.height+1){
					if(this.boxArray[x+i][y+j] != 0 && teric[i][j]!=0){
					   return false;
				    }
				}
				
			}
		}
		return true;
	},//function can move
	
	clipLines:function(){
		
		for(var i=this.height-1;i>=0;i--){
			var spaceCube=0;
			for(var j=1;j<this.width+1;j++){
				if(this.boxArray[i][j]==0){
					spaceCube=1;
					break;
				}
				
			}//for j
			if(spaceCube == 0){
				//第i行能够消去
			   this.lines++;
			   var score = document.getElementsByClassName('score')[0];
			   score.innerText = this.line*100;
			   this.updateLines(i);
			   i--;
			}
			
		}//for i
	},//function clipLines
	
	updateLines:function(num){
		//先处理数据，再处理页面
		for(var i=num;i>=0;i--){
			for(var j=1;j<this.width+1;j++){
				if(i==0){
					this.boxArray[i][j] = 0;
				}else{
					this.boxArray[i][j] = this.boxArray[i-1][j];
				}
			}
		}
		//处理页面
		var tbody =  this.table.firstChild;
		var trs =tbody.childNodes;
		var tr = trs.item(num);
		tbody.removeChild(tr);
		var tds = tr.children;
		for(var i = 0;i<tds.length;i++){
			var td = tds[i];
			td.style.cssText="";
		}
		tbody.insertBefore(tr,trs.item(0));
		
	},//function updateLines
	
	initKeyboardEvent:function(){
		var that = this;
		document.onkeydown = function(event){
			var e = event || window.event || arguments.callee.caller.arguments[0];

			 if(e && e.keyCode==40){
				 that.moveDown();
			}else if(e && e.keyCode==39){
				that.moveRight();
			}else if(e && e.keyCode==37){
				that.moveLeft();
			}else if(e && e.keyCode==38){//向上的箭头翻转
				that.rotate(that.teric);
			}
		}
	}//function initKeyboardEvent
}