const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs')
var fileName = 'data.json'
app.use("/home", express.static('./home/'));
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/home/home.html');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/data.json', (req, res) => {
    res.sendFile(__dirname + '/data.json');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('add', (data) => {
        var m = JSON.parse(fs.readFileSync(fileName).toString());
        m.push(JSON.parse(data))
        console.log(m)
        fs.writeFileSync(fileName, JSON.stringify(m));
        io.emit('data-change', m)
    });
    socket.on('file', (data) => {
        const date = new Date()
        var img = data.split('..')[0]
        var name = data.split('..')[1]
        var imgData = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = Buffer.from(imgData, 'base64');
        
        console.log(`/uploads/${date.getMilliseconds()}${date.getDay()}${date.getFullYear()}${date.getDate()}${name}`)
        fs.writeFile(__dirname+`/uploads/${date.getMilliseconds()}${date.getDay()}${date.getFullYear()}${date.getDate()}${name}`, buf, function(err) {
            if(err) throw err;
            console.log('File created successfully')
        })
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});