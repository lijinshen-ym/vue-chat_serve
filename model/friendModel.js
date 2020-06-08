const mongoose = require("mongoose")

var friend = new mongoose.Schema({
    friendID: { type: Schema.Types.ObjectId, ref: 'User' },	//好友id
    nickname: { type: String },							//好友昵称
});

const friendSchema = new mongoose.Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },	//用户id
    children: [friend]
})
module.exports = mongoose.model("Friend", friendSchema);