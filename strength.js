/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*---------------------GLOBAL VARIABLES---------------------*/
/*---------------------AND ALLPURPOSE FUNCTIONS-------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/


var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");
var keys = [];
var pushUp,pushDown,pushLeft,pushRight;
var freeMove = true;
var what;

var boulderArray = [];
var iceArray = [];
var wormholeArray = [];
var plateArray = [];

var grid=false;
const size=60;
var storePos;
var pauseInput = false;
var inAnimation = false; // to handle asynch issues


var faceDown = new Image();
faceDown.src = "images/faceDown.png";
var faceUp= new Image();
faceUp.src= "images/faceUp.png";
var faceRight= new Image();
faceRight.src= "images/faceRight.png";
var faceLeft = new Image();
faceLeft.src="images/faceLeft.png";

var wallImg = new Image();
wallImg.src = "images/Wall.png";
var boulderImg = new Image();
boulderImg.src = "images/Boulder.png";
var flagImg = new Image();
flagImg.src = "images/flag.png";
var iceImg = new Image();
iceImg.src = "images/Ice.png";
var wormhole_activeImg = new Image();
wormhole_activeImg.src = "images/Wormhole_active.png";
var wormhole_inactiveImg = new Image();
wormhole_inactiveImg.src = "images/Wormhole_inactive.png"
var neutralPlateImg = new Image();
neutralPlateImg.src = "images/plate_neutral.png";
var positivePlateImg = new Image();
positivePlateImg.src = "images/plate_positive.png";
var negativePlateImg = new Image();
negativePlateImg.src = "images/plate_negative.png";
var positiveBoulderImg = new Image();
positiveBoulderImg.src = "images/Positive_Boulder.png";
var negativeBoulderImg = new Image();
negativeBoulderImg.src = "images/Negative_Boulder.png"


/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*---------------------OBJECT DEFINITIONS-------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/

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
  this.recalc_coords = true;

  this.charge = NeutralCharge;

  this.updatePos = function(){
    if(this.recalc_coords)
    {
      this.x = this.width*(this.col-1);
      this.y = this.height*(this.row-1);      
    }
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

function Ice(column,row)
{
  this.parent = "Ice";
  this.width = size;
  this.height = size;
  this.col = column;
  this.row = row; 
  this.x = this.width*(this.col-1);
  this.y = this.height*(this.row-1);
  this.img = iceImg;
  this.active = true;
  iceArray.push(this); 

  this.updatePos = function(){
    this.x = this.width*(this.col-1);
    this.y = this.height*(this.row-1);
  }

  this.draw = function(){
    this.updatePos();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  this.findEndSlide = function(key,char)
  { 
    freezeInput();
    //key: w, a, s, d in String
    //char: entity
    let testchar = {col:char.col,row:char.row};
    let dirFunc;
    let invFunc;

    let withinBounds = function(col,row){
      let maxRows = canvas.height/size;
      let maxCols = canvas.width/size;
      return(col<=maxCols && row<=maxRows && col>=1 && row>=1)
    }
    console.log(key);
    switch(key)
    {
      case "w":
        dirFunc = function(){testchar.row--};
        invFunc = function(){testchar.row++};
        break;
      case "a":
        dirFunc = function(){testchar.col--};
        invFunc = function(){testchar.col++};
        break;
      case "s":
        dirFunc = function(){testchar.row++};
        invFunc = function(){testchar.row--};
        break;
      case "d":
        dirFunc = function(){testchar.col++};
        invFunc = function(){testchar.col--};
        break;
    }

    while(iceArray.some(tile=>collision(testchar,tile)) &&
      !boulderArray.some(boulder=>collision(testchar,boulder)) &&
      !wormholeArray.some(hole=>collision(testchar,hole)) &&
      !plateArray.some(plate=>collision(testchar,plate)) &&
      withinBounds(testchar.col,testchar.row))
    {
      console.log(testchar.col,testchar.row)
      dirFunc();
    }

    if(!boulderArray.some(boulder=>collision(testchar,boulder)) &&
      withinBounds(testchar.col,testchar.row))
    {
      console.log([testchar.col,testchar.row]);
      return [testchar.col,testchar.row]
    }
    else
    {
      invFunc();
      console.log([testchar.col,testchar.row]);
      return [testchar.col,testchar.row]
    }
    
  }

  this.animateSlide = function(to,key,char)
  { 
    //to: a tuple of destination coords.
    //key: 0,1,2,3 corresponds to w,a,s,d
    //char: entity
    freezeInput();
    inAnimation = true;

    if(this.active == false)
    {
      if(inAnimation == false)
      {
        unfreezeInput();
      }
      return;
    }

    let pathLength = Math.abs(char.col-to[0])+Math.abs(char.row-to[1]);

    let dstep=5; //factor of size
    let end_xy=[char.width*(to[0]-1),char.height*(to[1]-1)];
    console.log(end_xy);
    char.recalc_coords = false;
    let that = char;
    switch(key)
    {
      case "w":
        dirFunc = function(){that.y-=dstep;};
        break;
      case "a":
        dirFunc = function(){that.x-=dstep;};
        break;
      case "s":
        dirFunc = function(){that.y+=dstep};
        break;
      case "d":
        dirFunc = function(){that.x+=dstep};
        break;
    }

    //careful! setInterval still runs code after it evevn during animation
    //it is asynchronous. Anything u want to do once animation is finished 
    // and before new redraw() call must be in the clearInterval code block.
    let animate = setInterval(function()
      { 
        if(that.x==end_xy[0] && that.y==end_xy[1])
        {
          that.col = to[0];
          that.row = to[1];
          that.recalc_coords = true;

          if(plateArray.some(plate=>collision(char,plate)))
          {
            let thisPlate = plateArray.find(plate=>collision(char,plate));
            thisPlate.toggle(char);
          }

          redraw();
          clearInterval(animate);
          inAnimation = false;
          //check if char is on something after slide. Act accordingly
          Wormhole.check(char);
          if(inAnimation==false)
          {
            unfreezeInput();
          }
        }
        else
        { 
          dirFunc();
          console.log(key);
          redraw();
        }
      },1000/60);
  }

  this.updateStatus = function()
  {
    if(wormholeArray.some(hole=>collision(this,hole) && hole.active==true))
    {
      this.active = false;
    }
    else
    {
      this.active = true;
    }
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

  this.updateStatus = function()
  {
    return
  }
}

function Boulder(column, row)
{
  Wall.call(this, column, row);
  this.parent = "Boulder";
  this.img=boulderImg;

  this.animateBoulderPush = function(boulderArray){ //checks for collisions between boulders
 
    function remove(array, element){
      return array.filter(e=>e!==element);
    }

    
    //top
    if(pushUp && this.row>1)
    {
      this.row--;
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

    if(pauseInput)
    {
      return;
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

function ChargedBoulder(column,row,charge)
{
  Boulder.call(this,column,row);
  this.parent = "ChargedBoulder";
  this.charge = charge;
  this.img = this.charge.bouldImg
  let that = this;

  this.activationSquares = function(ion)
  { 
    
    if(this.charge.sign == ion.charge.sign)
    {
      //repel, 2 block radius
      return [this.repelled, rBlockRadiusFrom(this.col,this.row,2)];
    } 
    else if(this.charge.sign != ion.charge.sign && ion.charge.sign !=0)
    {
      //attract, 2 block radius
      return [this.attracted, rBlockRadiusFrom(this.col,this.row,2)];
    }
    else
    {
      return false;
    }
    
  }


  this.attracted = function(fromSqr,char)
  { 
    console.log(fromSqr,that);
    let toSqr = attractMovement(fromSqr,that);
    console.log(toSqr);
    if(!boulderArray.some(boulder=>collision(toSqr,boulder)) && !collision(char,toSqr))
    {
      that.col = toSqr.col;
      that.row = toSqr.row;
    }
    redraw();
  }

  this.repelled = function(fromSqr,char)
  {
    console.log(fromSqr,that);
    let toSqr = repelMovement(fromSqr,that);
    console.log(toSqr);
    if(!boulderArray.some(boulder=>collision(toSqr,boulder)) && withinBounds(toSqr.col,toSqr.row) && 
      !collision(char,toSqr))
    {
      that.col = toSqr.col;
      that.row = toSqr.row;
    }
    redraw();    
  }

  this.animateElectroPush = function(boulderArray,char)
  {
    let triggerSqrs = this.activationSquares(char);
    if(triggerSqrs == false){return};
    if(triggerSqrs[1].some(sqr=>collision(char,sqr)))
    {
      let thisSqr = triggerSqrs[1].find(sqr=>findObsAt(sqr,char.col,char.row));
      console.log(triggerSqrs[0]);
      (triggerSqrs[0])(thisSqr,char);
    }

  }

  this.updateStatus = function()
  {

  }
}

Boulder.prototype = Object.create(Wall.prototype);
ChargedBoulder.prototype = Object.create(Boulder.prototype);

function Wormhole(column,row)
{
  this.parent = "Wormhole";
  this.width = size;
  this.height = size;
  this.col = column;
  this.row = row; 
  this.x = this.width*(this.col-1);
  this.y = this.height*(this.row-1);
  this.img = wormhole_inactiveImg;
  
  this.active = true;
  this.warpto = this;

  wormholeArray.push(this);

  this.updatePos = function(){
    this.x = this.width*(this.col-1);
    this.y = this.height*(this.row-1);
  }

  this.draw = function(){
    this.updatePos();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  this.warp = function(entity){
    if(this.active == true)
    {
      entity.col = this.warpto.col;
      entity.row = this.warpto.row;
    }
    redraw();
  }

  this.updateStatus = function(){
    if(wormholeArray.indexOf(this.warpto) == -1)
    {
      this.warpto = this;
    }
    if(boulderArray.some(boulder=>collision(this.warpto,boulder))
      || this.warpto == this)
    {
      this.active = false;
      this.img = wormhole_inactiveImg;
    }
    else
    {
      this.active = true;
      this.img = wormhole_activeImg;
    }
  }

  this.linkTo = function(wormholeObj){
    this.warpto = wormholeObj;
  }

  this.pairwiseLink = function(wormholeObj)
  {
    this.linkTo(wormholeObj);
    wormholeObj.linkTo(this);
  } 

  this.warpAnimation = function(entity,imgs,revolutions, ms)
  { 
    //entity: char, boulder, anything that will be warped and animated.
    //imgs: array of images that entity will cycle through for animation
    //ms: ms per quarter revolution
    //revolutions: num times ent spins. warps at half. 
    if(this.active==false){return};

    inAnimation = true;
    freezeInput();
    let rev = 0;
    let that = this;
    var spinchar = function(entity,img)
    {
      entity.img = img;
      redraw();
    }

    let animate = setInterval(function()
    {
      if(rev>=revolutions)
        { 
          clearInterval(animate);
          inAnimation = false;
          if(inAnimation == false)
          {
            unfreezeInput();
          }
        }
      else
      { 
        if(rev>=revolutions/2)
        {
          that.warp(entity)
        }  
        spinchar(char,imgs[rev%imgs.length]);
        rev++
      }
    },ms)
  }

}

const PositiveCharge = {sign:+1,
                        plateImg: positivePlateImg,
                        bouldImg: positiveBoulderImg};
const NegativeCharge = {sign:-1,
                        plateImg: negativePlateImg,
                        bouldImg: negativeBoulderImg};
const NeutralCharge = {sign:0,
                        plateImg: neutralPlateImg,
                        bouldImg: boulderImg};

function ChargedPlate(column,row,charge=NeutralCharge)
{
  this.parent = "ChargedPlate";
  this.width = size;
  this.height = size;
  this.col = column;
  this.row = row; 
  this.x = this.width*(this.col-1);
  this.y = this.height*(this.row-1);

  this.onIce = iceArray.some(tile=>collision(this,tile));
  this.charge = charge;
  this.img = this.charge.plateImg;
  plateArray.push(this);

  
  this.updatePos = function(){
    this.x = this.width*(this.col-1);
    this.y = this.height*(this.row-1);
  }

  this.draw = function(){
    this.updatePos();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  this.updateStatus = function()
  {
    this.img = this.charge.plateImg;
    this.onIce = iceArray.some(tile=>collision(this,tile));
  }

  this.toggle = function(char)
  {
    char.charge = this.charge;
    if(this.charge == PositiveCharge)
    {
      this.charge = NegativeCharge;
    }
    else if(this.charge == NegativeCharge)
    {
      this.charge = NeutralCharge;
    }
    else if(this.charge == NeutralCharge)
    {
      this.charge = PositiveCharge;
    }
  }
}

char = new Character();
endgoal = new Destination();

//index 0 of key is for initializing the actual obj, 
//index 1 is for the AI to simulate the game away from UI
const masterObstacles = {
                        "Wall": [
                                  function(col,row){new Wall(col,row)},
                                  function(col,row){testBoulderArray.push(testWallMaker(col,row));}
                                 ],
                        "Boulder": [
                                    function(col,row){new Boulder(col,row)},
                                    function(col,row){testBoulderArray.push(testBoulderMaker(col,row));}
                                   ],
                        "Destination": [
                                        function(col,row){endgoal = new Destination(col,row)},
                                        function(col,row){testdest.col = col;
                                                          testdest.row = row;}
                                       ],
                        "Character": [
                                      function(col,row){char = new Character(col,row)},
                                      function(col,row){testchar.col = col;
                                                 testchar.row = row;}
                                     ],
                        "Ice": [
                                function(col,row){new Ice(col,row);}
                                ],
                        "Wormhole": [
                                    function(col,row,warptocol,warptorow)
                                    { 
                                      let thisOne, thatOne;
                                      thisOne = wormholeArray.find(hole=>findObsAt(hole,col,row));
                                      thatOne = wormholeArray.find(hole=>findObsAt(hole,warptocol,warptorow));
                                      if(thisOne===undefined){thisOne = new Wormhole(col,row)};
                                      if(thatOne===undefined){thatOne = new Wormhole(warptocol,warptorow)};
                                      thisOne.linkTo(thatOne);
                                    }
                                    ]
                        }
                        
//order matters! they will be orrder in which they are drawn in.
var allArrays = [iceArray,
                plateArray,
                wormholeArray,
                boulderArray,
                [endgoal],
                [char]];

function updateAllArrays()
{
  allArrays = [iceArray,
                plateArray,
                wormholeArray,
                boulderArray,
                [endgoal],
                [char]];
}

/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*---------------------MOVEMENT BEHAVIOUR-------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/

function loadInitial() {
  window.onload = function(){
    iceArray.forEach(tile=>tile.draw());
    wormholeArray.forEach(hole=>hole.draw());
    boulderArray.forEach(boulder=>boulder.draw());
    char.draw();
    endgoal.draw();
  }
}

Wormhole.check = function(char)
{
  if(wormholeArray.some(hole=>collision(char,hole)) && freeMove==true)
  { 
    let thishole = wormholeArray.find(hole=>collision(char,hole));
    thishole.warpAnimation(char,[faceUp,faceRight,faceDown,faceLeft],10*2,40); 
  } 
}

ChargedBoulder.check = function(char)
{
  let chargedBoulderArray = boulderArray.filter(boulder=>boulder instanceof ChargedBoulder);
  for(let cb in chargedBoulderArray)
  {
    let cboulder = chargedBoulderArray[cb];
    let sqrs = cboulder.activationSquares(char)
    if(sqrs != false)
    {
      cboulder.animateElectroPush(boulderArray,char)
    }
  }
}

Wall.check = function(char)
{
  // ChargedBoulder.check(char);
  if(boulderArray.some(boulder=>collision(char, boulder)))
  { 
    freeMove = false;
    let thisBoulder=boulderArray.find(boulder=>collision(char,boulder));
    if(thisBoulder instanceof Boulder || thisBoulder instanceof ChargedBoulder)
    {
      thisBoulder.animateBoulderPush(boulderArray,char);
    }
  }

  else
  {
    ChargedBoulder.check(char);
  }
}

Ice.check = function(dir,char)
{
  if(iceArray.some(tile=>collision(char,tile)) && !char.sliding && freeMove==true)
  {
    let thisTile = iceArray.find(tile=>collision(char,tile));
    thisTile.animateSlide(thisTile.findEndSlide(dir,char),dir,char);
  }
}

ChargedPlate.check = function(char)
{ 
  if(plateArray.some(plate=>collision(char,plate)) && freeMove==true)
  {
    let thisPlate = plateArray.find(plate=>collision(char,plate));
    if(thisPlate.onIce==false)
    {
      //plate toggle done seperately in Ice.animateslide
      thisPlate.toggle(char);
    }
  }
}

function moveBehavior(dir,charimg,dirfunc,invfunc)
{
  //dir: "w" "a" "s" or "d"
  //charimg: faceDown, faceUp, faceRight, faceLeft
  //dirfunc: e.g. function(){char.row++;} 
  //invfunc: e.g. function(){char.row--;}
  ctx.clearRect(char.x, char.y, char.width, char.height);
  storePos = [char.col,char.row];
  dirfunc();

  //order matters!
  char.img = charimg;
  Wall.check(char);
  Wormhole.check(char);
  ChargedPlate.check(char);
  Ice.check(dir,char);

  redraw();

  if(!freeMove)
  {
    ctx.clearRect(char.x, char.y, char.width, char.height);
    invfunc();
    redraw();
    freeMove = true;
  }
}


const d=68;
const s=83;
const w=87;
const a=65;

function move() {//doesn't check for collisions between boulders
  
  //d
  if (keys[d]) {
    char.img = faceRight;
    if (char.x + char.speed + char.width <= canvas.width) {
      moveBehavior("d",faceRight,function(){char.col++;},function(){char.col--;});
    }
    redraw();
  }
  //s
  if (keys[s]) {
    char.img = faceDown;
    if (char.y + char.speed + char.width <= canvas.height) {
      moveBehavior("s",faceDown,function(){char.row++;},function(){char.row--;});
    }
    redraw();
  }
  //w
  if (keys[w]) {
    char.img = faceUp;
    if (char.y - char.speed >= 0) {
      moveBehavior("w",faceUp,function(){char.row--;},function(){char.row++;}); 
    }
    redraw();
  }
  //a
  if (keys[a]) {
    char.img = faceLeft;
    if (char.x - char.speed >= 0) {
      moveBehavior("a",faceLeft,function(){char.col--;},function(){char.col++;});
    }
    redraw();
  }
  setTimeout(move, 10);
}


function update()
{ 
  updateAllArrays();
  wormholeArray.forEach(hole=>hole.updateStatus());
  iceArray.forEach(tile=>tile.updateStatus());
  plateArray.forEach(plate=>plate.updateStatus());
}

function redraw()
{ 
  update();
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(grid)
  {  
    showGrid();
  }

  allArrays.forEach(arr=>arr.forEach(entity=>entity.draw())); 
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
  if(!(ent1 instanceof Character) || storePos===undefined){return}

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

//pauseInput is default false
function pausable(handler)
{
  return function(event)
        {
          if (pauseInput) 
          {
            return;
          }
          return handler(event);
        }
}




function playGame()
{
  loadInitial();
  move();

  document.body.addEventListener("keydown", pausable(function(e) {
    keys[e.keyCode] = true;
    setTimeout(function(){keys[e.keyCode] = false},10)
  }));
  document.body.addEventListener("keyup", pausable(function(e) {
    keys[e.keyCode] = false;
  }));
  canvas.addEventListener("mouseover", function(){
    grid=true;
    redraw();
  });
  canvas.addEventListener("mouseleave",function(){
    grid=false;
    redraw();
  });
}

playGame();

