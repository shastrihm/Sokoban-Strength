function clearInput(id)
{
  let input = document.getElementById(id);
  input.value ="";
}


function userSetUpCanvas()
{
  canvas.width = size*Number(document.getElementById("columns").value);
  canvas.height = size*Number(document.getElementById("rows").value);
  redraw();
  clearInput("columns");
  clearInput("rows");
}



function undoLastBoulder()
{
  boulderArray.pop();
  redraw();
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

var what;
function drawBoulders(col,row)
{
  function findBoulderAt(boulder){
    return (boulder.x == boulder.width*(col-1)) && (boulder.y == boulder.height*(row-1))
  } 

  if(what==Boulder || what==Wall)
  {
    let doesExist = boulderArray.find(findBoulderAt);
    let testObj = {
                    width: size,
                   height: size,
                        col: col,
                        row: row,
                        x: size*(col-1),
                        y: size*(row-1)
                   };
    if(doesExist===undefined && !collision(char, testObj)){
      new what(col,row);
      redraw();
    }
  }

  else if (what==Character)
  {
    setUpCharHere(col,row);
  }

  else if(what=="remove")
  { 
    if(endgoal.col == col && endgoal.row == row){
      endgoal = new Destination();
      return;
    }
    else if(char.col == col && char.row == row){
      char = new Character();
      return;
    }
    function remove(array, element){
      return array.filter(e=>e!==element);
    }
    let thisOne = boulderArray.find(findBoulderAt);
    boulderArray = remove(boulderArray,thisOne);
    redraw();
  }

  else if(what==Destination)
  {
    setDestination(col,row);
  }
}



function drawWhatOnClick(e)
{
  
  function highlightSquare(e)
  {
    testCoords = getCursorPosition(e);
    var col=testCoords[0], row=testCoords[1];

    ctx.clearRect(0,0,canvas.width, canvas.height)
    redraw();
    ctx.fillStyle = "rgba(224,252,68,0.3)";
    ctx.fillRect(size*(col-1), size*(row-1), size, size);
  }


  function onCanvasClickDrawItem(e) 
  {
    //alert(getCursorPosition(e));
    testCoords = getCursorPosition(e);
    var col=testCoords[0], row=testCoords[1];

    drawBoulders(col,row);
    
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

  canvas.addEventListener("click", onCanvasClickDrawItem, false); 
  canvas.addEventListener("mousemove", highlightSquare, false);
}


function exportConfig()
{
  let exportThis = [];
  let numcols = canvas.width/size;
  let numrows = canvas.height/size;
  exportThis.push(String(numcols) + "x" + String(numrows) + "|");
  for (let boulder in boulderArray)
  {
    boul = boulderArray[boulder];
    exportThis.push(boul.parent, boul.col,boul.row,"|");
  }
  exportThis.push(char.parent,char.col,char.row,"|");
  exportThis.push(endgoal.parent,endgoal.col,endgoal.row,"|");
  return String(exportThis);
}


function importConfig(config)
{
  //config is a string 
  boulderArray = [];
  let itemArray = config.split("|").filter(item => item!="");

  for(let i in itemArray)
  {
    if(i==0)
    {
      let dims = itemArray[i].split("x");
      let cols = Number(dims[0]);
      let rows = Number(dims[1]);
      canvas.width = cols*size;
      canvas.height = rows*size;
    }

    else
    {
      filt1 = itemArray[i].split(",").filter(item => item!="");
      let crtInstance = filt1[0];
      let col = Number(filt1[1]);
      let row = Number(filt1[2]);
     
      for(let obs in masterObstacles)
      { 
        let obstacle = masterObstacles[obs]; 
        if(obstacle.name == crtInstance)
        {
          if(obstacle.name == "Destination")
          {
            endgoal = new obstacle(col,row);
          }
          if(obstacle.name == "Character")
          {
            char = new obstacle(col,row);
          }
          else
          {
            new obstacle(col,row);
          }          
        }
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
    importConfig(config)
  }
  catch(error)
  {
    document.getElementById("I/O_config").value = "Please make sure you imported in the right format!";
  }
}


function getConfig()
{
  document.getElementById("I/O_config").value = exportConfig();
}
