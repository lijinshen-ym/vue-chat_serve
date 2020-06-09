const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    pwd: String,
    sex: {
        type: String,
        default: "男"
    },
    address: {
        type: String,
        default: "广东省-深圳市-宝安区"
    },
    birthday: {
        type: String,
        default: "2000-1-1"
    },
    avatars: {
        type: String,
        default: "http://localhost:3000/userImg/default.jpg"
    },
    signature: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model("User", userSchema);