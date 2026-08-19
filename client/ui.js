const blessed = require("blessed");
const figlet = require("figlet");

const screen = blessed.screen({
    smartCSR: true,
    grabKeys: true,
    title: "Backrooms"
});


// ============================================
// BANNER
// ============================================

const banner = figlet.textSync("BACKROOMS", {
    font: "Standard"
});


// ============================================
// LOBBY PANEL
// ============================================

const lobby = blessed.box({
    top: "center",
    left: "center",
    width: 75,
    height: 28,
    align: "center"
});


// ============================================
// LOBBY BANNER
// ============================================

const lobbyBanner = blessed.box({
    top: 2,
    left: 0,
    width: "100%",
    height: 8,
    content: banner,
    align: "center",
    valign: "middle"
});


// ============================================
// LOBBY MENU
// ============================================

const lobbyMenu = blessed.box({
    top: 12,
    left: 0,
    width: "100%",
    height: 7,
    content:
        "[1]  Create a room\n" +
        "[2]  Join a random room\n" +
        "[3]  Enter room code",
    align: "center"
});


// ============================================
// LOBBY STATUS
// ============================================

const lobbyStatus = blessed.box({
    top: 19,
    left: 0,
    width: "100%",
    height: 3,
    content: "Choose an option",
    align: "center"
});


// ============================================
// LOBBY INPUT
// ============================================

const lobbyInput = blessed.textbox({
    top: 22,
    left: "center",
    width: 45,
    height: 3,
    border: {
        type: "line"
    },
    inputOnFocus: true,
    hidden: true
});


// ============================================
// CHAT HEADER
// ============================================

const header = blessed.box({
    top: 0,
    left: 0,
    width: "100%",
    height: 8,
    content: banner,
    border: {
        type: "line"
    },
    align: "center",
    valign: "middle"
});


// ============================================
// CHAT WINDOW
// ============================================

const chatBox = blessed.log({
    top: 8,
    left: 0,
    width: "75%",
    bottom: 3,
    border: {
        type: "line"
    },
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    mouse: true
});


// ============================================
// USERS PANEL
// ============================================

const usersBox = blessed.box({
    top: 8,
    right: 0,
    width: "25%",
    bottom: 3,
    border: {
        type: "line"
    },
    label: " ONLINE USERS "
});


// ============================================
// CHAT INPUT
// ============================================

const input = blessed.textbox({
    bottom: 0,
    left: 0,
    width: "100%",
    height: 3,
    border: {
        type: "line"
    },
    inputOnFocus: true
});


// ============================================
// VIEW STATE
// ============================================

let currentView = "lobby";


// ============================================
// SHOW LOBBY
// ============================================

function showLobby() {

    currentView = "lobby";

    // Hide chat
    header.hide();
    chatBox.hide();
    usersBox.hide();
    input.hide();

    // Show lobby
    lobby.show();
    lobbyBanner.show();
    lobbyMenu.show();
    lobbyStatus.show();

    lobbyInput.hide();

    screen.render();
}


// ============================================
// SHOW CHAT
// ============================================

function showChat() {

    currentView = "chat";

    // Hide lobby
    lobby.hide();
    lobbyBanner.hide();
    lobbyMenu.hide();
    lobbyStatus.hide();
    lobbyInput.hide();

    // Show chat
    header.show();
    chatBox.show();
    usersBox.show();
    input.show();

    input.focus();

    screen.render();
}


// ============================================
// APPEND ELEMENTS
// ============================================

screen.append(lobby);

lobby.append(lobbyBanner);
lobby.append(lobbyMenu);
lobby.append(lobbyStatus);
lobby.append(lobbyInput);

screen.append(header);
screen.append(chatBox);
screen.append(usersBox);
screen.append(input);


// ============================================
// EXIT
// ============================================

screen.key(["C-c"], () => {
    process.exit(0);
});


// ============================================
// INITIAL VIEW
// ============================================

showLobby();


// ============================================
// EXPORT
// ============================================

module.exports = {

    screen,

    lobby,
    lobbyBanner,
    lobbyMenu,
    lobbyStatus,
    lobbyInput,

    header,
    chatBox,
    usersBox,
    input,

    showLobby,
    showChat,

    get currentView() {
        return currentView;
    }

};