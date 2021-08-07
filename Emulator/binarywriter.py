f = open('games/hello.ch8','wb')
i=4
j=5.55
# 'A000' or 160,0
# 'D995' or 217,149
# f.write('i'+'j') #where do i specify that i is an integer and j is a double?
w = [
    # 160,1,
    # 217,149

    b'\x61\x00',#x 1 = 0
    b'\x62\x00',#y 2 = 0
    b'\x63\x05',#counter 3 = 1
    b'\x64\x46',#v4 = 0
    #Begin loop
    b'\x74\x05',#v4 += 5
    # b'\x44\x50',#skip if v4 != 50 or 16*5
    # b'\x64\x00',#v4 = 0
    b'\xa0\x00',#i = 0
    b'\xf4\x1e',#i += v4
    
    #Increase x and y
    b'\x71\x05',#v1 += 4
    b'\x72\x01',#v2 += 1

    # b'\x00\xe0',#clear
    b'\xd1\x25',#draw5 at v1,v2
    b'\x12\x08'#goto 200
    # b'\x00\x05',
    # b'\x00\x05',
]
hello = [
    b'\xa0\x55',#i = h=17
    b'\x61\x00',#x 1 = 0
    b'\x62\x00',#y 2 = 0
    b'\xd1\x25',#draw5 at v1,v2

    b'\xa0\x46',#i = e=14
    b'\x61\x05',#x 1 = 0
    b'\x62\x00',#y 2 = 0
    b'\xd1\x25',#draw5 at v1,v2
    
    b'\xa0\x46',#i = e=14
    b'\x61\x05',#x 1 = 0
    b'\x62\x00',#y 2 = 0
    b'\xd1\x25',#draw5 at v1,v2

    
    b'\x12\x12'#goto 200
    b'\x12\x12'#goto 200
    b'\x12\x12'#goto 200
]

h1 = []
def printString(a, s, x, y):
    a.append(b'\x61'+(x*5).to_bytes(1, 'big'))
    a.append(b'\x62'+(y*6).to_bytes(1, 'big'))
    for c in s:
        dx = ord(c) - ord('a') + 10
        if dx < 10:
            dx += 39
        # print(dx)
        dx = dx * 5
        a.append(b'\xa0' + dx.to_bytes(1, 'big')) #set i
        a.append(b'\xd1\x25') #draw
        a.append(b'\x71\x05') #x += 5
    pass

def cap(a):
    line = len(a)*2 + 4
    a.append(b'\x12' + line.to_bytes(1, 'big'))
    a.append(b'\x12' + line.to_bytes(1, 'big'))
    a.append(b'\x12' + line.to_bytes(1, 'big'))
    a.append(b'\x12' + line.to_bytes(1, 'big'))

# t = 5
# u = b'\xa0' + t.to_bytes(1, 'big')
# print(u)
printString(h1, 'chip8', 2, 1)
printString(h1, 'emulator', 1, 3)
cap(h1)
# f.write(160)
# f.write(1)
# f.write(217)
# f.write(149)

for a in h1:
    f.write(a)

f.close()