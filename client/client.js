const io = require("socket.io-client");
const chalk = require("chalk");
const createUI = require("./ui");

const socket = io("https://backrooms-w4xh.onrender.com/", {
  transports: ["websocket"]
});

const { screen, chatBox, input } = createUI();

let currentRoom = "general";

socket.emit("join_room", currentRoom);

function addMessage(text) {
  chatBox.pushLine(text);
  chatBox.setScrollPerc(100);
  screen.render();
}

socket.on("message", (msg) => {
  if (msg.type === "system") {
    addMessage(chalk.gray(`[${msg.time}] ${msg.text}`));
  } else {
    const coloredUser = chalk[msg.color](msg.user);
    addMessage(`[${msg.time}] ${coloredUser}: ${msg.text}`);
  }
});

input.key("enter", () => {
  const value = input.getValue();

  if (!value) return;

  if (value.startsWith("/join")) {
    const room = value.split(" ")[1];
    currentRoom = room;
    socket.emit("join_room", room);
    addMessage(chalk.yellow(`Joined room: ${room}`));
  } else {
    socket.emit("send_message", {
      room: currentRoom,
      text: value
    });
  }

  input.clearValue();
  input.focus();
  screen.render();
});