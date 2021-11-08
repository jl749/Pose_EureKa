from flask import Flask
from flask_socketio import SocketIO
from pynput.keyboard import Key, Controller
import datetime
import time

keyboard = Controller()
arrowMap = {
    '0': Key.up,
    '1': Key.down,
    '2': Key.left,
    '3': Key.right,
    '4': 8,
    '5': 5,
    '6': 4,
    '7': 6,
    'p1_skill1': lambda a: 1,
    'p2_skill1': lambda a: 2,
}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'hello_there1234'
socketio = SocketIO(app)


@socketio.on('key_execute')
def pressKey(key):
    print("Pressing Key:", key, end=' ... ')
    try:
        key = arrowMap[key]
    except KeyError:
        pass

    keyboard.press(key)
    time.sleep(0.07)

    # log them
    with open('./keyEvent_log.txt', 'a') as f:
        f.write(str(datetime.datetime.now()))
        f.write('__')
        f.write(str(key))
        f.write('\n')

    print('done')
    keyboard.release(key)


if __name__ == '__main__':
    socketio.run(app, port=8000, debug=True)
