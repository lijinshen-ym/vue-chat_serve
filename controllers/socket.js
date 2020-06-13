const { verifyToken } = require("../tool/token")
const urserSocket = require("../model/usersocket")
const usersocket = require("../model/usersocket")
module.exports = (io, socket) => {
    socket.on("submit", async (data) => {
        let { id } = verifyToken(data)
        let result = await urserSocket.findOne({ userId: id })
        if (result) {
            let res = await urserSocket.updateOne({ userId: id }, { socketId: socket.id })
        } else {
            let res = await urserSocket.create({
                userId: id,
                socketId: socket.id
            })
        }
        // socket
        // let result = users.find(item => {
        //     return item.userName == data.userName
        // })
        // socket.emit("login", result)
        // if (!result) {
        //     // 存储当前登陆用户的信息
        //     socket.userName = data.userName
        //     socket.avatar = data.avatar

        //     // 加入到用户数组
        //     users.push(data)
        //     socket.emit("loginSuccess", data)

        //     io.emit("addUser", data)
        //     io.emit("userList", users)
        // }
    })

    // //发送信息
    // socket.on("sendMsg", data => {
    //     io.emit("sendAll", data)
    // })

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