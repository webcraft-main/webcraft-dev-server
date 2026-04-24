// ==========================================
// Server (2026 Modern Socket.IO Rewrite)
// ==========================================

const { Server: IOServer } = require("socket.io");

function Server(socketioModule, slots) {
    this.eventHandlers = {};
    this.activeNicknames = {};
    this.activeAddresses = {};
    this.maxSlots = slots;
    this.usedSlots = 0;
    this.oneUserPerIp = true;

    // socketioModule is require("socket.io")
    // http server is created in server.js and passed here
    this.attach = (http) => {
        this.io = new IOServer(http, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        const s = this;

        this.io.on("connection", function (socket) {
            s.onConnection(socket);
        });
    };
}

// setWorld
Server.prototype.setWorld = function (world) {
    this.world = world;
};

// setLogger
Server.prototype.setLogger = function (fn) {
    this.log = fn;
};

// setOneUserPerIp
Server.prototype.setOneUserPerIp = function (enabled) {
    this.oneUserPerIp = enabled;
};

// on
Server.prototype.on = function (event, callback) {
    this.eventHandlers[event] = callback;
};

// sendMessage
Server.prototype.sendMessage = function (msg, socket) {
    const target = socket ? socket : this.io;
    target.emit("msg", {
        type: "generic",
        msg: msg
    });
};

// broadcastMessage
Server.prototype.broadcastMessage = function (msg, socket) {
    socket.broadcast.emit("msg", {
        type: "generic",
        msg: msg
    });
};

// kick
Server.prototype.kick = function (socket, msg) {
    if (this.log) this.log("Client " + this.getIp(socket) + " was kicked (" + msg + ").");

    if (socket._nickname != null)
        this.sendMessage(socket._nickname + " was kicked (" + msg + ").");

    socket.emit("kick", { msg });
    socket.disconnect();
};

// setPos
Server.prototype.setPos = function (socket, x, y, z) {
    socket.emit("setpos", { x, y, z });
};

// findPlayerByName
Server.prototype.findPlayerByName = function (name) {
    for (var p in this.world.players)
        if (p.toLowerCase().includes(name.toLowerCase()))
            return this.world.players[p];
    return null;
};

// onConnection
Server.prototype.onConnection = function (socket) {
    if (this.log) this.log("Client " + this.getIp(socket) + " connected.");

    if (this.maxSlots != null && this.usedSlots >= this.maxSlots) {
        this.kick(socket, "The server is full!");
        return;
    }

    if (this.activeAddresses[this.getIp(socket)] && this.oneUserPerIp) {
        this.kick(socket, "Multiple clients from same IP!");
        return;
    }

    this.activeAddresses[this.getIp(socket)] = true;
    this.usedSlots++;

    const s = this;

    socket.on("nickname", function (data) { s.onNickname(socket, data); });
    socket.on("setblock", function (data) { s.onBlockUpdate(socket, data); });
    socket.on("chat", function (data) { s.onChatMessage(socket, data); });
    socket.on("player", function (data) { s.onPlayerUpdate(socket, data); });
    socket.on("disconnect", function () { s.onDisconnect(socket); });
};

// sanitiseInput
Server.prototype.sanitiseInput = function (str) {
    return str.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\/g, "&quot");
};

Server.prototype.getIp = function (socket) {
    return socket.handshake.address;
};

// Export
if (typeof exports !== "undefined") {
    exports.Server = Server;
}
