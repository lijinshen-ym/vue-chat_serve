const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    userID: String,	//用户id
    messages: [
        { "user": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, "nickName": String, children: Array, date: Date }
    ],
})
module.exports = mongoose.model("message", messageSchema);