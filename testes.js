class RoomHandler {
  constructor(socket, roomManager, io) {
    this.roomManager = roomManager;
    this.socket = socket;
    this.this.io = io;
  }

  handleCreateRoom(name) {
    const room = this.roomManager.createRoom(name);
    this.this.socket.emit("room_created", room);
  }

  handleRoomEnter() {
    const room = this.roomManager.getRoom(roomId);
    const roomsId = this.roomManager.rooms.map((room) => room.id);
    this.roomManager.addToRoom(roomId, user);

    if (room.members.length >= 1) {
      this.io.of("/").to(roomId).emit("game_can_start");
    }

    if (roomsId.includes(roomId)) {
      this.socket.join(roomId);
      this.io.of("/").to(roomId).emit("user_enter_room", user);
    }

    this.socket.on("disconnect", () => {
      this.roomManager.removeFromRoom(roomId, user.id);
      this.io.of("/").in(roomId).emit("user_leave_room", user);
    });
  }
}
