const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    fromUser: mongoose.Schema.Types.ObjectId,	//用户id
    toUser: mongoose.Schema.Types.ObjectId,
    msgList: [//会话表
        { msg: String, belong: String, time: String }
        //belong 表示该信息是谁发的，my 表示是我发的，friend表示是好友发的
    ]
})

module.exports = mongoose.model("chat", chatSchema);