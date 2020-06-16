const mongoose = require("mongoose")
const socketSchema = new mongoose.Schema({
    userId: String,
    socketId: String
})

module.exports = mongoose.model("userSocket", socketSchema)