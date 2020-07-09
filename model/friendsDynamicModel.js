const mongoose = require("mongoose")

const friendDynamicSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },	//用户id
    dynamicList: [
        { friend: String, index: Number }
    ],
})

module.exports = mongoose.model("fdList", friendDynamicSchema);