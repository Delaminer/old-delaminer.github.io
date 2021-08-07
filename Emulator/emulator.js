c = 100
log = (s) => {
    if (c-- > 0) {
        console.log(s)
    }
}
c1 = 900
c2 = []
slog = (s) => {
    if (c1-- > 0) {
        c2.push(s)
    }
    else if (c > -10) {
        c = -30
        console.log(c2.join('\n'))
    }
}
function getBinary(url, onload) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";

    req.onload = (e) => {
        var arrayBuffer = req.response;
        if (arrayBuffer) {
            onload(new Uint8Array(arrayBuffer))
        }
    };

    req.send(null);
}
function lead(s, size) {
    while (s.length < size) s = "0" + s;
    return s;
}
function hexer(num, size) {
    return '0x'+lead(num.toString(16), size)
}
class Chip8 {
    constructor(game, resolutionScale, ctx) {
        this.memory = []
        for(let i = 0; i < 4096; i++) {
            this.memory.push(0)
        }
        this.soundTimer = 0
        this.delayTimer = 0
        this.halt = false
        this.haltX = 0
        this.paused = false
        this.draw = false
        this.I = 0
        this.V = []
        for(let i = 0; i < 16; i++) {
            this.V.push(0)
        }
        this.gfx = []
        for(let i = 0; i < 64; i++) {
            let temp = []
            for(let j = 0; j < 32; j++) {
                temp.push(0)
            }
            this.gfx.push(temp)
        }
        this.resolutionScale = resolutionScale
        this.drawImageData = ctx.createImageData(64 * resolutionScale, 32 * resolutionScale);
        this.ctx = ctx
        this.pc = 0x200
        // this.colors = [[0x60,0x60,0x60,0xFF],[0xD6,0xED,0x17,0xFF]] //Yellow and gray
        this.colors = [[0x00,0x20,0x3F,0xFF],[0xAD,0xEF,0xD1,0xFF]] //Navy and mint
        this.fonts = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80, // F

            //Full: F0, Bar1: 80, Bar2: 10, Both: 90

            0xF0, 0x80, 0xB0, 0x90, 0xF0, // G
            0x90, 0x90, 0xF0, 0x90, 0x90, // H
            0xE0, 0x40, 0x40, 0x40, 0xE0, // I
            0x70, 0x20, 0x20, 0xA0, 0xE0, // J
            0x90, 0xA0, 0xC0, 0xA0, 0x90, // K

            0x80, 0x80, 0x80, 0x80, 0xf0, // L
            0xB0, 0xF0, 0xD0, 0x90, 0x90, // M
            0x90, 0xD0, 0xB0, 0xB0, 0x90, // N
            0xF0, 0x90, 0x90, 0x90, 0xF0, // O
            0xF0, 0x90, 0xF0, 0x80, 0x80, // P
            0xF0, 0x90, 0x90, 0xB0, 0xF0, // Q
            0xF0, 0x90, 0xE0, 0x90, 0x90, // R
            0x70, 0x80, 0x60, 0x10, 0xE0, // S

            0xE0, 0x40, 0x40, 0x40, 0x40, // T
            0x90, 0x90, 0x90, 0x90, 0xF0, // U
            0x90, 0x90, 0x90, 0x60, 0x60, // V
            0x90, 0x90, 0xB0, 0xF0, 0x50, // W
            0x90, 0x90, 0x60, 0x90, 0x90, // X

            0xA0, 0xA0, 0x40, 0x40, 0x40, // Y
            0xF0, 0x10, 0x60, 0x80, 0xF0, // Z
        ];
        for(let i = 0; i < this.fonts.length; i++) {
            this.memory[i] = this.fonts[i]
        }
        
        this.stop = []
        this.loadGame(game)
        
        this.stack = []
        this.stackPointer = 0

        this.keyDict = {
            'Digit1': 0x1,
            'Digit2': 0x2,
            'Digit3': 0x3,
            'Digit4': 0xC,
            'KeyQ': 0x4,
            'KeyW': 0x5,
            'KeyE': 0x6,
            'KeyR': 0xD,
            'KeyA': 0x7,
            'KeyS': 0x8,
            'KeyD': 0x9,
            'KeyF': 0xE,
            'KeyZ': 0xA,
            'KeyX': 0x0,
            'KeyC': 0xB,
            'KeyV': 0xF
        }
        this.keys = []
        for(let i in this.keyDict) {
            this.keys.push(false)
        }
        document.addEventListener('keyup', (e) => {
            let key = this.keyDict[e.code]
            if (key != undefined && key != null) {
                this.keys[key] = false
            }
        })
        document.addEventListener('keydown', (e) => {
            let key = this.keyDict[e.code]
            if (key != undefined && key != null) {
                this.keys[key] = true
            }
        })
        this.clearGraphics()

