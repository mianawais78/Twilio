const express = require('express');
const app = express();
const PORT = 3001;
const twilio = require('./Twilio');

app.get('/test',(req,res)=>{
    res.send("Welcome to Twilio")
});

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
});

app.get('/login',async(req,res)=>{
    console.log("Loggin in")
    const data = await twilio.sendVerifyAsync('+1 765-714-9081','sms')
    res.send(data)
})



app.get('/verify',async (req,res)=>{
    console.log("Verifying Code.")
    const data = await twilio.verifyCodeAsync('+1 765-714-9081',req.query.code)
    return data;
    
})
