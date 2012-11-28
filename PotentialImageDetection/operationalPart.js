$(document).ready(function() {
    var imageField = document.getElementById("picture");
    var ctx = imageField.getContext('2d');
    
    $("#picture").mousedown(MouseDrawStart);
    $("#picture").mousemove(MouseDraw);
    $(document).mouseup(MouseDrawEnd);
    $("#clearButton").click(ClearDrawingArea);
    $("#addButton").click();
    
    var MouseFlag = false;
    
    function MouseDrawStart( event )
    {
        MouseFlag = true;
        ctx.fillRect(event.offsetX, event.offsetY, 5, 5)
        
    }
    
    function MouseDraw( event )
    {
        if (MouseFlag) {
            ctx.fillRect(event.offsetX, event.offsetY, 5, 5)
        }
    }
    
    function MouseDrawEnd( event )
    {
        MouseFlag = false;
    }
    
    function ClearDrawingArea()
    {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, imageField.width, imageField.height);
        ctx.fillStyle = "black";
    }
    
    function MakingPixelMap( )
    {
        var map = [];
        var row = [];
        var pixelMap = ctx.getImageData(0, 0, imageField.width, imageField.height);
        var w=0, h=0;
        for (var i=0; i < ctx.data.length; i+=4) {
            if (pixelMap[i] == 255 && pixelMap[i+1] == 255 && pixelMap[i+2] == 255) {
                
                row.push(0);
            } else {
                row.push(1);
            }
            w++;
            if ( !(w % imageField.width) ) {
                h++;
                w=0;
                map.push(row);
            }
                
        }
    }
});
