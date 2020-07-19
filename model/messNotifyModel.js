const mongoose = require("mongoose")

// 留言通知表
const messNotifySchema = new mongoose.Schema({
    userID: String,	//用户id
    notify_list: [],
    // { "user": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, "nickName": String, type: String, date: Date }
    //type:"message"||"reply"
})
module.exports = mongoose.model("messNotify", messNotifySchema);