/*
optimise with sorting lists and binary searchin them

ideas:
can impose time limit, depth limit
prune DFS with heureistics (applying a preference to some of your (children) nodes over others, right)
try other searvh algs

make AI choose between DFS/BFS depending on puzzle size

neural netwrok
*/

function getInitialState()
{
    return exportConfig(canvas,boulderArray,char,endgoal);
}

function parseCharDest(state)
{
    let charDest = state.split("|").filter(item => item!="");
    let char = charDest[charDest.length-2];
    let dest = charDest[charDest.length-1];

    let charCoords = char.split(",").filter(item => item!="");
    let charCol = Number(charCoords[1]);
    let charRow = Number(charCoords[2]);
   
    let destCoords = dest.split(",").filter(item => item!="");
    let destCol = Number(destCoords[1]);
    let destRow = Number(destCoords[2]);

    return [[charCol,charRow],[destCol,destRow]]
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
Search Algorithms
----------------------
----------------------
----------------------
----------------------
*/

//Node object
function BoardNode(state)
{
    this.state = state;
    this.depth = 0;
    this.previous = undefined;

    this.neighborStates = [];

    this.getNeighbors = function()
    {
        let children = getReachableStates(this.state);
        for(let i in children)
        {
            this.neighborStates.push(new BoardNode(children[i]));
        }
        return this.neighborStates;
    }   
}



//Depth Limited Search
function DFS(state,depth)
{ 
    this.name = "Depth First Search";
    let visited = [];
    let finalNode;
    let newNode;
    function search(node,depth)
    {
        if(checkIfGoal(node.state))
        {   
            finalNode = node;
            return true;
        }

        visited.push(node);
        
        if(depth<0)
        {
            return false;
        }


        else
        {
            let children = node.getNeighbors();
            //console.log(children)
            for(let i in children)
                
            {   
                newNode = children[i];
                if(!visited.some(node=>node.state==newNode.state))
                {    
                    newNode.previous = node;
                    if(search(newNode,depth-1))
                    {   
                        return true;
                    }
                }
            }
        }

        return false        
    }

    if(search(new BoardNode(state),depth))
    {
        return finalNode;
    }

    return false;
}



//Iterative Deepening Depth First Search
function IDDFS(state,maxdepth)
{   
    this.name = "Iterative Deepening Depth First Search";
    for(let i=0;i<=maxdepth;i++)
    {
        let result = DFS(state,i);
        if(result!=false)
        {
          return result;
        }
    }
    return false;
}


//Breadth First Search
function BFS(state,maxdepth)
{   
    this.name = "Breadth First Search";

    let queue = [new BoardNode(state)];
    let visited = [];
    let explore;
    let finalstate;

    while(queue.length>0)
    {
        explore = queue.shift();
        visited.push(explore);

        //console.log(explore);
        if(checkIfGoal(explore.state))
        {   
            finalNode = explore;
            return finalNode;
        }

        if(explore.depth>=maxdepth)
        {
            break;
        }

        let children = explore.getNeighbors();
        for(let i in children)
        {
            let newNode = children[i];
            if(!visited.some(node=>node.state==newNode.state))
            {   
                newNode.previous = explore;
                newNode.depth = explore.depth+1;
                queue.push(newNode);
            }
        }
        console.log(explore.depth);
    }
    return false;
}




/*
----------------------
----------------------
----------------------
----------------------
Display the solution
----------------------
----------------------
----------------------
----------------------
*/



function solve(startConfig,searchAlg,depth)
{
    let f = searchAlg(startConfig,depth);
    if(f===false)
    {
        alert("No solution found within depth " + depth + " using " + searchAlg.name);
    }
    else
    {
        let path = getPath(f);
        animateSoln(path,500);
        return path;  
    }

}

function getPath(finalNode)
{
    let path = [];
    let curr = finalNode;
    while(curr!=undefined)
    {
        //console.log(curr);
        path.push(curr);
        curr = curr.previous;
    }
    return path.reverse()
}

function animateSoln(path,ms)
{   
    let i=0;
    setInterval(function()
    {
        if(i>=path.length)
        {
            clearInterval()
        }
        else
        {
            console.log(path[i].state);
            importConfig(path[i].state);
            i++;
        } 
    },ms)
}



