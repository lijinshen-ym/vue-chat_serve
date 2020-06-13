const mongoose = require("mongoose")

const applySchema = new mongoose.Schema({
    userID: String,	//用户id
    applyList: [
        { applyId: String, note: String, time: String }
    ],   //申请表
    // {note,applyId}
})

module.exports = mongoose.model("application", applySchema);