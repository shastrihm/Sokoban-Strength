function findObsAt(obs,atcol,atrow)
{
  return (obs.col == atcol && obs.row == atrow)
}

function col_row_to_xy(col,row)
{
  return [size*(col-1),size*(row-1)];
}

function xy_to_col_row(x,y)
{
  return [Math.round(((x/size)+1)), Math.round(((y/size)+1))];
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function ColRowObject(col,row)
{
  this.col = col;
  this.row = row;
}

function returnColRowObject(col,row)
{
  return new ColRowObject(col,row);
}

function rBlockRadiusFrom(col,row,r)
{
  let c = returnColRowObject;

  let arr = [];
  for(let i=1;i<=r;i++)
  {
    arr.push(c(col-i,row),
            c(col+i,row),
            c(col,row-i),
            c(col,row+i))
  }
  return arr.filter(coords=>withinBounds(coords.col,coords.row));
}

function getIndepSubClass(objArray,subclass)
{
  return objArray.filter(obj=>obj instanceof subclass);
}

function removeIndepSubClass(objArray,subclass)
{
  return objArray.filter(obj=>!(obj instanceof subclass))
}
function attractMovement(sqr,boulder)
{ 
  console.log(sqr,boulder);
  let col1 = sqr.col;
  let col2 = boulder.col;
  let row1 = sqr.row;
  let row2 = boulder.row;

  if(col1==col2)
  {
    return new ColRowObject(col1,parseInt((row1+row2)/2));
  }

  else if(row1==row2)
  {
    return new ColRowObject(parseInt((col1+col2)/2),row1);
  }
}


function repelMovement(sqr,boulder)
{
  console.log(sqr,boulder);
  let col1 = sqr.col;
  let col2 = boulder.col;
  let row1 = sqr.row;
  let row2 = boulder.row;

  if(col1==col2)
  { 
    if(row1>row2)
    {
      return new ColRowObject(col1,row2-1);
    }

    else
    {
      return new ColRowObject(col1,row2+1);
    }

  }

  else if(row1==row2)
  {
    if(col1>col2)
    {
      return new ColRowObject(col2-1,row1);      
    }

    else
    {
      return new ColRowObject(col2+1,row1);
    }
  }
}

function nextSqrAvailable(char,key)
{
  let sqr;
  switch(key)
  {
    case "w":
      sqr = returnColRowObject(char.col,char.row-1);
      break;
    case "a":
      sqr = returnColRowObject(char.col-1,char.row);
      break;
    case "s":
      sqr = returnColRowObject(char.col,char.row+1);
      break;
    case "d":
      sqr = returnColRowObject(char.col+1,char.row);
      break;
  }

  if(iceArray.some(tile=>collision(sqr,tile)) &&
      !boulderArray.some(boulder=>collision(sqr,boulder)) &&
      !wormholeArray.some(hole=>collision(sqr,hole)) &&
      !plateArray.some(plate=>collision(sqr,plate)) &&
      withinBounds(sqr.col,sqr.row))
  {
    return true;
  }
  return false;
}

function nextSqrAvailableAfterAnimation(char,key)
{
  let sqr;
  let thisSqr = returnColRowObject(char.col,char.row);
  switch(key)
  {
    case "w":
      sqr = returnColRowObject(char.col,char.row-1);
      break;
    case "a":
      sqr = returnColRowObject(char.col-1,char.row);
      break;
    case "s":
      sqr = returnColRowObject(char.col,char.row+1);
      break;
    case "d":
      sqr = returnColRowObject(char.col+1,char.row);
      break;
  }
  if(wormholeArray.some(hole=>collision(thisSqr,hole)) ||
     plateArray.some(plate=>collision(thisSqr,plate)))
  {
    return false;
  }

  if(!boulderArray.some(boulder=>collision(sqr,boulder)) &&
    withinBounds(sqr.col,sqr.row))
  {
    return true;
  }
  return false;
}



function withinBounds(col,row)
{
  let maxRows = canvas.height/size;
  let maxCols = canvas.width/size;
  return(col<=maxCols && row<=maxRows && col>=1 && row>=1)
}

function clearInput(id)
{
  let input = document.getElementById(id);
  input.value ="";
}

function remove(array, element)
{
  return array.filter(e=>e!==element);
}

function uniqueElms(data)
{
  return data.filter(function(a)
  {
    return data.indexOf(a) == data.lastIndexOf(a)
  });
}

function removeInPlace(array, element)
{
  let index = array.indexOf(element)
  array.splice(index, 1)
}

function drawLineWithCircle(fromx,fromy,tox,toy)
{
  function appendCircle(centerx,centery,radius)
  {
    ctx.arc(centerx,centery,radius,0,2*Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();

  }
  ctx.save();
  ctx.beginPath();
  appendCircle(tox,toy,10);
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.restore();
}


function freezeInput()
{
    //pauses pausable events
    pauseInput = true;
}

function unfreezeInput()
{
     //unpauses pausable events
     pauseInput = false;
}

function emptyNestedArraysInPlace(nestedArr)
{
  for(let arr in nestedArr)
  {
    nestedArr[arr].length = 0;
  }
}

function overlappedWith(entity,objArray)
{
  return objArray.some(obj=>collision(entity,obj));
}

function playGround()
{
    //for testing changes to mechanics
    canvas.width = size*10;
    canvas.height = size*10;
    new Ice(2,2);
    new Ice(2,3);
    new Ice(2,4);
    new Ice(2,5);
    new Ice(3,2);
    new Ice(3,3);
    new Ice(3,4);
    new Ice(3,5);
    new Boulder(4,4);
    new Wall(5,4);
    new ChargedPlate(6,1);
    new ChargedBoulder(9,7,PositiveCharge);
    new ChargedBoulder(6,6,PositiveCharge);
    new ChargedBoulder(7,7, NegativeCharge);
    new ChargedBoulder(5,5,NegativeCharge);
    let t1 = new Wormhole(4,2);
    let t2 = new Wormhole(2,4);
    let t3 = new Wormhole(6,6);
    t1.linkTo(t2);
    t2.linkTo(t3);
    t3.linkTo(t1);
    char.col = 1;
    char.row = 1;
    redraw();
}

function examplePuzzle()
{
  importConfig('{"dims":[20,20],"Ice":[[2,7],[3,7],[5,7],[7,7],[4,7],[6,7],[9,7],[8,7],[10,7],[12,7],[11,7],[13,7],[14,7],[15,7],[16,7],[18,7],[19,7],[20,7],[20,9],[20,8],[20,11],[19,11],[19,10],[19,9],[19,8],[18,9],[18,11],[18,10],[18,8],[17,9],[17,10],[17,11],[17,8],[16,8],[16,10],[16,11],[16,9],[15,9],[15,10],[15,11],[15,8],[14,8],[14,9],[14,10],[14,11],[13,11],[13,10],[13,9],[13,8],[12,8],[12,10],[12,11],[12,9],[11,8],[11,9],[11,10],[11,11],[10,10],[10,9],[10,8],[9,8],[9,9],[9,10],[10,11],[8,10],[9,11],[7,9],[8,8],[7,8],[8,9],[7,10],[6,10],[6,8],[5,8],[6,9],[5,9],[5,10],[4,10],[4,9],[4,8],[3,8],[3,9],[3,11],[2,9],[2,8],[3,10],[2,10],[20,10],[4,11],[6,11],[8,11],[5,11],[7,11],[17,7]],"ChargedPlate":[[2,12]],"Wormhole":[[11,11,17,7],[17,7,11,11]],"ChargedBoulder":[[2,7,-1],[3,7,-1],[4,7,-1],[5,7,-1],[6,7,-1],[7,7,-1],[8,7,-1],[10,7,-1],[12,7,-1],[14,7,-1],[15,7,-1],[16,7,-1],[19,7,-1],[20,7,-1],[18,7,-1],[13,7,-1],[11,7,-1],[9,7,-1],[4,10,1],[5,10,1],[7,10,1],[9,10,1],[8,10,1],[6,10,1],[11,10,1],[10,10,1],[12,10,1],[13,10,1],[14,10,1],[15,10,1],[16,10,1],[17,10,1],[18,10,1],[19,10,1],[20,10,1],[17,7,-1]],"Wall":[[3,12],[3,11],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[11,6],[10,6],[12,6],[13,6],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[20,6],[4,12],[5,12],[6,12],[7,12],[8,12],[9,12],[10,12],[11,12],[12,12],[13,12],[14,12],[15,12],[16,12],[18,12],[19,12],[20,12],[17,12]],"Destination":[[20,11]],"Character":[[1,12]]}');
}

