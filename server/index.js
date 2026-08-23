const express = require("express");
const http = require("http");
const { Server } = require("socket.io");    //only imported Server class from socket module
const registerSocketEvents = require("./events");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

registerSocketEvents(io);

app.get("/", (req, res) => {
    res.send("Backrooms Server is Running...");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Backrooms server running on port ${PORT}`);
});