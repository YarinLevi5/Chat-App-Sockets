const express = require("express");
let app = express();
let port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("A user connected");
  let user = {};
  socket.on("user-joined", (user) => {
    user[socket.id] = user;
    io.emit("new-user", user);
  });

  socket.on("send-msg", (msg) => {
    user["message"] = msg;
    user["time"] = socket.handshake.time;
    io.emit("get-msg", user);
  });

  socket.on("disconnect", () => {
    console.log("User left");
    let userThatLeft = user[socket.id];
    io.emit("user-left", userThatLeft);
  });
});
server.listen(port);
