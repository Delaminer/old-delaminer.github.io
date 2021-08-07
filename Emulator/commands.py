import math
import random
# Check out this link:
# https://en.wikipedia.org/wiki/CHIP-8
#my 530, they 582
def _0(chip): #0NNN
    function = chip.opcode & 0x00FF
    if function == 0x00E0: #Clear screen
        chip.clearGraphics()
        chip.pc += 2
        pass
    elif function == 0x00EE: #Return from a subroutine
        # chip.sp -= 1
        # chip.pc = chip.stack[chip.sp]
        chip.pc = 2 + chip.stack.pop()
        pass
    else:
        print('Unkown 00 opcode {}'.format(chip.opcode))
        chip.pc += 2
    pass
def _1(chip): #1NNN
    # Jump to address NNN
    chip.pc = chip.opcode & 0x0FFF
    pass
def _2(chip): #2NNN
    # Calls subroutine at NNN
    # chip.stack[chip.sp] = chip.pc
    # chip.sp += 1
    # chip.pc = chip.opcode & 0x0FFF

    chip.stack.push(chip.pc)
    chip.pc = chip.opcode & 0x0FFF

    pass
def _3(chip): #3XNN
    # Skip the next instruction if Vx equals NN
    x = (chip.opcode & 0x0F00) >> 8
    nn = chip.opcode & 0x00FF
    chip.pc += 4 if chip.V[x] == nn else 2
    pass
def _4(chip): #4XNN
    # Skip the next instruction if Vx doesn't equal NN
    x = (chip.opcode & 0x0F00) >> 8
    nn = chip.opcode & 0x00FF
    chip.pc += 4 if chip.V[x] != nn else 2
    pass
def _5(chip): #5XY0
    # Skip the next instruction if Vx equals Vy
    x = (chip.opcode & 0x0F00) >> 8
    y = (chip.opcode & 0x00F0) >> 4
    chip.pc += 4 if chip.V[x] == chip.V[y] else 2
    pass
def _6(chip): #6XNN
    # Sets Vx to NN
    x = (chip.opcode & 0x0F00) >> 8
    nn = chip.opcode & 0x00FF
    chip.V[x] = nn
    chip.pc += 2
    pass
def _7(chip): #7XNN
    # Adds NN to Vx
    x = (chip.opcode & 0x0F00) >> 8
    nn = chip.opcode & 0x00FF
    chip.V[x] = (chip.V[x] + nn) % 256
    chip.pc += 2
    pass
def _8(chip): #8XY?
    # Many math functions in here
    # I don't like these weird switch statements so I am going back to dumb ol' if/elif statements
    function = chip.opcode & 0x000F
    x = (chip.opcode & 0x0F00) >> 8
    y = (chip.opcode & 0x00F0) >> 4
    if function == 0: #Assign
        #Set Vx to Vy
        chip.V[x] = chip.V[y]
        pass
    elif function == 1: #Or
        #Set Vx to Vx | Vy
        chip.V[x] = chip.V[x] | chip.V[y]
        pass
    elif function == 2: #And
        #Set Vx to Vx & Vy
        chip.V[x] = chip.V[x] & chip.V[y]
        pass
    elif function == 3: #Xor
        #Set Vx to Vx ^ Vy
        chip.V[x] = chip.V[x] ^ chip.V[y]
        pass
    elif function == 4: #Add
        #Add Vy to Vx (note: with overflow, Vx modulos back to 0-255, and the carry (the extra 256) is set to VF or V[0xF])
        chip.V[x] = chip.V[x] + chip.V[y]
        if chip.V[x] > 255:
            chip.V[x] %= 256
            chip.V[0xF] = 1
        else:
            chip.V[0xF] = 0
        pass
    elif function == 5: #Subtract
        #Subtract Vy from Vx (VF is 1 when there ISNT a borrow)
        chip.V[x] = chip.V[x] - chip.V[y]
        if chip.V[x] < 0:
            chip.V[x] = 256 + chip.V[x]
            chip.V[0xF] = 0
        else:
            chip.V[0xF] = 1
        pass
    elif function == 6: #Shift Right AKA /2
        #Shifts Vx right by 1, putting its last digit into VF
        chip.V[0xF] = chip.V[x] & 1
        chip.V[x] = chip.V[x] >> 1
        # chip.V[y] = chip.V[x] >> 1
        pass
    elif function == 7: #Reverse-ish AKA y-x
        #Sets Vx to Vy minus Vx (VF is 1 when there ISNT a borrow)
        chip.V[x] = chip.V[y] - chip.V[x]
        if chip.V[x] < 0:
            chip.V[x] = 256 + chip.V[x]
            chip.V[0xF] = 0
        else:
            chip.V[0xF] = 1
        pass
    elif function == 0xE: #Shift Left AKA x2
        #Shifts Vx left by 1, putting its first digit into VF
        chip.V[0xF] = (chip.V[x] & 0b10000000) >> 7
        # chip.V[x] = (chip.V[x] << 1) % 256
        chip.V[y] = (chip.V[x] << 1) % 256
        pass


    chip.pc += 2
    pass
