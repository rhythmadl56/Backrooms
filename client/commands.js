function parseCommand(input) {

    if (!input.startsWith("/")) {
        return null;
    }

    const parts = input.slice(1).trim().split(/\s+/);

    return {
        command: parts[0].toLowerCase(),
        args: parts.slice(1)
    };
}

// ----------------------------

function helpCommand(socket, args) {

    console.log("\n========== BACKROOMS COMMANDS ==========\n");

    for (const [name, command] of Object.entries(commands)) {
        console.log(`/${name.padEnd(10)} - ${command.description}`);
    }

    console.log("\n========================================\n");

}   

// ----------------------------

function usersCommand(socket) {
    socket.emit("get-users");
}

// ----------------------------

const commands = {

    help: {
        description: "Show all commands",
        execute: helpCommand
    },

    users: {
        description: "List all online users",
        execute: usersCommand
    }

};

// ----------------------------

function executeCommand(parsed, socket) {
    const command = commands[parsed.command];
    if (!command) {
        console.log("Unknown command.");
        return;
    }
    command.execute(socket, parsed.args);
}

// ----------------------------

module.exports = {

    parseCommand,
    executeCommand

};