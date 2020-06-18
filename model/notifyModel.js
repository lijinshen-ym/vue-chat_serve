const mongoose = require("mongoose")

const notifySchema = new mongoose.Schema({
    userID: String,	//用户id
    notify_list: [
        { "user": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "message": String, "genre": String, "date": { type: Date, default: Date.now() } }
    ],
})
module.exports = mongoose.model("notify", notifySchema);