
const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    msg_list: []
})
module.exports = mongoose.model("chat", chatSchema);
/**
 * msg_list:
 * belong 表示该信息是谁发的，my表示是我发的，friend表示是好友发的
 * type  表示信息的类型，分为voice（语音），text（文字），image（图片)，file（文件）
 */
// { msg: String, type: String, belong: String, date: { type: Date, default: Date.now() } }