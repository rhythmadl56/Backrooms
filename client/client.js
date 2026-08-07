const { io } = require("socket.io-client");
const readline = require("readline");

const socket = io("http://localhost:3000");

const {
    parseCommand,
    executeCommand
} = require("./commands");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

socket.on("connect", () => {    //waits for connection
    console.log("Connected!");
    console.log("Socket ID:", socket.id);
});

socket.on("welcome", (message) => {
    console.log(message);
});

socket.on("chat-message", (data) => {
    console.log(`${data.username}: ${data.message}`);
});

socket.on("disconnect", () => {
    console.log("Disconnected.");
});

socket.on("system-message", (data) => {
    console.log(`\n[System] ${data.message}`);
});

socket.on("users-list", (users) => {

    console.log("\n===== ONLINE USERS =====");

    users.forEach(user => {
        console.log("•", user);
    });

    console.log("========================\n");

});

rl.on("line", (input) => {

    const parsed = parseCommand(input);

    if (parsed) {

        executeCommand(parsed, socket);

        return;
    }

    socket.emit("chat-message", input);

});