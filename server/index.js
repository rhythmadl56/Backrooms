const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const colors = ["red", "green", "yellow", "blue", "magenta", "cyan"];

function getRandomUser() {
  const names = ["ghost", "void", "echo", "entity", "shadow"];
  const name = names[Math.floor(Math.random() * names.length)];
  const num = Math.floor(Math.random() * 1000);
  return name + "_" + num;
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

io.on("connection", (socket) => {
  const user = getRandomUser();
  const color = getRandomColor();

  socket.data.user = user;
  socket.data.color = color;

  console.log(`${user} connected`);

  socket.on("join_room", (room) => {
    socket.join(room);

    socket.to(room).emit("message", {
      type: "system",
      text: `${user} joined the room`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("send_message", ({ room, text }) => {
    io.to(room).emit("message", {
      type: "message",
      user,
      color,
      text,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("message", {
          type: "system",
          text: `${user} left the room`,
          time: new Date().toLocaleTimeString()
        });
      }
    });
  });
});

console.log("Server running on port " + PORT);