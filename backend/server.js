const express = require('express');
const PORT = 3001;
const twilio = require('./Twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const socket = socketIo(server,{ 
    cors: {
      origin: 'http://localhost:3000'
    }
});

socket.on('connection',(socket)=>{
    console.log("Socket connected.",socket.id)
});
socket.on('disconnect',()=>{
    console.log("Socket disconnected.")
});
app.use(bodyParser.json());
app.use(cors());



app.get('/test',(req,res)=>{
    res.send("Welcome to Twilio")
});

server.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
});

app.post('/login',async(req,res)=>{
    console.log("Loggin in")
    const {to,username, channel} = req.body;
    const data = await twilio.sendVerifyAsync(to,channel)
    res.send(data)
})



app.post('/verify',async (req,res)=>{
    console.log("Verifying Code.")
    const {to,code} = req.body;
    const data = await twilio.verifyCodeAsync(to,code)
    res.send(data);
    
})
