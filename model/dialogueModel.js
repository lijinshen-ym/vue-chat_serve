const mongoose = require("mongoose")

/**
 * chat_list
 * type:类型  private（私聊）  group（群聊）
 */
const chatSchema = new mongoose.Schema({
    userID: String,
    chat_list: [
        { id: String, type: String, message: String, date: String }
    ]
})

module.exports = mongoose.model("chat", chatSchema);