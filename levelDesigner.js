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



function setUpCharHere()
{
  let coords=String(document.getElementById("placeCharHere").value);
  let col = Number(coords.split(",")[0]), row=Number(coords.split(",")[1]);

  function findBoulderAt(boulder){
    return (boulder.x == boulder.width*(col-1)) && (boulder.y == boulder.height*(row-1))
  }

  let doesExist = boulderArray.find(findBoulderAt);
  if(doesExist===undefined){
    char = new Character(col,row);
    redraw();
  }

  clearInput("placeCharHere");
}


var what;
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


  function onCanvasClick(e) 
  {
      //alert(getCursorPosition(e));
      testCoords = getCursorPosition(e);
      var col=testCoords[0], row=testCoords[1];

      function findBoulderAt(boulder){
        return (boulder.x == boulder.width*(col-1)) && (boulder.y == boulder.height*(row-1))
      } 

      if(what==Boulder || what==Wall)
      {
        let doesExist = boulderArray.find(findBoulderAt);
        let testObj = {
                        width: size,
                       height: size,
                            x: size*(col-1),
                            y: size*(row-1)
                       };
        if(doesExist===undefined && !collision(char, testObj)){
          new what(col,row);
          redraw();
        }
      }
    
      else if(what=="remove")
      {
        function remove(array, element){
          return array.filter(e=>e!==element);
        }
        let thisOne = boulderArray.find(findBoulderAt);
        boulderArray = remove(boulderArray,thisOne);
        redraw();
      }
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
  canvas.addEventListener("click", onCanvasClick, false); 
  canvas.addEventListener("mousemove", highlightSquare, false);
}


