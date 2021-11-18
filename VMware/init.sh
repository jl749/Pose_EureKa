#!/usr/bin/env bash

#chmod +x init.sh
xrandr --output Virtual1 --mode 1621x939

flatpak run com.snes9x.Snes9x &
pid[0]=$!
python3 ~/Downloads/Pose_EureKa/GameServer/FLASK_keymap/main.py &
pid[1]=$!
node ~/Downloads/Pose_EureKa/GameServer/app.js &
pid[2]=$!
sleep 2

TMP=$(xdotool search --onlyvisible --name Snes9x)
xdotool windowsize "$TMP" 500 400
xdotool windowmove "$TMP" 80 70

trap "kill ${pid[0]} ${pid[1]}; ${pid[2]}; exit 1" INT
wait
