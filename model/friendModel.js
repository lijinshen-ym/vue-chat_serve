const mongoose = require("mongoose")
let value = (function () {
    let val = {}
    for (var i = 0; i < 26; i++) {
        let res = String.fromCharCode(65 + i);
        val[res] = [
            { "id": String, "nickName": String }
        ]
    }
    return val
})()
const friendSchema = new mongoose.Schema({
    userID: String,	//用户id
    friend_list: Array,
    group_list: value,
    // group_list: [
    //     {
    //         group: String,
    //         list: [
    //             { id: String, nickName: String }
    //         ]
    //     }
    // ],   
    //分组列表
    // 存储的格式
    // key(分组):[{好友},{好友}]
    // 例：
    //  A:[
    //    {id,nickName}
    //  ]
})
module.exports = mongoose.model("friend", friendSchema);