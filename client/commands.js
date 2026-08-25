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


// --------------------------------
// COMMAND FUNCTIONS
// --------------------------------

function quitCommand(context) {

    context.ui.chatBox.log(
        "[SYSTEM] Leaving Backrooms..."
    );

    context.ui.screen.render();

    setTimeout(() => {

        context.socket.disconnect();

        process.exit(0);

    }, 100);

}


// --------------------------------

function helpCommand(context) {

    context.ui.chatBox.log("");

    context.ui.chatBox.log(
        "========== BACKROOMS COMMANDS =========="
    );

    for (const [name, command] of Object.entries(commands)) {

        context.ui.chatBox.log(
            `/${name.padEnd(10)} - ${command.description}`
        );

    }

    context.ui.chatBox.log(
        "========================================"
    );

    context.ui.chatBox.log("");

    context.ui.screen.render();

}


// --------------------------------

function usersCommand(context) {

    context.socket.emit("get-users");

}


// --------------------------------
// POKE COMMAND
// --------------------------------

function pokeCommand(context, args) {

    context.ui.chatBox.log(
        `[DEBUG] Poke command received: ${args.join(" ")}`
    );

    context.ui.screen.render();

    if (args.length === 0) {

        context.ui.chatBox.log(
            "[ERROR] Usage: /poke <username>"
        );

        context.ui.screen.render();

        return;
    }

    const username = args[0];

    context.ui.chatBox.log(
        `[DEBUG] Sending poke to: ${username}`
    );

    context.socket.emit(
        "poke-user",
        username
    );

}


// --------------------------------
// COMMAND REGISTRY
// --------------------------------

const commands = {

    help: {
        description: "Show all commands",
        execute: helpCommand
    },

    users: {
        description: "List online users",
        execute: usersCommand
    },

    poke: {
        description: "Poke another user",
        execute: pokeCommand
    },

    quit: {
        description: "Exit Backrooms",
        execute: quitCommand
    }

};


// --------------------------------
// EXECUTE COMMAND
// --------------------------------

function executeCommand(parsed, context) {

    const command = commands[parsed.command];

    if (!command) {

        context.ui.chatBox.log(
            `[ERROR] Unknown command: /${parsed.command}`
        );

        context.ui.screen.render();

        return;
    }

    command.execute(context, parsed.args);

}


// --------------------------------

module.exports = {
    parseCommand,
    executeCommand
};