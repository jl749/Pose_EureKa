#!/bin/bash
sudo apt-get update

#INSTALL py, node, npm, snes9x
sudo apt install xdotool
sudo apt-get install python3
sudo apt install nodejs
sudo apt install npm
sudo apt install --reinstall ca-certificates
sudo apt-get install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub com.snes9x.Snes9x

#CLONE project repo and set up
cd ~/Downloads
git clone https://github.com/jl749/pose_eureka
cd ./Pose_EureKa/GameServer
npm init -y
npm install

sudo apt install python3-testresources
pip3 install -r ~/Downloads/Pose_EureKa/GameServer/FLASK_keymap/requirements.txt

#SCREEN_LOCK
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
#sudo systemctl unmask sleep.target suspend.target hibernate.target hybrid-sleep.target
