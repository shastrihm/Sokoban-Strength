var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");
var keys = [];
var pushUp,pushDown,pushLeft,pushRight;
var boulderArray = [];
var grid=false;
var size=60;
var c=67; 

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


function Character(column,row)
{ 
  
  this.width = size;
  this.height = size;
  this.x = this.width*(column-1);
  this.y = this.height*(row-1);
  this.img = faceDown;
  this.speed = 2.5;

  this.draw = function(){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

}

function Wall(column,row)
{ 
  this.width = size;
  this.height = size;
  this.x = this.width*(column-1);
  this.y = this.height*(row-1);
  this.img = wallImg;
  boulderArray.push(this);

  this.draw = function(){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

function Boulder(column, row)
{
  Wall.call(this, column, row);
  this.img=boulderImg;

  this.animateBoulderPush = function(){ //checks for collisions between boulders
 
    function remove(array, element){
      return array.filter(e=>e!==element);
    }

    if(keys[c]){
      //top
      if(pushUp && this.y>=0)
      {
        this.y -= this.height;
        if(this.y>=0 && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
          this.draw();}
        else{this.y+=this.height;}
      } 
      //bottom
      if(pushDown && this.y+this.height<=canvas.height)
      {
        this.y += this.height;
        if(this.y+this.height<=canvas.height && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
          this.draw();}
        else{this.y-=this.height;}
      }
      //left
      if(pushLeft && this.x >=0)
      {
        this.x -= this.width;
        if(this.x>=0 && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
          this.draw();}
        else{this.x+=this.width;}
      }
      //right
      if(pushRight && this.x +this.width <= canvas.width)
      {
        this.x += this.width;
        if(this.x+this.width<=canvas.width && !remove(boulderArray,this).some((boulder)=>collision(this,boulder))){
          this.draw();}
        else{this.x-=this.width;}
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

}

Boulder.prototype = Object.create(Wall.prototype);

char = new Character();

function loadInitial() {
  window.onload = function(){
    char.draw();
    boulderArray.forEach(boulder=>boulder.draw());
  }
}

var d=68, s=83, w=87, a=65 
function move() {//doesn't check for collisions between boulders
  //d
  if (keys[d]) {
    if (char.x + char.speed + char.width <= canvas.width) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      char.x += char.speed;

      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceRight;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder))
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height);
        char.x -= char.speed;
        char.img = faceRight;
        redraw();
      }
    }
  }
  //s
  if (keys[s]) {
    if (char.y + char.speed + char.width <= canvas.height) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      char.y += char.speed;

      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceDown;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder))
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height);
        char.y -= char.speed;
        char.img = faceDown;
        redraw();
      }
    }
  }
  //w
  if (keys[w]) {
    if (char.y - char.speed >= 0) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      char.y -= char.speed;

      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceUp;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder))
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height);
        char.y += char.speed;
        char.img = faceUp;
        redraw();
      } 
    }
  }
  //a
  if (keys[a]) {
    if (char.x - char.speed >= 0) {
      ctx.clearRect(char.x, char.y, char.width, char.height);
      char.x -= char.speed;
      if(!boulderArray.some(boulder=>collision(char, boulder))){
        char.img = faceLeft;
        redraw();
      }
      else{
        let thisBoulder=boulderArray.find(boulder=>collision(char,boulder))
        if(thisBoulder instanceof Boulder)
        {
          thisBoulder.animateBoulderPush();
        }
        ctx.clearRect(char.x, char.y, char.width, char.height); 
        char.x+=char.speed; 
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
    boulderArray.forEach(boulder=>boulder.draw());
  }
  
  else{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    char.draw();
    boulderArray.forEach(boulder=>boulder.draw());
  }
}


function collision(ent1, ent2) //rectangle-rectangle collsion
{ 
  if (ent1.x < ent2.x + ent2.width &&
   ent1.x + ent1.width > ent2.x &&
   ent1.y < ent2.y + ent2.height &&
   ent1.height + ent1.y > ent2.y) 
  {
    // collision detected
      whichSide(ent1, ent2);
      
    return true;
  }
  else{return false;}
}

function whichSide(A, B) //computes Minkowski Sum
{ 
  var w = 0.5 * (A.width + B.width);
  var h = 0.5 * (A.height + B.height);
  var dx = ((A.width-A.x)/2) - ((B.width-B.x)/2);
  var dy = ((A.height-A.y)/2) - ((B.height-B.y)/2);
      
      var wy = w * dy;
      var hx = h * dx;

      if (wy > hx)
      {
          if (wy > -hx && keys[s])
          {
              /* collision at the top of obstacle */
              console.log('top');
              pushDown = true;
              pushUp = pushLeft = pushRight = false;
          }
          else if(keys[a])
          {
            /* on the right of obstacle */ 
            console.log('left')
            pushLeft = true;
            pushUp = pushDown = pushRight = false;
          }
      }
      else
      {
          if (wy > -hx && keys[d])
          {
            /* on the left of obstacle */
            console.log('right'); 
            pushRight = true;
            pushUp = pushLeft = pushDown = false;
          }
             
          else if(!keys[d] && !keys[a])
          {
           /* at the bottom of obstacle*/
           console.log('bottom'); 
           pushUp = true;
           pushDown = pushLeft = pushRight = false;
          }
              
      } 
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


