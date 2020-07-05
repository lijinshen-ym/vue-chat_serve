const { verifyToken } = require("../tool/token")
const User = require("../model/userModel")
const { saveChat } = require("../controllers/c_chat")

exports.avatars = async (token, url) => {
    let userToken = verifyToken(token)
    let result = await User.updateOne({ _id: userToken.id }, { avatars: url })
    if (result.nModified) {
        return {
            status: 1,
            msg: "修改成功"
        }
    } else {
        return {
            status: 0,
            msg: "修改失败"
        }
    }
}

exports.chatMsg = async (data) => {
    let res = await saveChat(data)
    return { status: 1, msg: "上传成功", type: "private" }
}