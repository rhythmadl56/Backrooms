const {
    createUser,
    removeUser,
    getUser,
    getAllUsers
} = require("./users");

function registerSocketEvents(io) {
    io.on("connection", (socket) => {
        const user = createUser(socket.id);
        socket.broadcast.emit("system-message", {
            message: `${user.username} joined the chat.`
        });

        console.log(`${user.username} connected.`);

        socket.emit("welcome", "Welcome to Backrooms!");

        socket.on("chat-message", (message) => {
            console.log(`${socket.id}: ${message}`);

            const user = getUser(socket.id);

            io.emit("chat-message", {
                username: user.username,
                color: user.color,
                message
            });
        });

        socket.on("get-users", () => {
            const usernames = getAllUsers().map(user => user.username);
            socket.emit("users-list", usernames);
        });

        socket.on("disconnect", () => {
            const user = getUser(socket.id);
            console.log(`${user.username} disconnected.`);
            socket.broadcast.emit("system-message", {
                message: `${user.username} left the chat.`
            });
            removeUser(socket.id);
        });
    });
}

module.exports = registerSocketEvents;