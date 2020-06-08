const User = require("../model/userModel")
exports.login = async data => {
    const result = await User.findOne({ email: data.email })
    if (result) {

    } else {
        return "该邮箱未注册"
    }
}