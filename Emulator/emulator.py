import chip8
import cv2
import time

chip = chip8.Chip8()
chip.initialize()

# file = 'Pong'
file = 'SpaceInvaders'
# file = 'test'
# file = 'test_opcode'
chip.loadGame("games/"+file+".ch8", download=False)

prev_time = time.time()
target_fps = 60
def stop():
    cv2.destroyAllWindows()
    print('stopp!')
    chip.showLog()

chip.main()

# while True:
#     chip.update()
#     key = cv2.waitKey() & 0xFF
#     value_key = chip.keyDict.get(key, -1)

#     if value_key < 0:
#         if key == ord('.'):
#             stop()
#             break
#         pass
#     else:
#         print('pressed {}'.format(value_key))
#         chip.keyPress(value_key)
#         pass