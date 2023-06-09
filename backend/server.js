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

io.use((socket, next) => {
  console.log("Socket middleware");
  if (socket.handshake.query && socket.handshake.query.token) {
    const { token } = socket.handshake.query;
    try {
      const result = jwt.verifyToken(token);
      console.log("Token Accepted");
      if (result.username) return next();
    } catch (error) {
      console.log(error);
    }
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected.", socket.id);
  socket.emit("twilio-token", {
    token: getAccessTokenForVoice("Hassan"),
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected.");
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
app.get("/test", (req, res) => {
  res.send("Welcome to Twilio");
});
app.post("/check-token", (req, res) => {
  let isValid = false;
  const { token } = req.body;
  try {
    isValid = jwt.verifyToken(token);
  } catch (error) {
    console.log(error);
  }
  res.send({ isValid });
});

app.post("/login", async (req, res) => {
  console.log("Loggin in");
  const { to, username, channel } = req.body;
  const data = await twilio.sendVerifyAsync(to, channel);
  console.log(data);
  res.send("Code Sent");
});

app.post("/verify", async (req, res) => {
  const { to, code, username } = req.body;
  const data = await twilio.verifyCodeAsync(to, code);
  if (data.status == "approved") {
    const token = jwt.createJwt(username);
    return res.send({ token });
  }
  res.status("401").send("Invalid Token");
});

app.post("/call-new", (req, res) => {
  console.log("Received new Call.");

  const response = twilio.voiceResponse(
    "Thank you for calling Call Center. We will put you on a hold util the next attendent is free."
  );
  io.emit("call-new", { data: req.body });
  res.type("text/xml");
  res.send(response.toString());
});
app.post("/enqueue", (req, res) => {
  const response = twilio.enqueueCall("Customer Service.");
  io.emit("enqueue", { data: req.body });
  res.type("text/xml");
  res.send(response.toString());
});
app.post("/call-status-changed", (req, res) => {
  console.log("Call Status Changed.", res.body);
  res.send("ok");
});
