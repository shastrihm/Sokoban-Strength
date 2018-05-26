/*
IDDFS ideas:
can impose time limit, depth limit
prune with heureistics, pruning later
try other searvh algs
*/


///These are defined in strength.js///

// function freezeGame()
// {
//     //pauses pausable events
//     pauseInput = true;
// }

// function unfreezeInput()
// {
//      //unpauses pausable events
//      pauseInput = false;
// }


function getInitialState()
{
    return exportConfig(canvas,boulderArray,char,endgoal);
}



function reachableStates(currentState,direction)
{   
    //add new stuff when I add a new obstacle!
    let testcanvas = {};
    let testchar = new Character();
    let testdest = new Destination();
    let testBoulderMaker = function(colb,rowb){return new Boulder(colb,rowb);}
    let testWallMaker = function(colw,roww){return new Wall(colw,roww);}
    let testBoulderArray = [];
    //WASD of currentstate, check if duplicate
    //build new boulderarray, char, dest objs from string and manipulate them
    //using existing functions
    //reuse import export funtions without affecting main canvas 
    let itemArray = currentState.trim().split("|").filter(item => item!="");
    
    function parseCurrent()
    {
        for(let i in itemArray)
        {
            if(i==0)
            {
                let dims = itemArray[i].split("x");
                let cols = Number(dims[0]);
                let rows = Number(dims[1]);
                testcanvas.width = cols*size;
                testcanvas.height = rows*size;
            }

            else
            {
                filt1 = itemArray[i].split(",").filter(item => item!="");
                let crtInstance = filt1[0];
                let col = Number(filt1[1]);
                let row = Number(filt1[2]);

                
                switch(crtInstance)
                {
                    case "Wall":
                        testBoulderArray.push(testWallMaker(col,row));
                        boulderArray.pop();
                        break;
                    case "Boulder":
                        testBoulderArray.push(testBoulderMaker(col,row));
                        boulderArray.pop();
                        break;
                    case "Destination":
                        testdest = new Destination(col,row);
                        break;
                    case "Character":
                        testchar = new Character(col,row);
                        break;
                }

                //masterObstacles[crtInstance][1](col,row);
            }
        }   
    }


    function dState()
    {   
        if (testchar.x + testchar.speed + testchar.width <= testcanvas.width) 
        {
          storePos = [testchar.col,testchar.row];
          testchar.col++;

          if(!testBoulderArray.some(boulder=>collision(testchar, boulder)))
          {
            
          }

          else
          {
            let thisBoulder=testBoulderArray.find(boulder=>collision(testchar,boulder));
            if(thisBoulder instanceof Boulder)
            { 
              thisBoulder.draw = function(){thisBoulder.updatePos();};
              thisBoulder.animateBoulderPush(testBoulderArray);
            }
            testchar.col--;s
          }
                      
        } 
        return exportConfig(testcanvas,testBoulderArray,testchar,testdest);
    }

    function sState()
    {
        if (testchar.y + testchar.speed + testchar.width <= testcanvas.height) {
          storePos = [testchar.col,testchar.row];
          testchar.row++;

          if(!testBoulderArray.some(boulder=>collision(testchar, boulder))){
           
          }

          else
          {
            let thisBoulder=testBoulderArray.find(boulder=>collision(testchar,boulder));
            if(thisBoulder instanceof Boulder)
            {
              thisBoulder.draw = function(){thisBoulder.updatePos();};
              thisBoulder.animateBoulderPush(testBoulderArray);
            }
            testchar.row--;
          }
        }
        return exportConfig(testcanvas,testBoulderArray,testchar,testdest);
    }

    function wState()
    {   
        if (testchar.y - testchar.speed >= 0) {
          storePos = [testchar.col,testchar.row];
          testchar.row--;

          if(!testBoulderArray.some(boulder=>collision(testchar, boulder))){
            
          }

          else
          { 
            let thisBoulder=testBoulderArray.find(boulder=>collision(testchar,boulder));
            if(thisBoulder instanceof Boulder)
            {
              thisBoulder.draw = function(){thisBoulder.updatePos();};
              thisBoulder.animateBoulderPush(testBoulderArray);
            }
            
            testchar.row++;
          } 
        }
        
        return exportConfig(testcanvas,testBoulderArray,testchar,testdest); 
    }

    function aState()
    {
        if (testchar.x - testchar.speed >= 0) {
          storePos = [testchar.col,testchar.row];
          testchar.col--;

          if(!testBoulderArray.some(boulder=>collision(testchar, boulder))){

          }
          else
          {
            let thisBoulder=testBoulderArray.find(boulder=>collision(testchar,boulder));
            if(thisBoulder instanceof Boulder)
            {
              thisBoulder.draw = function(){thisBoulder.updatePos();};
              thisBoulder.animateBoulderPush(testBoulderArray);
            }
            testchar.col++;
          }
        }
        return exportConfig(testcanvas,testBoulderArray,testchar,testdest);
    }

    parseCurrent();
    
    switch(direction)
    {
        case "up":
            return wState();
        case "down":
            return sState();
        case "left":
            return aState();
        case "right":
            return dState();
    }
    
}


function uniqueElms(data)
{
  return data.filter(function(a)
  {
    return data.indexOf(a) == data.lastIndexOf(a)
  });
}

function remove(array, element)
{
    return array.filter(e=>e!==element);
}

function getReachableStates(fromConfig)
{   
    let dirs = ["up","down","left","right"];
    let reachedStates = [fromConfig];

    for(let i in dirs)
    {
        reachedStates.push(reachableStates(fromConfig,dirs[i]));
    }

    return remove(uniqueElms(reachedStates),fromConfig);
}


function checkIfGoal(state)
{
    //if char at destination
    let charDest = state.split("|").filter(item => item!="");
    let char = charDest[charDest.length-2];
    let dest = charDest[charDest.length-1];

    let charCoords = char.split(",").filter(item => item!="");
    let charCol = Number(charCoords[1]);
    let charRow = Number(charCoords[2]);
   
    let destCoords = dest.split(",").filter(item => item!="");
    let destCol = Number(destCoords[1]);
    let destRow = Number(destCoords[2]);
    
    return (charCol==destCol && charRow==destRow)
}


/*
----------------------
----------------------
----------------------
----------------------
State Space Search Algorithms
----------------------
----------------------
----------------------
----------------------
*/

//Depth First Search
function DFS(state,depth)
{ 

    if(checkIfGoal(state))
    {
        return true;
    }

    if(depth<0)
    {
        return false;
    }

    else
    {
        let children = getReachableStates(state);
        //console.log(children)
        for(let i in children)
        {
            if(DFS(children[i],depth-1))
            {
                return true;
            }
        }
    }

    return false
}

//Iterative Deepening Depth First Search
function IDDFS(state,maxdepth)
{
    for(let i=0;i<=maxdepth;i++)
    {
        if(DFS(state,i))
        {
          return true;
        }
    }
    return false;
}
