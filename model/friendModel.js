const mongoose = require("mongoose")
// let value = (function () {
//     let val = {}
//     for (var i = 0; i < 26; i++) {
//         let res = String.fromCharCode(65 + i);
//         val[res] = [
//             // { "id": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String }
//             { "id": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String }
//         ]
//     }
//     return val
// })()
const friendSchema = new mongoose.Schema({
    userID: String,	//用户id
    friend_list: [
        { "user": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String }
    ],
    // group_list:value
    // group_list: {
    //     A: [
    //         { "id": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String }
    //     ],
    //     B: [
    //         { "id": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String }
    //     ],
    //     C: [
    //         { "id": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String }
    //     ],
    //     D: [
    //         { "id": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String }
    //     ]
    // }
})
module.exports = mongoose.model("friend", friendSchema);