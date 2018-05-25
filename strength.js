var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");
var keys = [];
var masterObstacles = [];
var pushUp,pushDown,pushLeft,pushRight;
var boulderArray = [];
var grid=false;
var size=60;
var storePos;

var faceDown = new Image();
faceDown.src = "faceDown.png";
var faceUp= new Image();
faceUp.src= "faceUp.png";
var faceRight= new Image();
faceRight.src= "faceRight.png";
var faceLeft = new Image();
faceLeft.src="faceLeft.png";

var wallImg = new Image();
wallImg.src = "Wall.png";
var boulderImg = new Image();
boulderImg.src = "Boulder.png";
var flagImg = new Image();
flagImg.src = "flag.png";


function Character(column,row)
{ 
  this.parent = "Character";
  this.width = size;
  this.height = size;
  this.col = column;
  this.row = row; 
  this.x = this.width*(this.col-1);
  this.y = this.height*(this.row-1);
  this.img = faceDown;
  this.speed = size;

  this.updatePos = function(){
    this.x = this.width*(this.col-1);
    this.y = this.height*(this.row-1);
  }

  this.draw = function(){
    this.updatePos();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

}

function Destination(column,row)
{ 
  this.parent = "Destination";
  this.width = size;
  this.height = size;
  this.col = column;
  this.row = row; 
  this.x = this.width*(this.col-1);
  this.y = this.height*(this.row-1);
  this.img = flagImg;
  
  this.updatePos = function(){
    this.x = this.width*(this.col-1);
    this.y = this.height*(this.row-1);
  }

  this.draw = function(){
    this.updatePos();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

function Wall(column,row)
{ 
  this.parent = "Wall";
  this.width = size;
  this.height = size;
  this.col = column;
  this.row = row; 
  this.x = this.width*(this.col-1);
  this.y = this.height*(this.row-1);
  this.img = wallImg;
  boulderArray.push(this);

  this.updatePos = function(){
    this.x = this.width*(this.col-1);
    this.y = this.height*(this.row-1);
  }

  this.draw = function(){
    this.updatePos();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

function Boulder(column, row)
{
  Wall.call(this, column, row);
  this.parent = "Boulder";
  this.img=boulderImg;

  this.animateBoulderPush = function(){ //checks for collisions between boulders
 
    function remove(array, element){
      return array.filter(e=>e!==element);
    }

    
    //top
    if(pushUp && this.row>1)
    {
      this.row--;
      console.log('hi');
      if(this.y>=0 && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
        this.draw();}
      else{this.row++;}
    } 
    //bottom
    if(pushDown && this.row<canvas.height/size)
    {
      this.row++;
      if(this.y+this.height<=canvas.height && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
        this.draw();}
      else{this.row--;}
    }
    //left
    if(pushLeft && this.col>1)
    {
      this.col--;
      if(this.x>=0 && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
        this.draw();}
      else{this.col++}
    }
    //right
    if(pushRight && this.col<canvas.width/size)
    {
      this.col++;
      if(this.x+this.width<=canvas.width && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
        this.draw();}
      else{this.col--;}
    }
    //top 
    if(!pushUp && !pushLeft && !pushRight)
    {
      ctx.clearRect(this.x, this.y-this.height, this.width, this.height);
    }
    //bottom
    if(!pushDown && !pushLeft && !pushRight)
    {
      ctx.clearRect(this.x, this.y+this.height, this.width, this.height);
    }
    //left
    if(!pushLeft && !pushUp && !pushDown)
    {
      ctx.clearRect(this.x-this.width, this.y, this.width, this.height);
    }
    //right
    if(!pushRight && !pushUp && !pushDown)
    {
      ctx.clearRect(this.x+this.width, this.y, this.width, this.height);
    }
    
  }

}

Boulder.prototype = Object.create(Wall.prototype);
masterObstacles = [Wall, Boulder, Destination, Character];

char = new Character();
endgoal = new Destination();

function loadInitial() {
  window.onload = function(){
    char.draw();
    endgoal.draw();
    boulderArray.forEach(boulder=>boulder.draw());
  }
}

var d=68, s=83, w=87, a=65 
function move() {//doesn't check for collisions between boulders
  //d

  if (keys[d]) {
    if (char.x + char.speed + char.width <= canvas.width) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      storePos = [char.col,char.row];
      char.col++;

      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceRight;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder));
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height);
        char.col--;
        char.img = faceRight;
        redraw();
      }
    }
  }
  //s
  if (keys[s]) {
    if (char.y + char.speed + char.width <= canvas.height) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      storePos = [char.col,char.row];
      char.row++;

      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceDown;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder));
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height);
        char.row--;
        char.img = faceDown;
        redraw();
      }
    }
  }
  //w
  if (keys[w]) {
    if (char.y - char.speed >= 0) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      storePos = [char.col,char.row];
      char.row--;

      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceUp;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder));
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height);
        char.row++;
        char.img = faceUp;
        redraw();
      } 
    }
  }
  //a
  if (keys[a]) {
    if (char.x - char.speed >= 0) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      storePos = [char.col,char.row];
      char.col--;

      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceLeft;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder));
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height); 
        char.col++;
        char.img = faceLeft;
        redraw();
      }
    }
  }
  setTimeout(move, 10);
}

function redraw()
{ 
  if(grid){
    showGrid();
    char.draw();
    endgoal.draw();
    boulderArray.forEach(boulder=>boulder.draw());
  }
  
  else{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    char.draw();
    endgoal.draw();
    boulderArray.forEach(boulder=>boulder.draw());
  }
}


function collision(ent1, ent2) 
{ //ent1 is usually the character
  if (ent1 instanceof Character && ent1.row === undefined)
  {
    return false;
  }
  else if (ent1.col == ent2.col && ent1.row == ent2.row) 
  {
    // collision detected
    whichSide(ent1, ent2);
    return true;
  }
  else{return false;}
}

function whichSide(ent1, ent2) //which direction boulder push?
{ 
  if(!(ent1 instanceof Character)){return}

  let charCol = storePos[0];
  let charRow = storePos[1];
  pushUp = (charCol==ent2.col && charRow==ent2.row+1);
  pushDown = (charCol==ent2.col && charRow==ent2.row-1);
  pushRight = (charCol==ent2.col-1 && charRow==ent2.row);
  pushLeft = (charCol==ent2.col+1 && charRow==ent2.row);
}

function showGrid()
{
  let boulderWidth = size;
  let boulderHeight = size;

  function drawLine(fromx,fromy,tox,toy)
  {
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
  }
  //draws horizontal lines
  for(var i=0;i<=canvas.height;i+=boulderHeight){
    drawLine(0,i,canvas.width,i);
  }
  //draws vertical lines
  for(var i=0;i<=canvas.width;i+=boulderWidth){
    drawLine(i,0,i,canvas.height);
  }
}


function playGame()
{
  loadInitial();
  move();

  document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    setTimeout(function(){keys[e.keyCode] = false},10)
  });
  document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
  });
  canvas.addEventListener("mouseover",function(){
    grid=true;
    redraw();
  });
  canvas.addEventListener("mouseleave",function(){
    grid=false;
    redraw();
  });
}

playGame();