        //Create audio manager
        this.audio = new(window.AudioContext || window.webkitAudioContext)()
        this.beep = (volume, frequency, type, duration) => {
            let oscillator = this.audio.createOscillator()
            let gainNode = this.audio.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audio.destination)

            gainNode.gain.value = volume
            oscillator.frequency.value = frequency
            oscillator.type = type

            oscillator.start()

            setTimeout(() =>  { oscillator.stop() }, duration)
        }
    }
    loadGame = (game) => {
        this.stop.forEach(v => clearInterval(v))
        getBinary(game, (byteArray) => {
            for (var i = 0; i < byteArray.byteLength; i++) {
                this.memory[i + 0x200] = byteArray[i]
            }
            this.onload()
        })
        this.pc = 0x200
        this.clearGraphics()
        this.V = []
        for(let i = 0; i < 16; i++) {
            this.V.push(0)
        }
        this.I = 0
        this.soundTimer = 0
        this.delayTimer = 0
        this.stack = []
        this.stackPointer = 0
        this.draw = false
        // this.log = []
    }
    loop = () => {
        if (this.paused) return
        //1: Cycle
        //2: Graphics
        //3: Input

        this.codeCycle()
        if (this.draw)
            this.drawGraphics()
        this.handleInput()
    }
    codeCycle = () => {
        if (this.halt) {
            //We are waiting on input, so do not do important stuff until then.
            let key = -1
            for(let i in this.keys) {
                if (this.keys[i]) {
                    key = i
                    this.halt = false
                }
            }
            this.V[this.haltX] = key
            if (this.halt) return
        }

        //Get opcode
        this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1]

        // let printedData = `PC[${hexer(this.pc, 4)}] OP[${hexer(this.opcode, 4)}] I[${hexer(this.I, 4)}] V[${this.V.map(n => hexer(n, 2)).join(', ')}]`
        // this.log.push(hexer(this.opcode, 4))
        //Run command
        this.runCommand()

        if (this.soundTimer > 1) {
            this.soundTimer = 0
            //Play sound!
            this.beep(0.02, 1500, 'sine', 100)
        }
        this.pc += 2
    }
    drawGraphics = () => {
        this.draw = false
        this.ctx.putImageData(this.drawImageData, 0, 0);
    }
    redrawGraphics = () => {
        for(let x = 0; x < 64; x++) {
            for(let y = 0; y < 32; y++) {
                this.setPixel(x, y, this.gfx[x][y])
            }
        }
        this.drawGraphics()
    }
    clearGraphics = () => {
        for(let x = 0; x < 64; x++) {
            for(let y = 0; y < 32; y++) {
                this.setPixel(x, y, 0)
                this.gfx[x][y] = 0
            }
        }
        this.drawGraphics()
    }
    setPixel = (x, y, color) => {
        color = this.colors[color]
        // log(`Drawing pixel ${x},${y} for ${a}`)
        for(let sx = 0; sx < this.resolutionScale; sx++) {
            let scaledX = x * this.resolutionScale + sx
            for(let sy = 0; sy < this.resolutionScale; sy++) {
                let scaledY = y * this.resolutionScale + sy
                let coord = (scaledY * width * this.resolutionScale + scaledX) * 4
                this.drawImageData.data[coord] = color[0]
                this.drawImageData.data[coord + 1] = color[1]
                this.drawImageData.data[coord + 2] = color[2]
                this.drawImageData.data[coord + 3] = color[3]
            }
        }
    }
    handleInput = () => {
        //Nothing actually has to be done here, since the event listeners already handle input.
    }
    runCommand = () => {
        switch(this.opcode & 0xF000) {
            case 0x0000: {
                let subCommand = this.opcode & 0x00FF
                if (subCommand == 0x00E0) { //0x00E0: Clear graphics
                    this.clearGraphics()
                }
                else if (subCommand == 0x00EE) { //0x00EE: Return from subroutine
                    this.pc = this.stack.pop()
                }
                else {
                    console.log(`${this.opcode} Unkown 00 opcode ${hexer(this.opcode, 4)}`)
                }
            }
            break
            case 0x1000: { //1NNN: jump to address
                this.pc = (this.opcode & 0x0FFF) - 2
            }
            break
            case 0x2000: { //2NNN: Call subroutine
                this.stack.push(this.pc)
                this.pc = (this.opcode & 0x0FFF) - 2

            }
            break
            case 0x3000: { //3XNN: Skip if equal
                let x = (this.opcode & 0x0F00) >> 8
                let nn = this.opcode & 0x00FF
                if (this.V[x] == nn)
                    this.pc += 2
            }
            break
            case 0x4000: { //4XNN: Skip if not equal
                let x = (this.opcode & 0x0F00) >> 8
                let nn = this.opcode & 0x00FF
                if (this.V[x] != nn)
                    this.pc += 2
            }
            break
            case 0x5000: { //5XY0: Skip if two registers are equal
                let x = (this.opcode & 0x0F00) >> 8
                let y = (this.opcode & 0x00F0) >> 4
                if (this.V[x] == this.V[y])
                    this.pc += 2
            }
            break
            case 0x6000: { //6XNN: Set value
                let x = (this.opcode & 0x0F00) >> 8
                let nn = this.opcode & 0x00FF
                this.V[x] = nn
            }
            break
            case 0x7000: { //7XNN: Add value
                let x = (this.opcode & 0x0F00) >> 8
                let nn = this.opcode & 0x00FF
                this.V[x] += nn
                this.V[x] %= 256
            }
            break
            case 0x8000: { //8XY?: Math functions
                let subCommand = this.opcode & 0x000F
                let x = (this.opcode & 0x0F00) >> 8
                let y = (this.opcode & 0x00F0) >> 4
                switch(subCommand) {
                    case 0: { //Assign
                        this.V[x] = this.V[y]
                    }
                    break;
                    case 1: { //Or
                        this.V[x] |= this.V[y]
                    }
                    break;
                    case 2: { //And
                        this.V[x] &= this.V[y]
                    }
                    break;
                    case 3: { //Xor
                        this.V[x] ^= this.V[y]
                    }
                    break;
                    case 4: { //Add
                        this.V[x] += this.V[y]
                        this.V[0xF] = (this.V[x] > 255)? 1 : 0
                        this.V[x] %= 256
                    }
                    break;
                    case 5: { //Subtract
                        this.V[x] += 256 - this.V[y]
                        this.V[0xF] = (this.V[x] < 256)? 0 : 1
                        this.V[x] %= 256
                    }
                    break;
                    case 6: { //Shift right
                        this.V[0xF] = this.V[x] & 1
                        this.V[x] >>= 1
                    }
                    break;
                    case 7: { //Reverse or y-x
                        this.V[x] = 256 + this.V[y] - this.V[x]
                        this.V[0xF] = (this.V[x] < 256)? 0 : 1
                        this.V[x] %= 256
                    }
                    break
                    case 0xE: { //Shift left
                        this.V[0xF] = (this.V[x] & 0b10000000) >> 7
                        this.V[x] = (this.V[x] << 1) % 256
                    }
                    break;
                }
            }
            break
            case 0x9000: { //9XY0: Skip if registers are not equal
                let x = (this.opcode & 0x0F00) >> 8
                let y = (this.opcode & 0x00F0) >> 4
                if (this.V[x] != this.V[y])
                    this.pc += 2

            }
            break
            case 0xA000: { //ANNN: Set I to NNN
                this.I = this.opcode & 0x0FFF
            }
            break
            case 0xB000: { //BNNN: Jump to NNN=V0
                this.pc = this.V[0] + (this.opcode & 0x0FFF) - 2
            }
            break
            case 0xC000: { //CXNN: Random
                let x = (this.opcode & 0x0F00) >> 8
                let nn = this.opcode & 0x00FF
                this.V[x] = Math.floor(Math.random() * 256) & nn
            }
            break
            case 0xD000: { //DXYN: Draw
                let x = (this.opcode & 0x0F00) >> 8
                let y = (this.opcode & 0x00F0) >> 4
                let n = this.opcode & 0x000F

                this.V[0xF] = 0

                for(let dy = 0; dy < n; dy++) {
                    let row = this.memory[this.I + dy]
                    for(let dx = 0; dx < 8; dx++) {
                        let pixelX = (this.V[x] + dx) % 64
                        let pixelY = (this.V[y] + dy) % 32
                        let data = (row & (0b10000000 >> dx)) >> (7 - dx)
                        if (data == 1) {
                            this.gfx[pixelX][pixelY] ^= 1
                            this.V[0xF] = (this.gfx[pixelX][pixelY] == 0)? 1 : 0
                            this.setPixel(pixelX, pixelY, this.gfx[pixelX][pixelY])
                        }
                    }
                }
                this.draw = true
            }
            break
            case 0xE000: { //EX??: Keyboard functions
                let subCommand = this.opcode & 0x00FF
                let x = (this.opcode & 0x0F00) >> 8
                if (subCommand == 0x9E) { //EX9E: Skip if keyboard
                    if (this.keys[this.V[x]])
                        this.pc += 2
                }
                else if (subCommand == 0xA1) { //EX9E: Skip if not keyboard
                    if (!this.keys[this.V[x]])
                        this.pc += 2
                }
                else {
                    console.log(`Unkown EX opcode ${this.opcode}`)
                }
            }
            break
            case 0xF000: { //FX??: Extra functions
                let subCommand = this.opcode & 0x00FF
                let x = (this.opcode & 0x0F00) >> 8
                switch(subCommand) {
                    case 0x07: { //FX07: Get delay timer
                        this.V[x] = this.delayTimer
                    }
                    break
                    case 0x0A: { //FX0A: Get input halt

                        this.halt = true
                        this.haltX = x

                        // let key = -1
                        // let flag = true
                        // while(flag) {
                        //     this.handleInput()
                        //     for(let i in this.keys) {
                        //         if (this.keys[i]) {
                        //             key = i
                        //             flag = false
                        //         }
                        //     }
                        // }
                        // this.V[x] = key
                    }
                    break
                    case 0x15: { //FX15: Set delay timer
                        this.delayTimer = this.V[x]
                    }
                    break
                    case 0x18: { //FX18: Set sound timer
                        this.soundTimer = this.V[x]
                    }
                    break
                    case 0x1E: { //FX1E: Add memory
                        this.I += this.V[x]
                    }
                    break
                    case 0x29: { //FX15: Set memory to sprite
                        this.I = 5 * this.V[x]
                    }
                    break
                    case 0x33: { //FX33: Binary to decimal
                        this.memory[this.I] = Math.floor(this.V[x] / 100)
                        this.memory[this.I + 1] = Math.floor(this.V[x] % 100 / 10)
                        this.memory[this.I + 2] = this.V[x] % 10
                    }
                    break
                    case 0x55: { //FX55: Save to memory
                        for(let i = this.I; i < this.I + x + 1; i++) {
                            this.memory[i] = this.V[i - this.I]
                        }
                    }
                    break
                    case 0x65: { //FX65: Load memory
                        for(let i = this.I; i < this.I + x + 1; i++) {
                            this.V[i - this.I] = this.memory[i]
                        }
                    }
                    break
                }
            }
            break
        }
    }
    setColor = (color, index, redraw) => {
        this.colors[index] = color
        if (redraw) {
            this.redrawGraphics()
        }
    }
    togglePlay = () => {
        this.paused = !this.paused
    }
}
let scale = 20
let width = 64
let height = 32
var canvas = document.getElementById('emulator');
var ctx = canvas.getContext('2d');
canvas.width = scale * width
canvas.height = scale * height
let game = ''
game = 'games/SpaceInvaders.ch8'
let chip = new Chip8(game, scale, ctx)
chip.onload = () => {
    //Run the code as fast as possible
    chip.stop[0] = setInterval(() => {
        chip.loop()
    }, 1)
    
    //Real time delay (60 Hz)
    chip.stop[1] = setInterval(() => {
        if (chip.delayTimer > 0) {
            chip.delayTimer--
        }
    }, 17)
}
let games = [
    'Airplane.ch8',
    'hello.ch8',
    'Cave.ch8',
    'Brick.ch8',
    'SpaceInvaders.ch8',
    'Tetris.ch8',
    'Tic-Tac-Toe.ch8',
    // 'CA VE',
    '15PUZZLE',
    'BLINKY',
    'BLITZ',
    'BRIX',
    'CONNECT4',
    'GUESS',
    'HIDDEN',
    'INVADERS',
    'KALEID',
    'MAZE',
    'MERLIN',
    'MISSILE',
    'PONG',
    'PONG2',
    'PUZZLE',
    'SYZYGY',
    'TANK',
    'TETRIS',
    'TICTAC',
    'UFO',
    'VBRIX',
    'VERS',
    'WIPEOFF'
]
let loadGames = document.getElementById('loadGamesButton')
games.forEach((v) => {
    //<li><a href="#">Another action</a></li>
    let base = document.createElement('li')
    let selector = document.createElement('a')
    selector.textContent = v
    selector.onclick = () => {
        //Load this game.
        chip.loadGame('games/' + v)
        game = 'games/' + v
    }
    base.appendChild(selector)
    loadGames.appendChild(base)
})
// loadGames.appendChild
document.getElementById('play/pause').onclick = () => {
    chip.togglePlay()
    document.getElementById('play/pause').textContent = chip.paused? 'Resume Game' : 'Pause Game'
}
document.getElementById('fullscreen').onclick = () => {
    canvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    canvas.mozRequestFullScreen();
    canvas.msRequestFullscreen();
    canvas.requestFullscreen();
}
document.getElementById('reboot').onclick = () => {
    chip.loadGame(game)
}
const getRGB = color => [0, 1, 2].map((v, i) => parseInt(color.substring(1 + 2 * i, 3 + 2 * i), 16)).concat([255])
document.getElementById('back-color').addEventListener('input', (e) => {
    chip.setColor(getRGB(e.target.value), 0, true)
})
document.getElementById('fore-color').addEventListener('input', (e) => {
    chip.setColor(getRGB(e.target.value), 1, true)
})
const changeWindowSize = (size) => {
    scale = size
    chip.resolutionScale = scale
    chip.drawImageData = chip.ctx.createImageData(64 * scale, 32 * scale);
    canvas.width = scale * width
    canvas.height = scale * height
    chip.redrawGraphics()
}
document.getElementById('windowSize').onchange = () => {
    changeWindowSize(document.getElementById('windowSize').value)
}
const download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}
document.getElementById('save-state').onclick = () => {
    let gameState = {
        'paused': chip.paused,
        'pc': chip.pc,
        'gfx': chip.gfx,
        'V': chip.V,
        'I': chip.I,
        'soundTimer': chip.soundTimer,
        'delayTimer': chip.delayTimer,
        'stack': chip.stack
    }
    data = {
        'game': game,
        'backgroundColor': chip.colors[0],
        'foregroundColor': chip.colors[1],
        'gameWindowSize': scale,
        'gameState': gameState
    }
    
    download('emulatorState.json', JSON.stringify(data))
}
document.getElementById('upload-state-file').onchange = () => {
    let files = document.getElementById('upload-state-file').files
    if (files.length > 0) { //There must be a file...
        let fr = new FileReader()
        fr.onload = (e) => {
            let data = JSON.parse(e.target.result)
            //Use data
            let backgroundColor = data['backgroundColor']
            let foregroundColor = data['foregroundColor']
            let gameWindowSize = data['gameWindowSize']
            let gameState = data['gameState']
            if (data['game'] != undefined) {
                game = data['game']
                chip.loadGame(game)
            }
            if (backgroundColor != undefined) {
                document.getElementById('back-color').value = '#' + backgroundColor.slice(0, 3).map(v => hexer(v, 2).substring(2)).join('')
                chip.setColor(backgroundColor, 0, true)
            }
            if (foregroundColor != undefined) {
                document.getElementById('fore-color').value = '#' + foregroundColor.slice(0, 3).map(v => hexer(v, 2).substring(2)).join('')
                chip.setColor(foregroundColor, 1, true)
            }
            if (gameWindowSize != undefined) {
                changeWindowSize(gameWindowSize)
                document.getElementById('windowSize').value = gameWindowSize
            }
            if (gameState != undefined) {
                //TODO: add game state import
                chip.pc = gameState.pc
                chip.V = []
                for(let i = 0; i < gameState.V.length; i++) {
                    chip.V.push(gameState.V[i])
                }
                for(let i = 0; i < gameState.gfx.length; i++) {
                    for(let j = 0; j < gameState.gfx[i].length; j++) {
                        chip.gfx[i][j] = gameState.gfx[i][j]
                    }
                }
                chip.redrawGraphics()
                chip.I = gameState.I
                chip.soundTimer = gameState.soundTimer
                chip.delayTimer = gameState.delayTimer
                chip.stack = []
                for(let i = 0; i < gameState.stack.length; i++) {
                    chip.stack.push(gameState.stack[i])
                }
                chip.paused = gameState.paused
                document.getElementById('play/pause').textContent = gameState.paused? 'Resume Game' : 'Pause Game'
            }
            document.getElementById('upload-state-file').value = ''
        }
        fr.readAsText(files.item(0))
    }
}
document.getElementById('upload-state').onclick = () => {
    document.getElementById('upload-state-file').click()
}

//https://gergelykonczdotcom.wordpress.com/2014/07/20/draw-binary-image-to-the-html5-canvas/
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
//https://raw.githubusercontent.com/JamesGriffin/CHIP-8-Emulator/master/roms/BLITZ.ch8
