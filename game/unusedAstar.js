/*
Heuristic:
A* to find shortest path from player to dest regardless of boulders.
How many boulders intersect that shortest path?
Best first search based on that score.
*/






//A*
function BoardNode(state)
{
    this.state = state;
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighborStates = [];
    this.previous = undefined; 

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

function removeInPlace(arr,elt)
{
    const index = arr.indexOf(elt);
    if(index !== -1){arr.splice(index,1)}
}



function Astar(startNode,heuristic)
{
    let closedSet = [];
    let openSet = [startNode];
    let path = [];

    while(openSet.length>0)
    {   
        let winner = 0;
        for(let i in openSet)
        {
            if(openSet[i].f < openSet[winner].f){winner = i;}
        }

        let current = openSet[winner];

        if(checkIfGoal(current.state))
        {   
            //Find Path
            let temp = current;
            path.push(temp);
            while(temp.previous!=undefined)
            {
                path.push(temp.previous);
                temp = temp.previous;
            }
            console.log("Done");
        }

        removeInPlace(openSet,current);
        closedSet.push(current);

        let neighbors = current.getNeighbors();
        for(let i in neighbors)
        {
            let neighbor = neighbors[i];
            if(!closedSet.includes(neighbor))
            {
                let tempG = current.g + 1;

                if(openSet.includes(neighbor) && tempG < neighbor.g)
                {
                    neighbor.g = tempG;
                }
                else
                {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
        console.log(openSet);
    }
}

//Heuristics 
function euclidean(stateNode)
{  
     let state = stateNode.state;
     let charDestCoords = parseCharDest(state);
     let distance = function(x1,y1,x2,y2){
        return Math.hypot(Math.abs(x2-x1),Math.abs(y2-y1))
     }

     return distance(charDestCoords[0][0],charDestCoords[0][1],charDestCoords[1][0],charDestCoords[1][1]);
}

function manhattan(stateNode)
{
    let state = stateNode.state;
    let charDestCoords = parseCharDest(state);
    return Math.abs(charDestCoords[0][0]-charDestCoords[1][0])+Math.abs(charDestCoords[0][1]-charDestCoords[1][1]);
}

//Iterative Deepening A*

//Depth Limited Search
function DFS(state,depth)
{ 
    let visited = [];
    let path = {};
    let finalstate;
    function search(state,depth)
    {
        if(checkIfGoal(state))
        {   
            finalstate = state;
            return true;
        }

        visited.push(state);
        
        if(depth<0)
        {
            return false;
        }


        else
        {
            let children = getReachableStates(state);
            //console.log(children)
            for(let i in children)
            {   if(!visited.includes(children[i]))
                {    
                    path[children[i]] = state;
                    if(search(children[i],depth-1))
                    {   
                        return true;
                    }
                }
            }
        }

        return false        
    }

    // let x =  search(state,depth);
    // console.log(visited,visited.length);
    // return x

    if(search(state,depth))
    {
        return [path,finalstate];
    }

    return false;
}


