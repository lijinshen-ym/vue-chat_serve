const userSocket = require("../model/userSocketModel")
const Group = require("../model/groupModel")
const User = require("../model/userModel")

const { saveChat } = require("../controllers/c_chat")
const { verifyToken } = require("../tool/token")

// 修改用户头像
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

// 处理用户发送的图片信息(私聊)
exports.chatMsg = async (data) => {
    data.chatType = "private"
    let res = await saveChat(data)
    let userToken = verifyToken(data.token)
    let socketUser = await userSocket.findOne({ userId: data.id })
    let socketToken = await userSocket.findOne({ userId: userToken.id })
    // 通知用户更新信息
    global.io.to(socketUser.socketId).emit("updateChat", { id: userToken.id, type: "private" })
    global.io.to(socketToken.socketId).emit("updateChat", { id: data.id, type: "private" })
    return { status: 1, msg: "上传成功", type: "private" }
}

// 处理用户发送的图片信息(群聊)
exports.groupMsg = async (data) => {
    data.chatType = "group"
    let res = await saveChat(data)
    let group = await Group.findById(data.id)
    let user_list = group.user_list
    // 通知用户更新信息
    let result = await Promise.all(user_list.map(async item => {
        let socketUser = await userSocket.findOne({ userId: item.user })
        global.io.to(socketUser.socketId).emit("updateChat", { id: data.id, type: "group" })
        return item
    }))
    return { status: 1, msg: "上传成功", type: "private" }
}

// 用户发表动态
exports.publish = async (data) => {

    return { status: 1, msg: "上传成功", type: "private" }
}