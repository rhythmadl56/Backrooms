const ui = require("./ui");

ui.chatBox.log("Welcome to Backrooms!");
ui.chatBox.log("GhostFox joined.");
ui.chatBox.log("NeonWolf: Hello!");

ui.usersBox.setContent(`
GhostFox
NeonWolf
`);

ui.input.focus();

ui.screen.render();