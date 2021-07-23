const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("server is running");
})

const users = {}
const screenShares = {}
const prevMsg = {}

io.on('connection', (socket) => {

    socket.emit('streamID', socket.id);

    socket.on("join room", roomID => {
        if (users[roomID]) {
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
        socket.on('disconnect', () => {
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room;
            }
        });
    });

    socket.on('muteVideo',(roomid ,userid, mute)=>{
        socket.to(roomid).emit('muteuser',userid,mute);
    })
    socket.on('playVideo',(roomid ,userid, play)=>{
        socket.to(roomid).emit('playvid',userid,play);
    })
    socket.on("join-room", (roomId, user,ss) => {
        if(ss){
            screenShares[roomId] = {"socket" : socket.id , "ssid" : user.id}
            socket.to(roomId).emit("screenShare",user);
        }       
        if(!ss) {
            if (users[roomId]) {
                users[roomId].push(user.id);
            } else {
                users[roomId] = [user.id];
            }
            socket.join(roomId);
            socket.to(roomId).emit("user-connected", user);
        }
        socket.on('disconnectss',(roomid,ssid)=>{
            if(screenShares[roomid]){
                if(screenShares[roomid]['ssid']==ssid){
                    socket.to(roomId).emit("user-disconnected-ss", ssid);
                    screenShares[roomId] = null
                }
            }
        })
        socket.on('disconnect', () => {
            let room = users[roomId];
            if (room) {
                if(room.find((id)=>{return id==user.id})){
                    room = room.filter(id => id !== user.id);
                    users[roomId] = room;
                    socket.to(roomId).emit("user-disconnected", user.id,user.name);
                }
            }

            if(screenShares[roomId]){
                if(screenShares[roomId]['socket']==socket.id){
                    socket.to(roomId).emit("user-disconnected-ss", screenShares[roomId]['ssid'])
                    screenShares[roomId] = null
                }
            }

        });
        socket.on("message", (message) => {
            if(prevMsg[message.roomID]){
                if(prevMsg[message.roomID]==message.msg_id){
                    return;
                }
                else{
                    prevMsg[message.roomID] = message.msg_id
                    socket.to(message.roomID).emit("createMessage", message);
                }
            }
            else{
                prevMsg[message.roomID] = message.msg_id;
                socket.to(message.roomID).emit("createMessage", message);
            }
            
        });
      });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));