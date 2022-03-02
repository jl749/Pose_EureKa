# Pose_EureKa
pose based **Super Nintendo Entertainment System (SNES)** motion interface + streaming web application.



![](https://github.com/jl749/Pose_EureKa/blob/master/1v1_demo.gif)

every move must be different (e.g. Lkick, Lkick will not work but Lkick, Rkick will work)


## Preparation
1) ubuntu host server to run express js and stream the game screens
2) a router to set up a local network
3) vmware installed on the host server (three socketio rooms --> three virtual game servers)

## Setup
* host server
```
sudo apt install nodejs
sudo apt install npm

cd ~/Downloads
git clone https://github.com/jl749/pose_eureka.git
cd pose_eureka/HostServer
npm install
node app.js
```

* gameserver (vmware)
```
cd ~/Downloads
git clone https://github.com/jl749/pose_eureka.git
cd pose_eureka/GameServer
sudo chmod +x *.sh
sudo ./post_installer.sh
sudo ./init.sh
```

* change local vmware ips accordingly
```
# insdie 'HostServer/app.js'

const game_server1 = http://192.168.0.9:3000
const game_server2 = http://192.168.0.10:3000
const game_server3 = http://192.168.0.8:3000
```
when everything is ready access the application via 'http://localhost:5000/room_1'

`getUserMedia` fucntion is only allowed from the [secure](https://w3c.github.io/webappsec-secure-contexts/) contexts
you will need to set up a reverse proxy gateway in order to access the webpage outside of the loacalhost


(or simply start the chrome with the following flag `--unsafely-treat-insecure-origin-as-secure="http://example.com"`)


## Tech Stack
![image](https://user-images.githubusercontent.com/67103130/144164890-887b67c1-c97d-48f4-a72b-ea5118e73a4c.png)


## System Design
![image](https://user-images.githubusercontent.com/67103130/144165024-fb36e7f2-ceb9-411d-8dd5-8896c0956f41.png)


## Demo Videos
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/nO7Ca_bAdnE/0.jpg)](https://youtu.be/nO7Ca_bAdnE)

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/4Jr04ehmgc0/0.jpg)](https://youtu.be/4Jr04ehmgc0)


## Todo
- [ ] Fix javascript streaming delays
- [ ] Create game lobby (room occupied?)
- [ ] Spectators with live chat
- [ ] Data traffic optimisation (WebRTC maybe?)
- [ ] Test on the public network
