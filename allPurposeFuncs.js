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

function orientedTowards(obj,obj2,dir)
{
  //used to check whether a charged boulder is in the path of a sliding char on ice
  //dir is a string "w" "a" "s" or "d"
  //returns boolean

  switch(dir)
  {
    case "w":
    case "a":
    case "s":
    case "d":
  }
  let col1 = obj1.col;
  let col2 = obj2.col;
  let row1 = obj1.row;
  let row2 = obj2.row;

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

function sqrNotAvailable(to)
{
  let sqr = returnColRowObject(to[0],to[1]);
  if(boulderArray.some(boulder=>collision(sqr,boulder)))
  {
    return true;
  }
  return false;
}

function sqrAvailable(to,key)
{
  let sqr;
  switch(key)
  {
    case "w":
      sqr = returnColRowObject(to[0],to[1]-1);
      break;
    case "a":
      sqr = returnColRowObject(to[0]-1,to[1]);
      break;
    case "s":
      sqr = returnColRowObject(to[0],to[1]+1);
      break;
    case "d":
      sqr = returnColRowObject(to[0]+1,to[1]);
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

  if(!boulderArray.some(boulder=>collision(sqr,boulder)) &&
    withinBounds(sqr.col,sqr.row))
  {
    return true;
  }
  return false;
  
  if((wormholeArray.some(hole=>collision(sqr,hole)) ||
      plateArray.some(plate=>collision(sqr,plate))) &&
      !boulderArray.some(boulder=>collision(sqr,boulder)) &&
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

