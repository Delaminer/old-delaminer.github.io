let movesLeft = (board) => {
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if (board[i][j] == 0)
            return true
        }
    } 
    return false
}

let evaluate = (board, player, opponent) => {
    //Check for win state
    
    //Rows
    for (let row = 0; row < 3; row++)
    {
        if (board[row][0] == board[row][1] && board[row][1] == board[row][2])
        {
            if (board[row][0] == player)
                return +10;
            else if (board[row][0] == opponent)
                return -10;
        }
    }
    //Columns
    for (let col = 0; col < 3; col++)
    {
        if (board[0][col] == board[1][col] && board[1][col] == board[2][col])
        {
            if (board[0][col] == player)
                return +10;
            else if (board[0][col] == opponent)
                return -10;
        }
    }
    //Diagonals
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
    {
        if (board[0][0] == player)
            return +10;
        else if (board[0][0] == opponent)
            return -10;
    }
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0])
    {
        if (board[0][2] == player)
            return +10;
        else if (board[0][2] == opponent)
            return -10;
    }

    //No win, so return 0
    return 0
}

let minimax = (board, depth, max, player, opponent) => {
    score = evaluate(board, player, opponent)
    if (score != 0) return score
    if (!movesLeft(board)) return 0

    if (max) {
        let best = -99

        //Try each move
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if (board[i][j] == 0) { //only if it's open of course

                    board[i][j] = player //try the move

                    best = Math.max(best, minimax(board, depth + 1, !max, player, opponent)) //Find out how well that move is

                    board[i][j] = 0 //take back the move

                }
            }
        }

        return best
    }
    else {
        let best = 99

        //Try each move
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if (board[i][j] == 0) { //only if it's open of course

                    board[i][j] = opponent //try the move (for the opponent)

                    best = Math.min(best, minimax(board, depth + 1, !max, player, opponent)) //Find out how well that move is

                    board[i][j] = 0 //take back the move

                }
            }
        }
        
        return best
    }

}

let findMove = (board, player, opponent) => {
    let bestScore = -99
    let bestMove = {row: -1, col: -1}

    //Try each move
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if (board[i][j] == 0) { //only if it's open of course

                board[i][j] = player //try the move (for the opponent)

                let moveScore = minimax(board, 0, false, player, opponent) //Find out how well that move is

                board[i][j] = 0 //take back the move

                //If this move is better, use it
                if (moveScore > bestScore) {
                    bestScore = moveScore
                    bestMove.row = i
                    bestMove.col = j
                }

            }
        }
    }
    console.log(`best move has score ${bestScore}`)
    return bestMove
}

test = () => {
    // let board = [[ 'x', 'o', 'x' ],
    // [ 'o', 'o', 'x' ],
    // [ 0, 0, 0 ]];
    let board = [[ 1, 2, 1 ],
    [ 2, 2, 1 ],
    [ 0, 0, 0 ]];

    let best = findMove(board, 1, 2)
    console.log(`The best move is row ${best.row} and column ${best.col}.`)
}
// test()
map = {
    0: '',
    1: 'X',
    2: 'O',
}
let draw = () => {
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            grid[i][j].textContent = map[state[i][j]]
        }
    }
}
let click = function(i, j) {
    if (!active) return
    // grid[y][x].textContent = 'X'
    // if (state[y][x] == 0) {
    //     grid[y][x].textContent = 'X'
    //     state[y][x] = 1
    //     console.log(`Clicked ${x} and ${y} of ${JSON.stringify(state)}`)
    // }
    if (state[i][j] == 0) {
        state[i][j] = 1
        draw()
        let winner = evaluate(state, 1, 2)
        let stale = !movesLeft(state)
        if (!stale && winner == 0) {
            let bestMove = findMove(state, 2, 1)
            state[bestMove.row][bestMove.col] = 2
            draw()
        }
        winner = evaluate(state, 1, 2)
        stale = !movesLeft(state)
        if (stale || winner != 0) {
            active = false
            let s = 'Stalemate!'
            if (winner > 0) {
                s = 'You win!'
            }
            else if (winner < 0) {
                s = 'You lose!'
            }
            document.getElementById('status').textContent = s
        }
    }
}
let grid = []
let state = []
let active = false
let createBoxes = function(dom) {
    while(dom.firstChild) {
        dom.removeChild(dom.firstChild)
    }

    document.getElementById('status').textContent = ''

    grid = []
    state = []
    active = true
    for(let i = 0; i < 3; i++) {
        grid.push([])
        state.push([])
        let row = document.createElement('div')
        for(let j = 0; j < 3; j++) {
            let spot = document.createElement('button')
            // spot.textContent = ''
            // let t = Math.random()
            // if (t > 0.7) {
            //     spot.textContent = 'X'
            // }
            // else if (t > 0.4) {
            //     spot.textContent = 'O'
            // }
            spot.classList.add('box')
            spot.onclick = function() { click(i, j) }
            row.appendChild(spot)
            grid[i].push(spot)
            state[i].push(0)
        }
        dom.appendChild(row)
    }
}

// createBoxes(document.getElementById('boxes'))

document.getElementById('play1').onclick = function() {
    createBoxes(document.getElementById('boxes'))
}
document.getElementById('play2').onclick = function() {
    createBoxes(document.getElementById('boxes'))
    state[(Math.random() > 0.5) ? 0 : 2][(Math.random() > 0.5) ? 0 : 2] = 2
    draw()
}

//Debug:
createBoxes(document.getElementById('boxes'))
for(i in state) {
    for(j in state[i]) {
        let r = 0
        let rr = Math.random()
        if (rr > 0.7) r = 1
        else if (rr > 0.4) r = 2
        state[i][j] = r
    }
}
draw()
//https://www.youtube.com/watch?v=Rzhcb4M9-0Q