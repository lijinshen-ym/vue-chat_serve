const { verifyToken } = require("../tool/token")
const Chat = require("../model/chatModel")

// 存储聊天记录
exports.saveChat = async data => {
    let { id, message, token, type } = data
    let tokenRes = verifyToken(token)
    let tokenChat = await Chat.findOne({ fromUser: tokenRes.id, toUser: id })
    let chatRes = ""
    if (tokenChat) {
        chatRes = await Chat.updateOne({
            fromUser: tokenRes.id, toUser: id
        }, {
            $push: {
                msg_list:
                    { msg: message, type, belong: "my", date: new Date() }
            }
        })
    } else {
        chatRes = await Chat.create({
            fromUser: tokenRes.id,
            toUser: id,
            msg_list: [
                { msg: message, type, belong: "my", date: new Date() }
            ]
        })
    }
    let idChat = await Chat.findOne({ fromUser: id, toUser: tokenRes.id })
    if (idChat) {
        chatRes = await Chat.updateOne({
            fromUser: id, toUser: tokenRes.id
        }, {
            $push: {
                msg_list:
                    { msg: message, type, belong: "friend", date: new Date() }
            }
        })
    } else {
        chatRes = await Chat.create({
            fromUser: id,
            toUser: tokenRes.id,
            msg_list: [
                { msg: message, type, belong: "friend", date: new Date() }
            ]

        })
    }
}

// 获取聊天记录
exports.history = async data => {
    let { token, id } = data
    let tokenRes = verifyToken(token)
    let tokenChat = await Chat.findOne({ fromUser: tokenRes.id, toUser: id }).populate("fromUser").populate("toUser")
    if (tokenChat) {
        return tokenChat
    } else {
        return {}
    }

}