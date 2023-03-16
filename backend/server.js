const express = require('express');
const app = express();
const PORT = 3001;
const twilio = require('./Twilio');
const client = twilio.client;
app.get('/test',(req,res)=>{
    res.send("Welcome to Twilio")
});

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
});

app.get('/login',(req,res)=>{
    console.log("Loggin in")
})
console.log(process.env.MOBILE)
app.get('/verify',(req,res)=>{
    console.log("Verifying Code.")
})
