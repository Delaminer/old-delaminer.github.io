document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37 || event.keyCode == 39){
        //next();
    }
});
function clickButton(){
    alert("Hello, I am a cat!");
}
function live(a){
    var n = new Array(a.length);
    for (var i = 0; i < a.length; i++) { 
        n[i] = []; 
    }
    for(var i=0;i<a.length;i++){
        for(var j=0;j<a[i].length;j++){
            //Calculate spot at (j,i)
            n[i][j] = isLiving(a[i][j],peopleNearby(a,i,j));
        }
    }
    return n;
}
function isLiving(alive, people){
    if (alive){
        return (people==2 || people==3);
    }
    else{
        return(people==3);
    }
}
function peopleNearby(a, i, j){
    var sum=0;
    if (i>0 && a[i-1][j]) sum++;
    if (i>0 && j>0 && a[i-1][j-1]) sum++;
    if (i>0 && j<a[i].length-1 && a[i-1][j+1]) sum++;
    if (i<a.length-1 && a[i+1][j]) sum++;
    if (i<a.length-1 && j<a[i].length-1 && a[i+1][j+1]) sum++;
    if (i<a.length-1 && j>0 && a[i+1][j-1]) sum++;
    
    if (j>0 && a[i][j-1]) sum++;
    if (j<a[i].length-1 && a[i][j+1]) sum++;
    return sum;
}
function drawGrid(){
    ctx.fillStyle = "00f"
    for(var horiz=1; horiz<ys;horiz++) {
        ctx.fillRect(horiz*x,0,1,canvas.height);
    }
    for(var vert=1; vert<xs;vert++) {
        ctx.fillRect(0,vert*y,canvas.width,1);
    }
}
function drawCanvas(canvas,boardState){
    var ctx = canvas;
    var a = boardState;
    for (var i = 0; i < a.length; i++) { 
        for (var j = 0; j < a[i].length; j++) 
        {
            ctx.fillStyle = a[i][j]?"#800":"#fff"
            ctx.fillRect(i*x,j*y,i*x+x,j*y+y);
            ctx.fillStyle = "#000000";
            ctx.font = "24px Arial";
            //ctx.fillText(xcx[0].toString()[0], (i)*x+(x/4), (j+1)*y-(y/10));
        }
    }
}
function update() {
    drawCanvas(ctx,a)
    if (graph) {
        drawGrid()
    }
}
var xs = 50;
var ys = 50;
var a = new Array(xs);
for (var i = 0; i < a.length; i++) { 
    a[i] = []; 
}
var s = "1010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010"
s = "0110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111100000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000001000000000000110000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
for (var i = 0; i < xs; i++) { 
    for (var j = 0; j < ys; j++) {
        //a[i][j] = s.charAt(j+i*xs)=="1"; //Read data
        a[i][j] = Math.random() > 0.5;
    }
}
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x=canvas.width / xs
var y=canvas.height / ys
drawCanvas(ctx,a);
function next(){
    a=live(a);
    update()
}
var t;
var player = document.getElementById("Player");
var playText = document.getElementById("play");
function pause(){
    player.classList.remove("glyphicon-pause")
    player.classList.add("glyphicon-play")
    playText.innerHTML = "Play";
    // player.src = "Images/GameOfLife/rightArrow.gif"
    clearInterval(t);
}
function play(){
    player.classList.remove("glyphicon-play")
    player.classList.add("glyphicon-pause")
    playText.innerHTML = "Pause";
    // player.src = "Images/GameOfLife/pause.gif"
    t=setInterval(next,100);
}
var toggled = false;
function toggle(){
    disableHints()
    if (toggled) {
        pause();
    }
    else {
        play();
    }
    toggled = !toggled;
}
function nextSlide(){
    disableHints()
    next()
}
function disableHints(){
    document.getElementById("helper").innerHTML = ""
}
disableHints()
var rect = document.getElementById("myCanvas").getBoundingClientRect();
canvas.addEventListener('mousedown', e => {
    if (graph) {
        rect = document.getElementById("myCanvas").getBoundingClientRect();
        var roundedX = e.clientX - rect.left - ((e.clientX - rect.left) % x)
        var roundedY = e.clientY - rect.top - ((e.clientY - rect.top) % y)
        var realX = Math.round(roundedX / x);
        var realY = Math.round(roundedY / y);
        a[realX][realY] = !a[realX][realY]
        drawCanvas(ctx,a)
        drawGrid()
    }
});
var graph = false
function toggleEdit(){
    disableHints()
    graph = !graph
    update()
}
function printData() {
    var data = ""
    for (var i = 0; i < xs; i++) { 
        for (var j = 0; j < ys; j++) {
            data += a[i][j]?"1":"0"
        }
    }
    document.getElementById("output").innerHTML = data
}
function readData() {
    var text = prompt("Enter your string of text to open:", "Text here (ex: 1010101000101001010100101001001010100)");
    if (text != null) {
        for (var i = 0; i < xs; i++) { 
            for (var j = 0; j < ys; j++) {
                a[i][j] = text.charAt(j+i*xs)=="1";
            }
        }
        update()
    }
}
function clearData() {
    for (var i = 0; i < xs; i++) { 
        for (var j = 0; j < ys; j++) {
            a[i][j] = false;
        }
    }
    update()
}
function randomData() {
    for (var i = 0; i < xs; i++) { 
        for (var j = 0; j < ys; j++) {
            a[i][j] = Math.random() > 0.5;
        }
    }
    update()
}
toggleEdit()