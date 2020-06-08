const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    psw: String,
    sex: String,
    address: String,
    ctime: {
        type: Date,
        default: Date.now
    },
    avatars: String,
    signature: String
})

module.exports = mongoose.model("User", userSchema);