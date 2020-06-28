const mongoose = require("mongoose")

/**
 * chat_list
 * type:类型  private（私聊）  group（群聊）
 */
const dialogueSchema = new mongoose.Schema({
    "userID": String,
    "chat_list": []
    // { "id": String, "type": String, "message": String, "date": { "type": Date, "default": Date.now() }, "unRead": Number }
})

module.exports = mongoose.model("dialogue", dialogueSchema);