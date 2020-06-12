const mongoose = require("mongoose")
const socketSchame = new mongoose.Schema({
    userId: String,
    socketId: String
})

module.exports = mongoose.model("usersocket", socketSchame)