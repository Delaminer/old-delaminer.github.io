document.getElementById('json-read-paste').onclick = function() {
    var s = prompt('Paste your JSON here','json...')
}

var canvas = document.getElementById("json-read-graph")
var ctx = canvas.getContext("2d")
var width = canvas.width
var height = canvas.height
ctx.fillStyle = "#fff"
ctx.fillRect(0,0,width,height)
ctx.fillStyle = "#00f"

