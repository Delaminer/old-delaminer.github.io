
<html><style> html, body {background-color: yellow} </style>
    <head>
	<link rel="icon" href="a_icon1.png" type="image/png" sizes="16x16">
        <title>Alex's Alcove</title>
        <script>
			document.addEventListener('keydown', function(event) {
				if (event.keyCode == 37){
					next();
				}
				else if (event.keyCode == 39){
					alert('riggg');
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
			function drawCanvas(canvas,boardState){
				var ctx = canvas;
				var a = boardState;
				for (var i = 0; i < a.length; i++) { 
					for (var j = 0; j < a[i].length; j++) 
					{ 
						//document.write(s[i+j] + " ");
						var xcx=a[i];
						if (xcx[j]){
							//green
							ctx.fillStyle = "#00df00";
						}else{
							ctx.fillStyle = "#fFa8ed";
						}
						ctx.fillRect(i*x,j*y,i*x+x,j*y+y);
						ctx.fillStyle = "#000000";
						ctx.font = "24px Arial";
						//ctx.fillText(xcx[0].toString()[0], (i)*x+(x/4), (j+1)*y-(y/10));
					}
				}
			}
		
        </script>
    </head>
    <body>
	<style type="text/css" media="all">
	   @import "styles.css";
	</style>
	<div class="topnav">
	  <a href="/">Home</a>
	  <a class="active" href="game_of_life.php">The Game of Life</a>
	  <a href="contact.php">Contact</a>
	  <a href="about.php">About</a>
	</div>
		<canvas id="myCanvas" width="650" height="440"
		style="border:1px solid #c3c3c3;">
		Your browser doesn't my canvas! :(
		</canvas>
        <script>
			var xs = 50;
			var ys = 50;
			var a = new Array(xs);
			for (var i = 0; i < a.length; i++) { 
				a[i] = []; 
			}
			var s = "1010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010"
			//var s = "avavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavavav"
			
			for (var i = 0; i < xs; i++) { 
				for (var j = 0; j < ys; j++) {
					//a[i][j] = s[i+j]=="1"; //Read data
					a[i][j] = Math.random() > 0.5; //Random
				}
			}
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext("2d");
			var x=canvas.width / xs
			var y=canvas.height / ys
			ctx.fillStyle = "#2Fa8ed";
			
			document.write("<br> "+(s[0])+"Numbers: "+s.length+"<br>"+Math.random());
			drawCanvas(ctx,a);
			function next(){
				//document.write("s is nextline:<br>"+a);
				a=live(a);
				//document.write("s is nextline:<br>"+a);
				drawCanvas(ctx,a);
			}
        </script>
		<br>
		<button onClick="next()">next</button>
    </body>
</html>