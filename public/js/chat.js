$(function () {
  let socket = io();

  $(".chat").submit((event) => {
    event.preventDefault();
    let msg = $("[ data-role=writeMessage]").val();
    socket.emit("send-msg", msg);
    $("[ data-role=writeMessage]").val("");
  });

  socket.on("get-msg", (data) => {
    addMsgToTheChat(data.message);
    let date = new Date(data.time);
    let msgDate = date.toISOString().slice(0, 10);
    $(".chat").append(msgDate);
  });

  let addMsgToTheChat = (msg) => {
    let chatBox = $(".chat");
    let userMsg = $("<p>").attr("class", "msg");
    $(userMsg).text(msg);
    $(chatBox).append(userMsg);
  };

  let name = prompt();
  socket.emit("user-joined", name);
  addMsgToTheChat(`${name} joined`);

  socket.on("user-left", (user) => {
    addMsgToTheChat(`${user} left`);
  });
});
