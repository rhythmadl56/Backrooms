const rooms = new Map();

function generateRoomCode() {

    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
        code += characters[
            Math.floor(Math.random() * characters.length)
        ];
    }

    return code;
}


function createRoom(name, ownerId) {

    let code;

    // Make sure the generated code is unique
    do {
        code = generateRoomCode();
    } while (rooms.has(code));

    const room = {
        code,
        name,
        ownerId,
        createdAt: Date.now()
    };

    rooms.set(code, room);

    return room;
}


function getRoom(code) {
    return rooms.get(code);
}


function deleteRoom(code) {
    rooms.delete(code);
}


function getAllRooms() {
    return Array.from(rooms.values());
}


module.exports = {
    createRoom,
    getRoom,
    deleteRoom,
    getAllRooms
};