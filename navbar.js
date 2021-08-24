const files = {
    HOME: 'home',
    ABOUT: 'about',
    PROJECTS: 'projects',
    GAMES: 'games'
}
Object.freeze(files) //To make it completely immutable
function run(file, gotoRoot) {
    let s = `<nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>                        
        </button>
        <a class="navbar-brand" href="` + ((gotoRoot)? '../':'') + `index.html">Alex's Alcove</a>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li` + ((file == files.HOME)? ` class="active"`:'') + `><a href="` + ((gotoRoot)? '../':'') + `index.html">Home</a></li>
          <li` + ((file == files.ABOUT)? ` class="active"`:'') + `><a href="` + ((gotoRoot)? '../':'') + `about.html">About</a></li>
          
          <li` + ((file == files.PROJECTS)? ` class="active"`:'') + ` class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="">Projects<span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="` + ((gotoRoot)? '../':'') + `projects.html">Projects Home</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `GameOfLife/game_of_life.html">Conway's Game of Life</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `Classes/class_tools.html">Class Tools</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `FRCRobotics/frc_tools.html">FRC Tools and Games</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `Fractal/fractal.html">Fractal Viewer</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `Calculus/calculus.html">Calculus Tools</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `Biology/dna.html">DNA Phylogeny</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `TicTacToe/tictactoe.html">Tic Tac Toe</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `Emulator/emulator.html">Emulator</a></li>
              <li><a href="` + ((gotoRoot)? '../':'') + `AI/snakegame_ai.html">Snake with AI</a></li>
              <li><a href="https://projects.alexanderdelaiglesia.com/Hangman/">Hangman</a></li>
              <li><a href="https://projects.alexanderdelaiglesia.com/Hangman-Multiplayer/">Hangman Multiplayer</a></li>
              <li><a href="https://graphvideo-1.delaminer.repl.co/">GraphVideo</a></li>
              <li role="separator" class="divider"></li>`
              // <li><a href="` + ((gotoRoot)? '../':'') + `physics.html">2D Physics</a></li>
              // <li><a href="` + ((gotoRoot)? '../':'') + `WebGL/webgame.html">Web Game</a></li>
              +`<li><a>More coming soon!</a></li>
            </ul>
          </li>
          <!--<li><a href="info.html">Info</a></li>-->
        `
        s += `</ul>
        <!--
        <ul class="nav navbar-nav navbar-right">
          <li><a href="#" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
          <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
        </ul>
        -->
      </div>
    </div>
    </nav>
    `
    document.getElementById("navbar").innerHTML = s
}