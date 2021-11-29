from flask import Flask
from flask_socketio import SocketIO
from pynput.keyboard import Key, Controller
import datetime
import time

keyboard = Controller()


def p1_releaseAll():
    keyboard.release(Key.up)
    keyboard.release(Key.down)
    keyboard.release(Key.left)
    keyboard.release(Key.right)


def p2_releaseAll():
    keyboard.release('8')
    keyboard.release('5')
    keyboard.release('4')
    keyboard.release('6')


def p1_skill1(direction: bool):  # 1 for facing right, 0 for facing reverse
    p1_releaseAll()
    keyboard.press(Key.down)

    tmp = Key.right if direction else Key.left
    time.sleep(0.05)
    keyboard.press(tmp)
    time.sleep(0.03)
    keyboard.release(Key.down)
    time.sleep(0.05)
    keyboard.press('c')

    time.sleep(0.05)
    keyboard.release(tmp)
    time.sleep(0.1)

    keyboard.release('c')
    time.sleep(0.3)


def p2_skill1(direction: bool):  # 0 for facing left, 1 for facing right
    p2_releaseAll()
    keyboard.press('5')

    tmp = '4' if direction else '6'
    time.sleep(0.05)
    keyboard.press(tmp)
    time.sleep(0.03)
    keyboard.release('5')
    time.sleep(0.05)
    keyboard.press('g')

    time.sleep(0.05)
    keyboard.release(tmp)
    time.sleep(0.01)

    keyboard.release('g')
    time.sleep(0.3)


def nextMoveRelease(playerN: bool, newCmd):  # 0 for p1, 1 for p2
    if playerN:
        p1_releaseAll()
    else:
        p2_releaseAll()
    newCmd()


keyMap = {
    '-1': lambda: p1_releaseAll(),
    '0': lambda: nextMoveRelease(True, lambda: keyboard.press(Key.up)),
    '1': lambda: nextMoveRelease(True, lambda: keyboard.press(Key.down)),
    '2': lambda: nextMoveRelease(True, lambda: keyboard.press(Key.left)),
    '3': lambda: nextMoveRelease(True, lambda: keyboard.press(Key.right)),
    '-2': lambda: p2_releaseAll(),
    '4': lambda: nextMoveRelease(False, lambda: keyboard.press('8')),
    '5': lambda: nextMoveRelease(False, lambda: keyboard.press('5')),
    '6': lambda: nextMoveRelease(False, lambda: keyboard.press('4')),
    '7': lambda: nextMoveRelease(False, lambda: keyboard.press('6')),
    'p1_skill1R': lambda: p1_skill1(True),
    'p2_skill1L': lambda: p2_skill1(True),
    'p1_skill1L': lambda: p1_skill1(False),
    'p2_skill1R': lambda: p2_skill1(False),
}


app = Flask(__name__)
app.config['SECRET_KEY'] = 'hello_there1234'
socketio = SocketIO(app)


@socketio.on('key_execute')
def pressKey(key):
    print("Pressing Key:", key, end=' ... ')
    flag = False

    try:
        keyMap[key]()
        flag = True
    except KeyError:
        keyboard.press(key)
        if key in ['a', 's', 'z', 'x', 'c', 'v']:
            p1_releaseAll()
        else:
            p2_releaseAll()
        time.sleep(0.02)

    # log them
    with open('./keyEvent_log.txt', 'a') as f:
        f.write(str(datetime.datetime.now()))
        f.write(' ... ')
        f.write(str(key))
        f.write('\n')

    print('done')
    if not flag:
        keyboard.release(key)


if __name__ == '__main__':
    socketio.run(app, port=8000, debug=True)
