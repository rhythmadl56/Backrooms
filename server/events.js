const {
    createRoom,
    getRoom,
    getAllRooms
} = require("./rooms");

const {
    createUser,
    removeUser,
    getUser,
    getAllUsers,
    isUsernameTaken,
    generateRandomUsername
} = require("./users");


// ============================================
// BROADCAST ONLINE USERS
// ============================================

function broadcastUsers(io) {

    const usernames = getAllUsers()
        .map(user => user.username);

    io.emit("users-list", usernames);

}


// ============================================
// SOCKET EVENTS
// ============================================

function registerSocketEvents(io) {
    io.on("connection", (socket) => {
        console.log(
            `Socket connected: ${socket.id}`
        );
        socket.on("poke-user", (targetUsername) => {

            console.log(
                `[POKE DEBUG] Received poke request for: ${targetUsername}`
            );

        });


        // ====================================
        // WELCOME
        // ====================================

        socket.emit(
            "welcome",
            "Welcome to Backrooms!"
        );


        // ====================================
        // CUSTOM USERNAME
        // ====================================

        socket.on("set-username", (requestedUsername) => {

            if (!requestedUsername) {

                socket.emit(
                    "username-error",
                    "Username cannot be empty."
                );

                return;
            }

            const username = requestedUsername.trim();


            if (username.length < 3) {

                socket.emit(
                    "username-error",
                    "Username must be at least 3 characters."
                );

                return;
            }


            if (username.length > 16) {

                socket.emit(
                    "username-error",
                    "Username cannot exceed 16 characters."
                );

                return;
            }


            if (!/^[a-zA-Z0-9_]+$/.test(username)) {

                socket.emit(
                    "username-error",
                    "Only letters, numbers and _ are allowed."
                );

                return;
            }


            if (isUsernameTaken(username)) {

                socket.emit(
                    "username-error",
                    "That username is already taken."
                );

                return;
            }


            const user = createUser(
                socket.id,
                username
            );


            console.log(
                `${user.username} connected.`
            );


            socket.emit("username-set", {
                username: user.username,
                color: user.color
            });


            socket.broadcast.emit("system-message", {
                message: `${user.username} joined Backrooms.`
            });


            broadcastUsers(io);

        });


        // ====================================
        // RANDOM USERNAME
        // ====================================

        socket.on("generate-username", () => {

            let username;

            do {

                username = generateRandomUsername();

            } while (isUsernameTaken(username));


            const user = createUser(
                socket.id,
                username
            );


            console.log(
                `${user.username} connected.`
            );


            socket.emit("username-set", {
                username: user.username,
                color: user.color
            });


            socket.broadcast.emit("system-message", {
                message: `${user.username} joined Backrooms.`
            });


            broadcastUsers(io);

        });


        // ====================================
        // CHAT MESSAGE
        // ====================================

        socket.on("chat-message", (message) => {

            const user = getUser(socket.id);


            if (!user) {

                socket.emit(
                    "username-error",
                    "Choose a username first."
                );

                return;
            }


            if (!user.room) {

                socket.emit(
                    "room-error",
                    "You must join a room before sending messages."
                );

                return;
            }


            console.log(
                `[${user.room}] ${user.username}: ${message}`
            );


            io.to(user.room).emit("chat-message", {

                username: user.username,

                color: user.color,

                message

            });

        });


        // ====================================
        // GLOBAL ONLINE USERS
        // ====================================

        socket.on("get-users", () => {

            const usernames = getAllUsers()
                .map(user => user.username);

            socket.emit(
                "users-list",
                usernames
            );

        });
               
        socket.on("poke-user", (targetUsername) => {

            const sender = getUser(socket.id);

            if (!sender) {

                socket.emit(
                    "poke-error",
                    "Choose a username first."
                );

                return;
            }


            if (!targetUsername || !targetUsername.trim()) {

                socket.emit(
                    "poke-error",
                    "Usage: /poke <username>"
                );

                return;
            }


            const targetName = targetUsername.trim();

            const target = getAllUsers().find(
                user =>
                    user.username.toLowerCase() ===
                    targetName.toLowerCase()
            );
            console.log("[POKE TARGET]", target);


            if (!target) {

                socket.emit(
                    "poke-error",
                    `User "${targetName}" is not online.`
                );

                return;
            }

            if (target.socketId === socket.id) {

                socket.emit(
                    "poke-error",
                    "You cannot poke yourself."
                );

                return;
            }

            io.to(target.socketId).emit(
                "user-poked",
                {
                    username: sender.username
                }
            );

            socket.emit(
                "poke-sent",
                {
                    username: target.username
                }
            );

        });

        socket.on("create-room", (roomName) => {

            const user = getUser(socket.id);


            if (!user) {

                socket.emit(
                    "username-error",
                    "Choose a username first."
                );

                return;
            }


            if (!roomName || !roomName.trim()) {

                socket.emit(
                    "room-error",
                    "Room name cannot be empty."
                );

                return;
            }


            const room = createRoom(
                roomName.trim(),
                socket.id
            );


            socket.join(room.code);


            user.room = room.code;


            socket.emit("room-created", {

                code: room.code,

                name: room.name

            });

        });


        // ====================================
        // JOIN ROOM
        // ====================================

        socket.on("join-room", (roomCode) => {

            const user = getUser(socket.id);


            if (!user) {

                socket.emit(
                    "username-error",
                    "Choose a username first."
                );

                return;
            }


            const code = roomCode
                .trim()
                .toUpperCase();


            const room = getRoom(code);


            if (!room) {

                socket.emit(
                    "room-error",
                    "Room not found."
                );

                return;
            }


            socket.join(room.code);


            user.room = room.code;


            socket.emit("room-joined", {

                code: room.code,

                name: room.name

            });

        });


        // ====================================
        // RANDOM ROOM
        // ====================================

        socket.on("random-room", () => {

            const user = getUser(socket.id);


            if (!user) {

                socket.emit(
                    "username-error",
                    "Choose a username first."
                );

                return;
            }


            const rooms = getAllRooms();


            if (rooms.length === 0) {

                socket.emit(
                    "room-error",
                    "There are no rooms available."
                );

                return;
            }


            const randomRoom =
                rooms[
                    Math.floor(
                        Math.random() * rooms.length
                    )
                ];


            socket.join(randomRoom.code);


            user.room = randomRoom.code;


            socket.emit("room-joined", {

                code: randomRoom.code,

                name: randomRoom.name

            });

        });


        // ====================================
        // DISCONNECT
        // ====================================

        socket.on("disconnect", () => {

            const user = getUser(socket.id);


            // Connected but never chose username
            if (!user) {

                console.log(
                    `Unregistered socket disconnected: ${socket.id}`
                );

                return;
            }


            console.log(
                `${user.username} disconnected.`
            );


            removeUser(socket.id);


            socket.broadcast.emit("system-message", {

                message:
                    `${user.username} left Backrooms.`

            });


            broadcastUsers(io);

        });

    });

}


module.exports = registerSocketEvents;