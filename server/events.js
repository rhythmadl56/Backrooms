const {
    createRoom,
    getRoom,
    getAllRooms
} = require("./rooms");

const {
    createUser,
    removeUser,
    getUser,
    getAllUsers
} = require("./users");

function broadcastUsers(io) {

    const usernames = getAllUsers()
        .map(user => user.username);

    io.emit("users-list", usernames);
}


function registerSocketEvents(io) {

    io.on("connection", (socket) => {

        const user = createUser(socket.id);
        console.log(`${user.username} connected.`);
        socket.emit("welcome", "Welcome to Backrooms!");
        socket.broadcast.emit("system-message", {
            message: `${user.username} joined the chat.`
        });

        broadcastUsers(io);

        socket.on("chat-message", (message) => {

            const user = getUser(socket.id);

            console.log(`${user.username}: ${message}`);

            io.emit("chat-message", {
                username: user.username,
                color: user.color,
                message
            });
        });

        socket.on("get-users", () => {

            const usernames = getAllUsers()
                .map(user => user.username);

            socket.emit("users-list", usernames);
        });

        socket.on("disconnect", () => {

            const user = getUser(socket.id);

            if (!user) {
                return;
            }

            console.log(`${user.username} disconnected.`);

            removeUser(socket.id);

            socket.broadcast.emit("system-message", {
                message: `${user.username} left the chat.`
            });
            broadcastUsers(io);
        });
        socket.on("create-room", (roomName) => {

            if (!roomName || !roomName.trim()) {

                socket.emit("room-error", "Room name cannot be empty.");

                return;
            }

            const room = createRoom(
                roomName.trim(),
                socket.id
            );

            socket.join(room.code);

            const user = getUser(socket.id);

            user.room = room.code;

            socket.emit("room-created", {
                code: room.code,
                name: room.name
            });

        });
        socket.on("join-room", (roomCode) => {

            const code = roomCode.trim().toUpperCase();

            const room = getRoom(code);

            if (!room) {

                socket.emit(
                    "room-error",
                    "Room not found."
                );

                return;
            }

            socket.join(room.code);

            const user = getUser(socket.id);

            user.room = room.code;

            socket.emit("room-joined", {
                code: room.code,
                name: room.name
            });

        });
        socket.on("random-room", () => {

            const rooms = getAllRooms();

            if (rooms.length === 0) {

                socket.emit(
                    "room-error",
                    "There are no rooms available."
                );

                return;
            }

            const randomRoom =
                rooms[Math.floor(Math.random() * rooms.length)];

            socket.join(randomRoom.code);

            const user = getUser(socket.id);

            user.room = randomRoom.code;

            socket.emit("room-joined", {
                code: randomRoom.code,
                name: randomRoom.name
            });

        });

    });
}


module.exports = registerSocketEvents;