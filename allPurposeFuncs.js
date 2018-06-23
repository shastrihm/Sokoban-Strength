function findObsAt(obs,atcol,atrow)
{
  return (obs.col == atcol && obs.row == atrow)
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

function playGround()
{
    //for testing changes to mechanics
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
    let t1 = new Wormhole(4,2);
    let t2 = new Wormhole(2,4);
    let t3 = new Wormhole(6,6);s
    t1.linkTo(t2);
    t2.linkTo(t3);
    t3.linkTo(t1);
    char.col = 1;
    char.row = 1;
    redraw();
}
