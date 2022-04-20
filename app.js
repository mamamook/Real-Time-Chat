const express = require("express");
const socketio = require("socket.io");
const app = express();

app.set('view engine', 'ejs');
// set static  folder
app.use(express.static('public'));

app.get('/', (req, res) =>{
    res.render("index");
})

const server = app.listen(process.env.PORT || 3000, () =>{
    console.log('server is running...');
})

//Initialize socket for the server 
const io = socketio(server);

//run when client connect
io.on("connection", socket =>{
    console.log("new user connected");

    socket.username = "Anonymous"

    socket.on("change_username", data =>{
        socket.username = data.username
    })

    //handle the new message
    socket.on("new_message", data =>{
        console.log("new messagr");
        io.sockets.emit("receive_message", {message: data.message, username: socket.username})
    })

    socket.on('typing', data =>{
        //boardcast when a user connect
        socket.broadcast.emit('typing', {username: socket.username})
    })
});