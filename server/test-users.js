const {
    createUser,
    getUser,
    getAllUsers,
    isUsernameTaken,
    generateRandomUsername
} = require("./users");


console.log("Random username:");
console.log(generateRandomUsername());


console.log("\nCreating user:");

const user = createUser(
    "socket123",
    "GhostFox"
);

console.log(user);


console.log("\nGet user:");

console.log(
    getUser("socket123")
);


console.log("\nIs username taken?");

console.log(
    isUsernameTaken("GhostFox")
);


console.log("\nAll users:");

console.log(
    getAllUsers()
);