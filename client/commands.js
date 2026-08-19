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

function helpCommand(context) {

    context.ui.chatBox.log("");
    context.ui.chatBox.log("========== BACKROOMS COMMANDS ==========");

    for (const [name, command] of Object.entries(commands)) {

        context.ui.chatBox.log(
            `/${name.padEnd(10)} - ${command.description}`
        );

    }

    context.ui.chatBox.log("========================================");
    context.ui.chatBox.log("");

    context.ui.screen.render();
}


// --------------------------------

function usersCommand(context) {

    context.socket.emit("get-users");

}


// --------------------------------
// COMMAND REGISTRY
// --------------------------------

const commands = {

    help: {
        description: "Show all commands",
        execute: helpCommand
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