def _9(chip): #9XY0
    # Skip the next instruction if Vx doesn't equal Vy
    x = (chip.opcode & 0x0F00) >> 8
    y = (chip.opcode & 0x00F0) >> 4
    chip.pc += 4 if chip.V[x] != chip.V[y] else 2
    pass
def _A(chip): #ANNN
    # Set I to address NNN 
    chip.I = chip.opcode & 0x0FFF
    chip.pc += 2
    pass
def _B(chip): #BNNN
    # Jumps to the address NNN plus V0
    chip.pc = chip.V[0] + (chip.opcode & 0x0FFF)
    pass
def _C(chip): #CXNN
    # Sets Vx to rand(0-255) & NN
    x = (chip.opcode & 0x0F00) >> 8
    nn = chip.opcode & 0x00FF
    chip.V[x] = random.randrange(0, 256) & nn
    chip.pc += 2
    pass
def _D(chip): #DXYN
    # Draw a sprite at coordinate (Vx, Vy) with width 8 pixels and height n+1 pixels
    # Each row of 8 pixels is read as bit-coded starting at memory I.
    # VF is set to 1 if any screen pixels are flipped (set to unset) when the sprite is drawn, 0 if not
    x = (chip.opcode & 0x0F00) >> 8
    y = (chip.opcode & 0x00F0) >> 4
    n = chip.opcode & 0x000F

    memoryLines = chip.memory[chip.I:(chip.I + n + 0)]
    chip.V[0xF] = chip.drawSprite(chip.V[x], chip.V[y], memoryLines)
    chip.pc += 2
    pass
def _E(chip): #EX??
    #Keyboard skipping
    function = chip.opcode & 0x00FF
    x = (chip.opcode & 0x0F00) >> 8
    if function == 0x9E: # skip keyboard
        #Skip the next instruction if the key in Vx is pressed
        key = chip.V[x]
        chip.pc += 2 if not chip.keys[key] else 4
        pass
    elif function == 0xA1: # don't skip keyboard
        #Skip the next instruction if the key in Vx is not pressed
        key = chip.V[x]
        chip.pc += 4 if not chip.keys[key] else 2
        pass
    else:
        print('Unkown EX opcode {}'.format(chip.opcode))
        chip.pc += 2
        pass
    pass
def _F(chip): #FX??
    #Many random functions using a single variable (and probably memory/timers/input stuff)
    function = chip.opcode & 0x00FF
    x = (chip.opcode & 0x0F00) >> 8
    if function == 0x07: #Get delay timer
        #Sets Vx to the delay timer
        chip.V[x] = chip.delay_timer
        pass
    elif function == 0x0A: #Get input
        #Sets Vx to the current keyboard key press, stopping all code until it is pressed
        key = None
        flag = True

        while flag: #Loop until a key is pressed
            chip.setKeys()
            for i in range(len(chip.keys)):
                if chip.keys[i]:
                    key = i
                    flag = False

        chip.V[x] = key
        pass
    elif function == 0x15: #Set delay timer
        #Sets the delay timer to Vx
        chip.delay_timer = chip.V[x]
        pass
    elif function == 0x18: #Set sound timer
        #Sets the sound timer to Vx
        chip.sound_timer = chip.V[x]
        pass
    elif function == 0x1E: #Add memory
        #Adds Vx to I
        chip.I = chip.I + chip.V[x]
        pass
    elif function == 0x29: #Set memory to sprite
        #Sets I to the location of the sprite for the Vx character
        chip.I = 5 * chip.V[x]
        pass
    elif function == 0x33: #Binary to decimal
        #Make a decimal representation of Vx. Store the hundreds place at I, tens at I+1, and ones at I+2
        chip.memory[chip.I] = math.floor(chip.V[x] / 100) #hundreds place
        chip.memory[chip.I + 1] = math.floor(chip.V[x] % 100 / 10) #tens place
        chip.memory[chip.I + 2] = chip.V[x] % 10 #ones place
        pass
    elif function == 0x55: #Save
        #Stores V0 to Vx (including Vx) to memory starting at address I
        for i in range(chip.I, chip.I + x + 1):
            chip.memory[i] = chip.V[i - chip.I]
        pass
    elif function == 0x65: #Load
        #Loads memory starting at address I into V0 to Vx (including Vx)
        for i in range(chip.I, chip.I + x + 1):
            chip.V[i - chip.I] = chip.memory[i]
        pass
    else:
        print('{}: No function found.'.format(hex(chip.opcode)))

    chip.pc += 2
    pass

list = {
    0x0000: _0,
    0x1000: _1,
    0x2000: _2,
    0x3000: _3,
    0x4000: _4,
    0x5000: _5,
    0x6000: _6,
    0x7000: _7,
    0x8000: _8,
    0x9000: _9,
    0xA000: _A,
    0xB000: _B,
    0xC000: _C,
    0xD000: _D,
    0xE000: _E,
    0xF000: _F,
}
def default(chip):
    print('Unkown opcode {}'.format(chip.opcode))



if __name__ == "__main__":
    import emulator
    pass