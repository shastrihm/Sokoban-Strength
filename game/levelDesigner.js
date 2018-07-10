

function userSetUpCanvas()
{
  let width = size*Number(document.getElementById("columns").value);
  let height = size*Number(document.getElementById("rows").value);

  updateCanvasDimensions(width,height);

  redraw();
  clearInput("columns");
  clearInput("rows");
}


function setUpCharHere(col,row)
{
  function findBoulderAt(boulder){
    return (boulder.x == boulder.width*(col-1)) && (boulder.y == boulder.height*(row-1))
  }

  let doesExist = boulderArray.find(findBoulderAt);
  if(doesExist===undefined){
    char = new Character(col,row);
    redraw();
  }
}

function setDestination(col,row)
{
  function findBoulderAt(boulder){
    return (boulder.x == boulder.width*(col-1)) && (boulder.y == boulder.height*(row-1))
  }

  let doesExist = boulderArray.find(findBoulderAt);
  if(doesExist===undefined){
    endgoal = new Destination(col,row);
    redraw();
  }
}

function setBoulderOrWall(boulderOrWall,col,row)
{
  let doesExist = boulderArray.find(boulder=>findObsAt(boulder,col,row));
  let testObj = {
                  width: size,
                 height: size,
                      col: col,
                      row: row,
                      x: size*(col-1),
                      y: size*(row-1)
                 };

  if(doesExist===undefined && 
    !collision(char, testObj) && 
    !collision(endgoal, testObj))
  {
    new boulderOrWall(col,row);
    redraw();
  } 
}

function setIce(col,row)
{
  let doesExist = iceArray.find(tile=>findObsAt(tile,col,row));
  if(doesExist===undefined)
  {
    new Ice(col,row);
    redraw();
  }
}

function setWormhole(col,row)
{
  let doesExist = wormholeArray.find(hole=>findObsAt(hole,col,row));
  if(doesExist===undefined)
  {
    new Wormhole(col,row);
    redraw();
  }  
}

function setChargedPlate(col,row)
{
  let doesExist1 = plateArray.find(plate=>findObsAt(plate,col,row));
  let doesExist2 = wormholeArray.find(hole=>findObsAt(hole,col,row))
  if(doesExist1===undefined && doesExist2===undefined)
  {
    new ChargedPlate(col,row);
    redraw();
  }   
}

function setChargedBoulder(col,row,charge)
{
  let doesExist = boulderArray.find(boulder=>findObsAt(boulder,col,row));
  let testObj = {
                  width: size,
                 height: size,
                      col: col,
                      row: row,
                      x: size*(col-1),
                      y: size*(row-1)
                 };

  if(doesExist===undefined && 
    !collision(char, testObj) && 
    !collision(endgoal, testObj))
  {
    new ChargedBoulder(col,row,charge);
    redraw();
  } 
}



function clearAt(col,row)
{
  for(let arr in allArrays)
  {
    let thisOne = allArrays[arr].find(elm=>findObsAt(elm,col,row));
    if(thisOne !== undefined)
    {
      // need remove element in place
      removeInPlace(allArrays[arr],thisOne)      
    }
    redraw();
  }
}

function setObjects(col,row)
{ 
  if(what==Boulder || what==Wall)
  {
    setBoulderOrWall(what,col,row);
  }

  else if (what==Character)
  {
    setUpCharHere(col,row);
  }

  else if(what=="remove")
  { 
    clearAt(col,row)
  }

  else if(what==Destination)
  {
    setDestination(col,row);
  }

  else if(what==Ice)
  {
    setIce(col,row);
  }

  else if(what==Wormhole)
  {
    setWormhole(col,row);
  }

  else if(what==ChargedPlate)
  {
    setChargedPlate(col,row);
  }
  else if(what==ChargedBoulder)
  {
    setChargedBoulder(col,row,subwhat);
  }
}

