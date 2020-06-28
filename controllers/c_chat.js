const { verifyToken } = require("../tool/token")
const Chat = require("../model/chatModel")
const Friend = require("../model/friendModel")
const Dialogue = require("../model/dialogueModel")

// 存储聊天记录
exports.saveChat = async data => {
    let { id, message, token, type, chatType } = data
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


    // 更新对话信息 
    let dialogRes = null
    let dialogToken = await Dialogue.findOne({ userID: tokenRes.id })
    if (dialogToken) {
        let chat_list = dialogToken.chat_list
        let index = chat_list.findIndex(item => {
            console.log(item.id, id)
            return item.id == id
        })
        console.log(index)
        if (index >= 0) {
            chat_list[index].message = message
            chat_list[index].date = new Date()
            dialogRes = await Dialogue.updateOne({ "userID": tokenRes.id }, { $set: { "chat_list": chat_list } })
        } else {
            chat_list.push({
                id, type: chatType, message, date: new Date(), unRead: 1
            })
            dialogRes = await Dialogue.updateOne({ "userID": tokenRes.id }, { $set: { "chat_list": chat_list } })
        }
    } else {
        dialogRes = await Dialogue.create({
            "userID": tokenRes.id,
            "chat_list": [{ "id": id, "type": chatType, "message": message, "date": new Date(), "unRead": 1 }]
        })
    }
    console.log(dialogRes)

}

// 获取聊天记录
exports.history = async data => {
    let { token, id } = data
    let tokenRes = verifyToken(token)
    let tokenChat = await Chat.findOne({ fromUser: tokenRes.id, toUser: id }).populate("fromUser").populate("toUser")
    let friend = await Friend.findOne({ userID: tokenRes.id })
    let index = friend.friend_list.findIndex(item => {
        return id == item.user
    })
    let nickName = friend.friend_list[index].nickName
    if (tokenChat) {
        return {
            tokenChat,
            nickName
        }
    } else {
        return {
            tokenChat: {
                msg_list: []
            },
            nickName
        }
    }

}