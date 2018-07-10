const bgCanvas = document.getElementById("bgCanv");

var wctx =bgCanvas.getContext("2d"),
    scrollImg = new Image(),
    imgWidth = 0,
    imgHeight =0,
    imageData = {},                                                                 
    scrollVal = 0,
    speed =0.3;



    scrollImg.src = "images/background.png";
    scrollImg.onload = loadImage;

function loadImage(){
    imgWidth = bgCanvas.width,
    imgHeight = bgCanvas.height;   
    render();                
}

function render(){
    //to update when gameCanvas changes
    imgWidth = bgCanvas.width,
    imgHeight = bgCanvas.height; 
    wctx.globalAlpha=0.4;
    //

    wctx.clearRect(0,0,bgCanvas.width,bgCanvas.height);

    if(scrollVal >= bgCanvas.width){
        scrollVal = 0;
    }

    scrollVal+=speed;                   
    wctx.drawImage(scrollImg,bgCanvas.width-scrollVal,0,scrollVal,imgHeight, 0, 0, scrollVal,imgHeight);
    wctx.drawImage(scrollImg,scrollVal,0,imgWidth, imgHeight);

     // To go the other way instead
     wctx.drawImage(scrollImg,-scrollVal,0,imgWidth, imgHeight);
     wctx.drawImage(scrollImg,bgCanvas.width-scrollVal,0,imgWidth, imgHeight);

    //setTimeout(function(){render();},10);
    requestAnimationFrame(render)
}