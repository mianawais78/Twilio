const express = require('express');
const PORT = 3001;
const twilio = require('./Twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const jwt = require("./utils/Jwt");

io.on("connection", (socket) => {
  console.log("Socket connected.", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected.");
  });
});

app.use(bodyParser.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send("Welcome to Twilio");
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

app.post("/login", async (req, res) => {
  console.log("Loggin in");
  const { to, username, channel } = req.body;
  const data = await twilio.sendVerifyAsync(to, channel);
  console.log(data);
  res.send("Code Sent");
});

app.post("/verify", async (req, res) => {
  console.log("🚀 ~ file: server.js:44 ~ app.post ~ req:", req)
  console.log("Verifying Code.");
  const { to, code, username } = req.body;
  const data = await twilio.verifyCodeAsync(to, code);
  if (data.status == "approved") {
    const token = jwt.createJwt(username);
    return res.send({ token });
  }
  res.status("401").send("Invalid Token");
});
