const mongoose = require("mongoose")

const listSchema = new mongoose.Schema({
    userID: String,	//用户id
    group_list: [
        { "group": { type: mongoose.Schema.Types.ObjectId, ref: 'Groups' } }
    ],
})
module.exports = mongoose.model("groupList", listSchema); 