function anchorLineAtClick(clickCol,clickRow)
{
  
  let fromx = (size*(clickCol-1))+(size*0.5);
  let fromy = (size*(clickRow-1))+(size *0.5);

  return [fromx,fromy]
  // drawLine(fromx,fromy,)
  // canvas.addEventListener("click", pausable(onCanvasClickDrawItem), false); 
  // canvas.addEventListener("mousemove", pausable(highlightSquare), false);
}

function followLineToMouse(mouseCol,mouseRow)
{
  let tox = (size*(mouseCol-1))+(size*0.5);
  let toy = (size*(mouseRow-1))+(size *0.5);

  return [tox,toy]
}

function rawLineCoordsToColRow(x,y)
{
  return [((x-(size*0.5))/size)+1,((y-(size*0.5))/size)+1]
}

function drawWhatOnClick(e)
{
  function drawTransparentImg(img, opacity, col, row)
  { 
    redraw();

    for(let arr in allArrays)
    {
      if(boulderArray.some(entity=>findObsAt(entity,col,row)))
      {
        return;
      }
    }

    ctx.globalAlpha = opacity;
    ctx.drawImage(img,size*(col-1), size*(row-1), size, size);
    ctx.globalAlpha = 1;
  }

  function highlightSquare(e)
  {
    testCoords = getCursorPosition(e);
    let col=testCoords[0], row=testCoords[1];

    ctx.clearRect(0,0,canvas.width, canvas.height)
    redraw();

    let opacity = 0.5;
    switch(what)
    {
      case Boulder:
        drawTransparentImg(boulderImg, opacity, col, row);
        break;
      case Wall:
        drawTransparentImg(wallImg, opacity, col, row);
        break;
      case Ice:
        drawTransparentImg(iceImg, opacity, col, row);
        break;
      case Wormhole:
        drawTransparentImg(wormhole_inactiveImg, opacity, col, row);
        break;
      case Character:
        drawTransparentImg(faceDown, opacity, col, row);
        break;
      case Destination:
        drawTransparentImg(flagImg, opacity, col, row);
        break;
      case ChargedPlate:
        drawTransparentImg(neutralPlateImg, opacity, col, row);
        break;
      case ChargedBoulder:
        drawTransparentImg(subwhat.bouldImg, opacity, col, row);
        break;
      case "remove":
        let redRGBa = "rgba(218,31,31,0.3)"
        ctx.fillStyle = redRGBa;
        ctx.fillRect(size*(col-1), size*(row-1), size, size);
        break;
      default:
        let whiteRGBa = "rgba(155,155,155,0.3)"
        ctx.fillStyle = whiteRGBa;
        ctx.fillRect(size*(col-1), size*(row-1), size, size);

    }

  }

  var listenerRefs = {};
  function drawAnchoredLine(e)
  {

    freezeInput();

    function getMouseMovePosition(e,from)
    {   
      return function(e)
        {
          what = null;
          testCoords = getCursorPosition(e)
          let col=testCoords[0], row=testCoords[1];
          let to = anchorLineAtClick(col,row);
          redraw();
          drawLineWithCircle(from[0],from[1],to[0],to[1])          
        }      
    }

    function getMouseUpPosition(e,from,thisHole)
    { 
      return function(e)
      {
        
        testCoords = getCursorPosition(e);
        let col=testCoords[0], row=testCoords[1];
        
        let checkCoords = rawLineCoordsToColRow(from[0],from[1]);
        //console.log(checkCoords[0],checkCoords[1],col,row);

        if(wormholeArray.some(hole=>findObsAt(hole,col,row))
          && !(checkCoords[0] == col && checkCoords[1] == row))
        {
          let thatHole = wormholeArray.find(hole=>findObsAt(hole,col,row));
          //console.log(thatHole.warpto)
          thisHole.linkTo(thatHole); 
        }
        canvas.removeEventListener('mousemove',listenerRefs.mousemove, false);
        canvas.removeEventListener('mouseup',listenerRefs.mouseup,false);
      }
    }

    testCoords = getCursorPosition(e);
    let col=testCoords[0], row=testCoords[1];
    let downflag = false;
    if(wormholeArray.some(hole=>collision(hole,{col:testCoords[0],row:testCoords[1]})))
    {
      let thisHole = wormholeArray.find(hole=>findObsAt(hole,col,row));
      //console.log(thisHole);
      let from = anchorLineAtClick(col,row);
      listenerRefs.mousemove = getMouseMovePosition(e,from);
      listenerRefs.mouseup = getMouseUpPosition(e,from,thisHole);

      canvas.addEventListener('mousemove',listenerRefs.mousemove, false);
      canvas.addEventListener('mouseup', listenerRefs.mouseup, false);
    }

    unfreezeInput();
  }

  function onCanvasClickDrawItem(e) 
  {
    //alert(getCursorPosition(e));
    testCoords = getCursorPosition(e);
    let col=testCoords[0], row=testCoords[1];
    setObjects(col,row);
    //code goes here
  } 
   
  function getCursorPosition(e) 
  {
      let x;
      let y;
      if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
      }
      else {
      x = e.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
      }
      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;
      
      var testCoords = [x,y];
      for(var i=0; i<canvas.width/size; i++)
      {
        if(testCoords[0]>=size*i && testCoords[0]<=size*(i+1)){
          var col=i+1;
          break
        }
      }

      for(var j=0; j<canvas.height/size; j++)
      {
        if(testCoords[1]>=size*j && testCoords[1]<=size*(j+1)){
          var row=j+1;
          break
        }
      }

      return [col,row]
  }

  canvas.addEventListener("click", pausable(onCanvasClickDrawItem), false); 
  canvas.addEventListener("mousemove", pausable(highlightSquare), false);
  canvas.addEventListener("mousedown", drawAnchoredLine, false);

}

