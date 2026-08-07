const { parseCommand } = require("./commands");

console.log(parseCommand("/help"));

console.log(parseCommand("/room coding"));

console.log(parseCommand("/msg GhostFox Hello"));

console.log(parseCommand("hello everyone"));