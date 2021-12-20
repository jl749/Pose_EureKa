# Pose_EureKa
pose based motion interface + streaming service running under a local network
(have not tested on the public network yet and there are many adjustments and improvements to be made)


next command must be different from the previous command  (e.g. Lkick, Lkick will not work but Lkick, Rkick will work)


![](https://github.com/jl749/Pose_EureKa/blob/master/1v1_demo.gif)


## Preparation
1) ubuntu host server to run express js and stream the game screens
2) a router to form a local network
3) vmware installed on the host server (three socketio rooms --> three virtual games servers)

## Setup
* on the host server
```
sudo apt install nodejs
sudo apt install npm

cd ~/Downloads
git clone https://github.com/jl749/pose_eureka.git
cd pose_eureka/HostServer
npm install
node app.js
```

* then set up the gameserver (vmware)
```
cd ~/Downloads
git clone https://github.com/jl749/pose_eureka.git
cd pose_eureka/GameServer
sudo chmod +x *.sh
sudo ./post_installer.sh
sudo ./init.sh
```

* change the local ips of game servers in 'HostServer/app.js' accordingly
```
At the moment they are ...

const game_server1 = http://192.168.0.9:3000
const game_server2 = http://192.168.0.10:3000
const game_server3 = http://192.168.0.8:3000
```
when everything set up access the application via 'http://localhost:5000/room_1'

if you are accessing it from a remote computer (not on server) </br>
you will need to set up a reverse proxy before the host server's express js for the [secure connection](https://w3c.github.io/webappsec-secure-contexts/)

(`getUserMedia` is only available from secure contexts)


(or you can simply start chrome with the following flag `--unsafely-treat-insecure-origin-as-secure="http://example.com"`)


## Tech Stack
![image](https://user-images.githubusercontent.com/67103130/144164890-887b67c1-c97d-48f4-a72b-ea5118e73a4c.png)


## System Design
![image](https://user-images.githubusercontent.com/67103130/144165024-fb36e7f2-ceb9-411d-8dd5-8896c0956f41.png)


## Demo Videos
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/nO7Ca_bAdnE/0.jpg)](https://youtu.be/nO7Ca_bAdnE)

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/4Jr04ehmgc0/0.jpg)](https://youtu.be/4Jr04ehmgc0)


## Todo
- [ ] Fix game streaming delays (when plyed for too long gets laggy and cause delays)
- [ ] Create game lobby (occupied?)
- [ ] Spectate features with live chat
- [ ] Data traffic optimisation
- [ ] Deploy (public network)
