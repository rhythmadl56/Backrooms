const users = new Map();

const adjectives = [
    "Ghost",
    "Neon",
    "Shadow",
    "Cyber",
    "Crimson",
    "Silent",
    "Dark",
    "Phantom"
];

const animals = [
    "Fox",
    "Wolf",
    "Tiger",
    "Raven",
    "Hawk",
    "Byte",
    "Lion",
    "Dragon"
];

const colors = [
    "cyan",
    "green",
    "yellow",
    "magenta",
    "blue",
    "red"
];


function generateRandomUsername() {

    const adjective =
        adjectives[
            Math.floor(Math.random() * adjectives.length)
        ];

    const animal =
        animals[
            Math.floor(Math.random() * animals.length)
        ];

    const number =
        Math.floor(10 + Math.random() * 90);

    return `${adjective}${animal}${number}`;
}


function generateRandomColor() {

    return colors[
        Math.floor(Math.random() * colors.length)
    ];

}


function isUsernameTaken(username) {

    for (const user of users.values()) {

        if (
            user.username.toLowerCase() ===
            username.toLowerCase()
        ) {
            return true;
        }

    }

    return false;
}


function createUser(socketId, username) {

    const user = {

        socketId: socketId,

        username: username,

        color: generateRandomColor(),

        room: null

    };

    users.set(socketId, user);

    return user;
}


function removeUser(socketId) {

    users.delete(socketId);

}


function getUser(socketId) {

    return users.get(socketId);

}


function getAllUsers() {

    return Array.from(users.values());

}


module.exports = {

    createUser,
    removeUser,
    getUser,
    getAllUsers,

    isUsernameTaken,
    generateRandomUsername

};