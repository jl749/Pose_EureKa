# pip install pynput
from pynput.keyboard import Key, Controller
import sys
import datetime

arrowMap = {
    '0' : Key.up,
    '1' : Key.down,
    '2' : Key.left,
    '3' : Key.right,
    '4' : 8,
    '5' : 5,
    '6' : 4,
    '7' : 6,
}

if __name__ == "__main__":
    key = sys.argv[1]
    try:
        key = arrowMap[key]
    except KeyError:
        pass

    keyboard = Controller()
    keyboard.press(key)
    keyboard.release(key)

    # log them
    with open('./keyEvent_log.txt', 'a') as f:
        f.write(str(datetime.datetime.now()) + str(sys.argv)+'\n')

    print('done')