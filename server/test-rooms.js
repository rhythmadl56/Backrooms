const {
    createRoom,
    getRoom,
    getAllRooms
} = require("./rooms");


const room = createRoom(
    "Late Night Coding",
    "socket123"
);

console.log("Created room:");
console.log(room);


console.log("\nFind room:");
console.log(getRoom(room.code));


console.log("\nAll rooms:");
console.log(getAllRooms());