const { io } = require("socket.io-client");
const blessed = require("blessed");
const {
    parseCommand,
    executeCommand
} = require("./commands");

const ui = require("./ui");

const socket = io("https://backrooms-1.onrender.com", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000
});


// ============================================
// LOBBY STATE
// ============================================

let lobbyStep = "menu";
let usernameStep = "menu";


// ============================================
// SOCKET CONNECTION
// ============================================

socket.on("connect", () => {

    ui.chatBox.log(`[SYSTEM] Connected to Backrooms`);
    ui.chatBox.log(`[SYSTEM] Socket ID: ${socket.id}`);

    // Start in lobby
    ui.showUsernameScreen();

    ui.screen.render();

});


// ============================================
// WELCOME MESSAGE
// ============================================

socket.on("welcome", (message) => {

    ui.chatBox.log(`[SYSTEM] ${message}`);

    ui.screen.render();

});


// ============================================
// CHAT MESSAGE
// ============================================

socket.on("chat-message", (data) => {

    ui.chatBox.log(
        `${data.username}: ${data.message}`
    );

    ui.screen.render();

});


// ============================================
// SYSTEM MESSAGE
// ============================================

socket.on("system-message", (data) => {

    ui.chatBox.log(
        `[SYSTEM] ${data.message}`
    );

    ui.screen.render();

});


// ============================================
// USERS LIST
// ============================================

socket.on("users-list", (users) => {

    ui.usersBox.setContent(
        users
            .map(user => `• ${user}`)
            .join("\n")
    );

    ui.screen.render();

});


// ============================================
// DISCONNECT
// ============================================

socket.on("disconnect", () => {

    ui.chatBox.log(
        "[SYSTEM] Disconnected from server."
    );

    ui.screen.render();

});


// ============================================
// ROOM CREATED
// ============================================

socket.on("room-created", (room) => {

    lobbyStep = "menu";

    ui.lobbyInput.hide();

    ui.chatBox.log(
        `[ROOM] Created: ${room.name}`
    );

    ui.chatBox.log(
        `[ROOM] Code: ${room.code}`
    );

    ui.chatBox.log(
        `[SYSTEM] Share this code with others.`
    );

    ui.showChat();

});


// ============================================
// ROOM JOINED
// ============================================

socket.on("room-joined", (room) => {

    lobbyStep = "menu";

    ui.lobbyInput.hide();

    ui.chatBox.log(
        `[ROOM] Joined: ${room.name}`
    );

    ui.chatBox.log(
        `[ROOM] Code: ${room.code}`
    );

    ui.showChat();

});


// ============================================
// ROOM ERROR
// ============================================

socket.on("room-error", (message) => {

    lobbyStep = "menu";

    ui.lobbyInput.hide();

    ui.lobbyMenu.setContent(
        "ROOM ERROR\n\n" +
        message
    );

    ui.lobbyStatus.setContent(
        "Press 1, 2 or 3 to try again."
    );

    ui.screen.render();

});

socket.on("user-poked", (data) => {

    // Terminal bell
    process.stdout.write("\x07");

    // Show poke in chat
    ui.chatBox.log(
        `[POKE] >> ${data.username} poked you!`
    );

    ui.screen.render();

});

socket.on("poke-sent", (data) => {

    ui.chatBox.log(
        `[SYSTEM] 👆 You poked ${data.username}.`
    );

    ui.screen.render();

});
socket.on("poke-error", (message) => {

    ui.chatBox.log(
        `[ERROR] ${message}`
    );

    ui.screen.render();

});

