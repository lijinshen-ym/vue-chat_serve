const mongoose = require("mongoose")

const friendSchema = new mongoose.Schema({
    userID: String,	//用户id
    friend_list: Array,
    group_list: Object,   //分组列表
    // 存储的格式
    // key(分组):[{好友},{好友}]
    // 例：
    //  A:[
    //    {id,nickName}
    //  ]
})

module.exports = mongoose.model("friend", friendSchema);