const adjectives = [
    "Shadow",
    "Ghost",
    "Neon",
    "Silent",
    "Dark",
    "Rapid",
    "Cyber",
    "Frozen",
    "Crimson",
    "Nova"
];

const nouns = [
    "Wolf",
    "Byte",
    "Fox",
    "Hacker",
    "Falcon",
    "Raven",
    "Phantom",
    "Tiger",
    "Storm",
    "Viper"
];

const colors = [
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan"
];

const users = new Map();

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateUsername() {
    return `${randomItem(adjectives)}${randomItem(nouns)}${Math.floor(Math.random() * 100)}`;
}

function createUser(socketId) {
    const user = {
        socketId,
        username: generateUsername(),
        color: randomItem(colors),
        room: "general"
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
    getAllUsers
};