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
    return exportConfig(canvas,allArrays);
}

function parseCharDest(state)
{   
    let inp_state = JSON.parse(state);
    return [inp_state["Character"][0],inp_state["Destination"][0]];

}

function reachableStates(currentState,direction)
{   
    function simulateMoveBehavior(currentState,dir,dirfunc,invfunc)
    {
      //dir: "w" "a" "s" or "d"
      //charimg: faceDown, faceUp, faceRight, faceLeft
      //dirfunc: e.g. function(){char.row++;} 
      //invfunc: e.g. function(){char.row--;}

      importConfig(currentState,true);
      storePos = [char.col,char.row];
      
      if(withinBounds(char.col,char.row))
      {
        dirfunc();
      }

      Wall.check(char);
      Wormhole.check(char)
      Ice.check(dir,char);

      update();

      if(!freeMove)
      {
        invfunc();
        update();
        freeMove = true;
      }
      return exportConfig(canvas,allArrays);
    }

    let dir, dirfunc, invfunc;
    switch(direction)
    {
        case "up":
            dir = "w";
            dirfunc = function(){char.row++};
            invfunc = function(){char.row--};
            break;
        case "down":
            dir = "s";
            dirfunc = function(){char.row--};
            invfunc = function(){char.row++};
            break;
        case "left":
            dir = "a";
            dirfunc = function(){char.col--};
            invfunc = function(){char.col++};
            break;
        case "right":
            dir = "d";
            dirfunc = function(){char.col++};
            invfunc = function(){char.col--};
            break;
    }
    
    return simulateMoveBehavior(currentState,dir,dirfunc,invfunc)
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
    let coords = parseCharDest(state);
    return (coords[0][0]==coords[1][0] && coords[0][1]==coords[1][1])
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



