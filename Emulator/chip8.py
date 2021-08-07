import numpy as np
import commands
import cv2
import pygame
import time
import sys
import random
import os
import winsound
pygame.init()

class Stack:
    def __init__(self):
        self.stack = []
    
    def push(self, value):
        self.stack.append(value)
    
    def pop(self):
        return self.stack.pop()
class Chip8:
    def __init__(self):
        print('new chip')
        self.size = 16
        # opcode #2 bytes
        # memory #4096 bytes
        # V #16 1-byte registers
        # I #3 bytes?
        # pc #3 bytes

        # # Memory mapping:
        # # 0x000-0x1FF - Chip 8 interpreter (contains font set in emu)
        # # 0x050-0x0A0 - Used for the built in 4x5 pixel font set (0-F)
        # # 0x200-0xFFF - Program ROM and work RAM

        # gfx #pixel state array (64 by 32 bits)

        # #timers count down to zero at a rate of 60 Hz
        # delay_timer #
        # sound_timer #buzzer sounds when zero

        # stack #16 levels
        # sp #pointer to which level is being used

        # key #hex based keypad, 4 bits, stores state of the key
        self.debug = 50
        self.logFile = open('myPrinting.txt', 'w')
        self.fonts = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, # 0
            0x20, 0x60, 0x20, 0x20, 0x70, # 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, # 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, # 3
            0x90, 0x90, 0xF0, 0x10, 0x10, # 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, # 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, # 6
            0xF0, 0x10, 0x20, 0x40, 0x40, # 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, # 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, # 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, # A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, # B
            0xF0, 0x80, 0x80, 0x80, 0xF0, # C
            0xE0, 0x90, 0x90, 0x90, 0xE0, # D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, # E
            0xF0, 0x80, 0xF0, 0x80, 0x80  # F
        ]
        self.keyDict = {
            49 : 1,
            50 : 2,
            51 : 3,
            52 : 0xc,
            53 : -22, # key 5
            113 : 4,
            119 : 5,
            101 : 6,
            114 : 0xd,
            97 : 7,
            115 : 8,
            100 : 9,
            102 : 0xe,
            122 : 0xa,
            120 : 0,
            99 : 0xb,
            118 : 0xf
        }
        # self.keyDict = {
        #     ord('x'): 0x0,
        #     ord('1'): 0x1,
        #     ord('2'): 0x2,
        #     ord('3'): 0x3,
        #     ord('q'): 0x4,
        #     ord('w'): 0x5,
        #     ord('e'): 0x6,
        #     ord('a'): 0x7,
        #     ord('s'): 0x8,
        #     ord('d'): 0x9,
        #     ord('z'): 0xa,
        #     ord('c'): 0xb,
        #     ord('4'): 0xc,
        #     ord('r'): 0xd,
        #     ord('f'): 0xe,
        #     ord('v'): 0xf,
        # }
        self.freq = {}
        self.log = []

    def clearGraphics(self):
        self.gfx = np.zeros((32, 64))
        pass

    # def drawSprite(self, x, y, data):
    #     collision = False
    #     # data is 8 pixels (0xFF == 0b11111111)
    #     for i in range(8):

    #         self.gfx[y, x + 7 - i] = (data >> i) % 2 
        
    #     return collision

    def drawSprite(self, x, y, memoryLines):
        if (x == 52):
            self.debug += 1
        collision = 0
        # print('Starting to read {}'.format([hex(a) for a in memoryLines]))
        for line in range(len(memoryLines)):
            # if (y + line) >= 32:
            #     print('large y')
            dataLine = memoryLines[line] #1 Byte value 0xFF or 0b11111111
            # print('Reading: {}'.format(bin(dataLine)))
            for xOffset in range(8):

                # if (x + xOffset) >= 64:
                #     print('large x')
                # moveRight = 7 - xOffset
                # flipData = (dataLine >> moveRight) % 2
                # flipData = dataLine & (1 << xOffset)
                # flipData = (dataLine & (0x80 >> xOffset)) % 2
                # flipData = (dataLine & (0b10000000 >> xOffset)) % 2
                # xOffset = 7 - xOffset
                mask = (0b00000001 << xOffset)
                flipData = (dataLine & mask) >> xOffset
                # print({'xo':xOffset, 'fd':flipData, 'dl':dataLine})
                if (flipData == 1): #Only flip and check for collision if you are going to flip the pixel
                    
                    use_y = y + line
                    use_y = use_y % 32
                    use_x = x + 7 - xOffset
                    use_x = use_x % 64
                    
                    if self.gfx[use_y][use_x] == 1:
                        #Flipping it off is a collision
                        collision = 1
                        self.gfx[use_y][use_x] = 0
                    else:
                        self.gfx[use_y][use_x] = 1
                    # self.gfx[y + line, x + xOffset] ^= 1

            pass
        self.drawFlag = True
        return collision

    def initialize(self):
        # Reset small data
        self.pc = 0x200
        self.opcode = 0
        self.I = 0
        self.sp = 0

        # Reset large data
        self.memory = [0] * 4096
        self.V = [0] * 16
        # self.stack = [0] * 16
        self.stack = Stack()
        # self.gfx = [0] * (64 * 32)
        # self.gfx = np.zeros((32, 64))
        self.gfx = []
        for i in range(32):
            self.gfx.append([0] * 64)
        # self.zeroColor = [0, 0, 50]
        # self.oneColor = [255, 255, 255]
        # self.zeroColor = [0x5F,0x4B,0x8B]
        # self.oneColor = [0xE6,0x9A,0x8D]
        self.zeroColor = [0x00,0x20,0x3F]
        self.oneColor = [0xAD,0xEF,0xD1]

        # Load fonts
        # for i in range(80):
        for i in range(len(self.fonts)):
            self.memory[i] = self.fonts[i]

        # Reset timers
        self.delay_timer = 0
        self.sound_timer = 0

        # self.drawGraphics()

        self.keys = []
        for i in range(0, 16):
            self.keys.append(False)

        
        pygame.init()
        pygame.time.set_timer(pygame.USEREVENT+1, int(1000 / 60))
        self.size = 10
        width = 64
        height = 32
        self.screen = pygame.display.set_mode([width * self.size, height * self.size])
        self.screen.fill(self.oneColor)
        pygame.display.flip()


    def loadGame(self, fileName, download=False):
        # Clear the memory (and create it as an array)
        self.memory = [0] * 4096
        for i in range(len(self.fonts)):
            self.memory[i] = self.fonts[i]
        index = 0x200 # or 512, same thing
        file = open(fileName, 'rb')
        if download:
            saveFile = open('memory_'+fileName+'.txt','w')

        while True:
            byte = file.read(1)
            if not byte:
                break
            val = ord(byte)
            self.memory[index] = val
            
            if download:
                saveFile.write('{} / {}: {} / {}\n'.format(index, hex(index), val, hex(val)))

            index += 1

        if download:
            saveFile.close()

        file.close()
        self.pc = 0x200
        print('Loading memory...')
        # print(self.memory)
        pass

    def cycle(self):
        #Step 1: get the opcode
        self.opcode = self.memory[self.pc] << 8 | self.memory[self.pc + 1]
        # print('{}: {}'.format(hex(self.pc), hex(self.opcode)))
        # Run operation

        try:
            self.freq[self.opcode] += 1
        except:
            self.freq[self.opcode] = 1

        cmd = commands.list.get(self.opcode & 0xF000, commands.default)
        
        
        # self.log.append(self.opcode)

        # self.log.append({
        #     'op':"{0:#0{1}x}".format(self.opcode,6),
        #     'pc':"{0:#0{1}x}".format(self.pc,6),
        #     'v':["{0:#0{1}x}".format(v,4) for v in self.V],
        #     'i':"{0:#0{1}x}".format(self.I,6)
        # })
        
        if len(self.log) > 1000:
            for l in self.log:
                print('PC[{}] OP[{}] I[{}] V[{}]'.format(l['pc'], l['op'], l['i'], ', '.join(l['v'])))

            # self.showLog()
            # xxx = yyy
            self.log = []
        printOut = {
            'op':"{0:#0{1}x}".format(self.opcode,6),
            'pc':"{0:#0{1}x}".format(self.pc,6),
            'v':["{0:#0{1}x}".format(v,4) for v in self.V],
            'i':"{0:#0{1}x}".format(self.I,6)
        }
        self.logFile.write('PC[{}] OP[{}] I[{}] V[{}]\n'.format(printOut['pc'], printOut['op'], printOut['i'], ', '.join(printOut['v'])))

        if self.debug < 4:
            print('PC[{}] OP[{}] I[{}] V{}'.format(hex(self.pc), "{0:#0{1}x}".format(self.opcode,6), hex(self.I), [hex(a) for a in self.V]))
        cmd(self)
        # print('Opcode')

        # Update timers
        if (self.delay_timer > 0):
            self.delay_timer -= 1

        # if (self.sound_timer > 0):
        #     self.sound_timer -= 1
        #     if (self.sound_timer == 0):
        #         print('BEEP')
        #         frequency = 2500  # Set Frequency To 2500 Hertz
        #         duration = 200  # Set Duration To 1000 ms == 1 second
        #         winsound.Beep(frequency, duration)
        if (self.sound_timer > 1):
            self.sound_timer = 0
            winsound.Beep(2500, 200)
        
        pass
    
    def resize(self, img, scale):
        return cv2.resize(img, (img.shape[1] * scale, img.shape[0] * scale), interpolation = cv2.INTER_AREA)

    def old_drawGraphics(self):
        # print('Graphics drawn')
        cv2.imshow('Chipper8', self.resize(self.gfx, self.size))
        self.drawFlag = False

        pass

    def drawGraphics(self):
        for i in range(0, len(self.gfx)):
            for j in range(0, len(self.gfx[0])):
                cellColor = self.zeroColor

                if self.gfx[i][j] == 1:
                    cellColor = self.oneColor
                
                pygame.draw.rect(self.screen, cellColor, [j * self.size, i * self.size, self.size, self.size], 0)
        
        pygame.display.flip()

    def setKeys(self):
        # for i in range(16):
        #     self.keys[i] = False
        # pass

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                print('Saved.')
                self.logFile.close()
                sys.exit()

            elif event.type == pygame.USEREVENT+1:
                # print('Delay')
                # if self.delay_timer > 0:
                #     self.delay_timer -= 1
                pass

            elif event.type == pygame.KEYDOWN:
                try:
                    targetKey = self.keyDict[event.key]

                    if targetKey < -20:
                        self.showLog()
                    
                    self.keys[targetKey] = True

                except: pass

            elif event.type == pygame.KEYUP:
                try:
                    targetKey = self.keyDict[event.key]
                    self.keys[targetKey] = False

                except: pass

    def keyPress(self, key):
        self.keys[key] = True
        pass

    def update(self):
        # print('update')

        self.cycle()

        if (self.drawFlag):
            self.drawGraphics()

        self.setKeys()

        pass

    def showLog(self):

        # self.log.append({
        #     'op':self.opcode,
        #     'pc':self.pc,
        #     'v':self.V,
        #     'i':self.I
        # })

        # print('Frequencies:')
        # print(['{}: {}'.format(hex(l), self.freq[l]) for l in self.freq])
        print('Log:')
        # print('\n'.join([hex(l) for l in self.log]))
        # print('\n'.join(['0'*(6-len(hex(l))) + hex(l) for l in self.log]))
        # print('\n'.join(["{0:#0{1}x}".format(l,6) for l in self.log]))
        # print('\n'.join(["{0:#0{1}x}".format(l,6) for l in self.log]))
        
        # print('\n'.join(['{}: PC[{}] OP[{}] I[{}] V[{}]'.format(index, hex(l['pc']), "{0:#0{1}x}".format(l['op'],6), hex(l['i']), ', '.join([hex(a) for a in l['v']])) for index, l in enumerate(self.log)]))
        
        for index, l in enumerate(self.log):
            print('{}: PC[{}] OP[{}] I[{}] V[{}]'.format(index, hex(l['pc']), "{0:#0{1}x}".format(l['op'],6), hex(l['i']), ', '.join([hex(a) for a in l['v']])))


    def main(self):
        clock = pygame.time.Clock()

        while True:
            clock.tick(300)
            self.setKeys()
            # self.soundTimer.beep()

            

            self.cycle()
            self.drawGraphics()

if __name__ == "__main__":
    import emulator
    pass