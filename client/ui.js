const blessed = require("blessed");

const screen = blessed.screen({
    smartCSR: true,
    title: "Backrooms"
});

const header = blessed.box({
    top: 0,
    left: 0,
    width: "100%",
    height: 3,
    content: " BACKROOMS ",
    border: "line",
    align: "center",
    tags: true
});

const chatBox = blessed.log({
    top: 3,
    left: 0,
    width: "75%",
    height: "80%",
    border: "line",
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    mouse: true
});

const usersBox = blessed.box({
    top: 3,
    left: "75%",
    width: "25%",
    height: "80%",
    border: "line",
    label: " Users "
});

const input = blessed.textbox({
    bottom: 0,
    left: 0,
    width: "100%",
    height: 3,
    border: "line",
    inputOnFocus: true
});

screen.append(header);
screen.append(chatBox);
screen.append(usersBox);
screen.append(input);

screen.key(["escape", "q", "C-c"], () => process.exit(0));

module.exports = {
    screen,
    chatBox,
    usersBox,
    input
};