ui.screen.key("1", () => {

    if (ui.currentView !== "username") {
        return;
    }

    if (usernameStep !== "menu") {
        return;
    }

    usernameStep = "custom";

    ui.usernameMenu.setContent(
        "CHOOSE YOUR USERNAME\n\n" +
        "Enter a username:"
    );

    ui.usernameInput.setValue("");

    ui.usernameInput.show();

    ui.usernameInput.focus();

    ui.screen.render();

});
ui.screen.key("2", () => {

    if (ui.currentView !== "username") {
        return;
    }

    if (usernameStep !== "menu") {
        return;
    }

    usernameStep = "random";

    ui.usernameMenu.setContent(
        "GENERATING USERNAME..."
    );

    ui.screen.render();

    socket.emit("generate-username");

});
ui.usernameInput.on("submit", (value) => {

    value = value.trim();

    if (!value) {
        return;
    }

    if (usernameStep === "custom") {

        socket.emit(
            "set-username",
            value
        );

    }

});
socket.on("username-set", (user) => {

    usernameStep = "menu";

    ui.lobbyMenu.setContent(
        "\n" +
        `Welcome, ${user.username}!\n\n` +
        "[1]  Create a room\n" +
        "[2]  Join a random room\n" +
        "[3]  Enter room code"
    );

    ui.lobbyStatus.setContent(
        "Choose an option"
    );

    ui.showLobby();

});
socket.on("username-error", (message) => {

    console.log("USERNAME ERROR:", message);

    usernameStep = "menu";

    ui.usernameInput.hide();

    ui.usernameMenu.setContent(
        "USERNAME ERROR\n\n" +
        message
    );

    ui.screen.render();

});

// ============================================
// LOBBY - CREATE ROOM
// ============================================

ui.screen.key("1", () => {

    if (ui.currentView !== "lobby") {
        return;
    }

    if (lobbyStep !== "menu") {
        return;
    }

    lobbyStep = "create";

    ui.lobbyMenu.setContent(
        "CREATE A ROOM\n\n" +
        "Enter a name for your room:"
    );

    ui.lobbyStatus.setContent(
        "Room name:"
    );

    ui.lobbyInput.setValue("");

    ui.lobbyInput.show();

    ui.lobbyInput.focus();

    ui.screen.render();

});


// ============================================
// LOBBY - RANDOM ROOM
// ============================================

ui.screen.key("2", () => {

    if (ui.currentView !== "lobby") {
        return;
    }

    if (lobbyStep !== "menu") {
        return;
    }

    lobbyStep = "random";

    ui.lobbyMenu.setContent(
        "RANDOM ROOM\n\n" +
        "Finding an available room..."
    );

    ui.lobbyStatus.setContent(
        "Please wait..."
    );

    ui.screen.render();

    socket.emit("random-room");

});


// ============================================
// LOBBY - JOIN BY CODE
// ============================================

ui.screen.key("3", () => {

    if (ui.currentView !== "lobby") {
        return;
    }

    if (lobbyStep !== "menu") {
        return;
    }

    lobbyStep = "join";

    ui.lobbyMenu.setContent(
        "JOIN A ROOM\n\n" +
        "Enter the 6-character room code:"
    );

    ui.lobbyStatus.setContent(
        "Room code:"
    );

    ui.lobbyInput.setValue("");

    ui.lobbyInput.show();

    ui.lobbyInput.focus();

    ui.screen.render();

});


// ============================================
// LOBBY INPUT
// ============================================

ui.lobbyInput.on("submit", (value) => {

    value = value.trim();

    if (!value) {
        return;
    }


    // CREATE ROOM
    if (lobbyStep === "create") {

        socket.emit(
            "create-room",
            value
        );

    }


    // JOIN ROOM
    else if (lobbyStep === "join") {

        socket.emit(
            "join-room",
            value
        );

    }

});


// ============================================
// CHAT INPUT
// ============================================

ui.input.on("submit", (message) => {

    message = message.trim();

    if (!message) {

        ui.input.clearValue();

        ui.input.focus();

        ui.screen.render();

        return;
    }


    const parsed = parseCommand(message);


    // COMMAND
    if (parsed) {

        executeCommand(parsed, {
            socket,
            ui
        });

    }


    // NORMAL MESSAGE
    else {

        socket.emit(
            "chat-message",
            message
        );

    }


    ui.input.clearValue();

    ui.input.focus();

    ui.screen.render();

});