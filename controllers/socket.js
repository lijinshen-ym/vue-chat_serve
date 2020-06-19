const { verifyToken } = require("../tool/token")
const userSocket = require("../model/usersocket")
const User = require("../model/userModel")
const { saveChat } = require("../controllers/c_chat")
module.exports = (io, socket) => {
    // 登陆连接
    socket.on("submit", async (data) => {
        let { id } = verifyToken(data)
        let result = await userSocket.findOne({ userId: id })
        if (result) {
            let res = await userSocket.updateOne({ userId: id }, { socketId: socket.id })
        } else {
            let res = await userSocket.create({
                userId: id,
                socketId: socket.id
            })
        }
    })
    // 好友申请通知
    socket.on("deal", async data => {
        let { applyId, operation, token } = data
        let tokenRes = verifyToken(token)
        let user = await User.findOne({ _id: tokenRes.id })
        let socketUser = await userSocket.findOne({ userId: applyId })
        let name = user.name
        let opera = operation == "Refused" ? "拒绝" : "同意"
        io.to(socketUser.socketId).emit("notification", {
            msg: "用户" + name + opera + "了你的好友请求",
            date: new Date()
        })
    })

    //发送信息
    socket.on("sendMsg", async data => {
        let { id, token } = data
        let tokenRes = verifyToken(token)
        // 存储聊天记录
        let res = await saveChat(data)

        let socketUser = await userSocket.findOne({ userId: id })
        io.to(socketUser.socketId).emit("updateChat", { id: tokenRes.id })
    })

    // //发送图片
    // socket.on("sendFile", data => {
    //     io.emit("sendFileAll", data)
    // })

    // // 用户断开连接的时候
    // socket.on('disconnect', () => {
    //     // 把当前用户的信息从users中删除掉
    //     let idx = users.findIndex(item => item.userName === socket.userName)
    //     // 删除掉断开连接的这个人
    //     users.splice(idx, 1)
    //     // 1. 告诉所有人，有人离开了聊天室
    //     io.emit('delUser', {
    //         userName: socket.userName,
    //         avatar: socket.avatar
    //     })
    //     // 2. 告诉所有人，userList发生更新
    //     io.emit('userList', users)
    // })
}