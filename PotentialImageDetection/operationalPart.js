$(document).ready(function() {
    var imageField = document.getElementById("picture");
    var ctx = imageField.getContext('2d');
    
    $("#picture").mousedown( MouseDrawStart );
    $("#picture").mousemove( MouseDraw );
    $(document).mouseup( MouseDrawEnd );
    $("#clearButton").click( ClearDrawingArea );
    $("#addButton").click( AddExample );
    $("#recognizeButton").click( CompareDistances );
    $("#resetButton").click( ResetEducation );
    
    var MouseFlag = false;
    var classes = {};
    
    ClearDrawingArea();
    
    function CompareDistances()
    {
        var minDistance = 0;
        var closestClass;
        var recognizingMap = MakingPixelMap();
        $.each(classes, function( index, value )
        {
            var averageDistance = 0;
            for ( var i=0; i<value.length; i++ ) {
                averageDistance += EuclideanDistance( recognizingMap, value[i] );
            }
            averageDistance /= value.length;
            if ( (closestClass == undefined) || (averageDistance < minDistance) ) {
                closestClass = index;
                minDistance = averageDistance;
            }
        } );
        $(".modal-body").text("Ближайший класс: " + closestClass);
        $("#modalClassify").modal('show');
    }
    
    function EuclideanDistance( map1, map2 )
    {
        var sum = 0;
        for( var i=0; i<imageField.height; i++)
            for( var j=0; j<imageField.width; j++) {
                sum+= Math.pow(map1[i][j]-map2[i][j], 2);
            }
        return Math.sqrt(sum);
    }
    
    function ResetEducation( )
    {
        classes = {};
        ClearDrawingArea();
        $("#classNameInput").val("");
    }
    
    function AddExample( )
    {
        var currentClass = $("#classNameInput").val();
        if ( classes[currentClass] != undefined ) {
            var classExamples = classes[currentClass];
        } else classExamples = [];
        classExamples.push( MakingPixelMap() );
        classes[currentClass] = classExamples;
        $("#classNameInput").val("");
        ClearDrawingArea();
    }
    
    function MouseDrawStart( event )
    {
        MouseFlag = true;
        ctx.fillRect(event.offsetX, event.offsetY, 5, 5);
    }
    
    function MouseDraw( event )
    {
        if (MouseFlag) {
            ctx.fillRect(event.offsetX, event.offsetY, 5, 5);
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
        var pixelMap = ctx.getImageData(0, 0, imageField.width, imageField.height).data;
        var w=0, h=0;
        for (var i=0; i < pixelMap.length; i+=4) {
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
                row = [];
            }
                
        }
        if ($("#methodType2").attr('checked') != undefined ) {
            map = ImprovingPixelMap(map);
        }
        return map;
    }
    
    function ImprovingPixelMap( map )
    {
        var improvedMap = map;
        for (var i=1; i<imageField.height-1; i++)
            for (var j=1; j<imageField.width-1; j++) {
                if (map[i + 1] != undefined) {
                    if (map[i + 1][j-1] != undefined) {
                        improvedMap[i][j] += map[i + 1][j-1] * 0.5;
                    }
                    if (map[i + 1][j] != undefined) {
                        improvedMap[i][j] += map[i + 1][j] * 0.5;
                    }
                    if (map[i + 1][j + 1] != undefined) {
                        improvedMap[i][j] += map[i + 1][j + 1] * 0.5;
                    }
                }
                if (map[i - 1] != undefined) {
                    if (map[i - 1][j - 1] != undefined) {
                        improvedMap[i][j] += map[i - 1][j - 1] * 0.5;
                    }
                    if (map[i - 1][j] != undefined) {
                        improvedMap[i][j] += map[i - 1][j] * 0.5;
                    }
                    if (map[i - 1][j + 1] != undefined) {
                        improvedMap[i][j] += map[i - 1][j + 1] * 0.5;
                    }
                }
                if (map[i][j - 1] != undefined) {
                    improvedMap[i][j] += map[i][j - 1] * 0.5;
                }
                if (map[i][j + 1] != undefined) {
                    improvedMap[i][j] += map[i][j + 1] * 0.5;
                }
            } 
        return improvedMap;
    }
});
