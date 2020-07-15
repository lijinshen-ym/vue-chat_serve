const mongoose = require("mongoose")

const visitorsSchema = new mongoose.Schema({
    userID: String,	//用户id
    count: Number,
    visitors: [
        { "user": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, "nickName": String, date: String }
    ],
})
module.exports = mongoose.model("visitor", visitorsSchema);