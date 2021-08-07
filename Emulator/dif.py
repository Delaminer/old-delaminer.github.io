f1 = open('js_printsMovingRight.txt', 'r')
f2 = open('my_printsMOVERIGHT.txt', 'r')
i = 0
while True:
    i += 1
    l1 = f1.readline()
    l2 = f2.readline()

    if not l1 or not l2:
        print('stopped at line {}'.format(i))
        break

    l1 = l1.strip()
    l2 = l2.strip()
    if l1 != l2:
        # print('{}: Different: {} and {}'.format(i, l1[0:8], l2[0:8]))
        print('{}: Different: {}\n                {}'.format(i, l1, l2))

        if i > 555:
            xxx = yyy
