const mongoose = require("mongoose")

const dynamicSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },	//用户id
    dynamicList: [
        { text: String, imgList: Array, comments: Array, like: Number, date: Date, address: String }
    ],
})

module.exports = mongoose.model("dynamic", dynamicSchema);