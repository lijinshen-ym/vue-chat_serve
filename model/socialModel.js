const mongoose = require("mongoose")

const socialSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },	//用户id
    dynamicList: [
        { friend: String, date: Date }
    ],
})

module.exports = mongoose.model("social", socialSchema);