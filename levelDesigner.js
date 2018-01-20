function clearInput(id)
{
  let input = document.getElementById(id);
  input.value ="";
}


function userSetUpCanvas()
{
  canvas.width = size*Number(document.getElementById("columns").value);
  canvas.height = size*Number(document.getElementById("rows").value);

  clearInput("columns");
  clearInput("rows");
}



function setUpWhatHere(what,id)
{
  let coords=String(document.getElementById(id).value);
  let col = Number(coords.split(",")[0]), row=Number(coords.split(",")[1]);

  if(col<=canvas.width/size && row<=canvas.height/size)
  {
    function findBoulderAt(boulder){
      return (boulder.x == boulder.width*(col-1)) && (boulder.y == boulder.height*(row-1))
    } 

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

  clearInput(id);
}



function undoLastBoulder()
{
  boulderArray.pop();
  redraw();
}



function removeBoulderAt()
{
  function remove(array, element){
      return array.filter(e=>e!==element);
  }

  let coords=String(document.getElementById("removeBoulderHere").value);
  let col = Number(coords.split(",")[0]), row=Number(coords.split(",")[1]);

  function findBoulderAt(boulder){
    return (boulder.x == boulder.width*(col-1)) && (boulder.y == boulder.height*(row-1))
  }

  let thisOne = boulderArray.find(findBoulderAt);
  boulderArray = remove(boulderArray,thisOne);
  redraw();

  clearInput("removeBoulderHere");
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