//make sure wormhole warpto are accounted for
function exportConfig(canvas,allArrays)
{
  let exportThis = {};
  let specificObjs;
  let numcols = canvas.width/size;
  let numrows = canvas.height/size;
  exportThis["dims"] = [numcols,numrows];
  for (let arr in allArrays)
  { 
    specificObjs = {};
    let thisArr = allArrays[arr];
    if(thisArr.length>0 && thisArr[0].col !== undefined)
    { 
      
      let init_array_obj_key = function(thing)
      { 
        if(exportThis[thing.parent]===undefined)
        {
          exportThis[thing.parent] = [];
        }

        if(thing.parent=="Wormhole")
        {
          exportThis[thing.parent].push([thing.col,thing.row,thing.warpto.col,thing.warpto.row]);
        }

        else if(thing.parent=="ChargedBoulder")
        {
          exportThis[thing.parent].push([thing.col,thing.row,thing.charge.sign])
        }
        else
        {
          exportThis[thing.parent].push([thing.col,thing.row]);
        }
      }
      
      thisArr.forEach(thing=>init_array_obj_key(thing));
      
    }
  }

  return JSON.stringify(exportThis);
}


function importConfig(config)
{ 
  emptyNestedArraysInPlace(allArrays);
  //config is a JSON string 
  let itemArray = JSON.parse(config);
  let vals;
  let col,row;
  for(let name in itemArray)
  { 
    vals = itemArray[name];

    if(name=="dims")
    {
      // canvas.width = vals[0]*size;
      // canvas.height = vals[1]*size;
      updateCanvasDimensions(vals[0]*size,vals[1]*size);
    }

    else
    {
      for(let i in vals)
      {
        let coords = vals[i];
        col = coords[0];
        row = coords[1];
        attr1 = coords[2];
        attr2 = coords[3];
        (masterObstacles[name])[0](col,row,attr1,attr2);           
      }

    }
    
  }
  redraw();    
}


function validateConfig()
{
  config = document.getElementById("I/O_config").value;
  try 
  {
    importConfig(config);
  }
  catch(error)
  {
    //console.log(error);
    document.getElementById("I/O_config").value = "Please make sure you imported in the right format!";
  }
}


function getConfig()
{
  document.getElementById("I/O_config").value = exportConfig(canvas,allArrays);
}


