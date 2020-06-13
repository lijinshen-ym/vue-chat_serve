const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    userID: String,	//用户id
    chatList: Object,   //会话表
    // 存储的格式如下
    // id: {
    //     msgList: [
    //         { msg: "", belong: 'my', time: '' }
    //         //belong 表示该信息是谁发的，my 表示是我发的，friend表示是好友发的
    //     ],
    //     unread: 0
    // }
    // 例：
    //  A:[
    //    {id,nickName}
    //  ]
})

module.exports = mongoose.model("chat", chatSchema);