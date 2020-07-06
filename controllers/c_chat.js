const { verifyToken } = require("../tool/token")
const Chat = require("../model/chatModel")
const GroupChat = require("../model/groupChatModel")
const Group = require("../model/groupModel")
const Friend = require("../model/friendModel")
const Dialogue = require("../model/dialogueModel")
const User = require("../model/userModel")

// 存储聊天记录
exports.saveChat = async data => {
    let { id, message, token, type, chatType } = data
    let tokenRes = verifyToken(token)
    if (chatType == "private") { //私聊
        let tokenChat = await Chat.findOne({ fromUser: tokenRes.id, toUser: id })
        let chatRes = ""
        // 存储到token用户的聊天表中
        if (tokenChat) {
            chatRes = await Chat.updateOne({
                fromUser: tokenRes.id, toUser: id
            }, {
                $push: {
                    msg_list:
                        { msg: message, type, belong: tokenRes.id, date: new Date() }
                }
            })
        } else {
            chatRes = await Chat.create({
                fromUser: tokenRes.id,
                toUser: id,
                msg_list: [
                    { msg: message, type, belong: tokenRes.id, date: new Date() }
                ]
            })
        }
        // 存储到好友的聊天表中
        let idChat = await Chat.findOne({ fromUser: id, toUser: tokenRes.id })
        if (idChat) {
            chatRes = await Chat.updateOne({
                fromUser: id, toUser: tokenRes.id
            }, {
                $push: {
                    msg_list:
                        { msg: message, type, belong: tokenRes.id, date: new Date() }
                }
            })
        } else {
            chatRes = await Chat.create({
                fromUser: id,
                toUser: tokenRes.id,
                msg_list: [
                    { msg: message, type, belong: tokenRes.id, date: new Date() }
                ]

            })
        }

        // 更新对话信息(token用户)
        let dialogRes = null
        let dialogToken = await Dialogue.findOne({ userID: tokenRes.id })
        if (dialogToken) {
            let chat_list = dialogToken.chat_list
            let index = chat_list.findIndex(item => {
                return item.id == id
            })
            if (index >= 0) {
                chat_list[index].message = message
                chat_list[index].date = new Date()
                chat_list[index].msgType = type
                dialogRes = await Dialogue.updateOne({ "userID": tokenRes.id }, { $set: { "chat_list": chat_list } })
            } else {
                chat_list.push({
                    id, type: chatType, msgType: type, message, date: new Date(), unRead: 0
                })
                dialogRes = await Dialogue.updateOne({ "userID": tokenRes.id }, { $set: { "chat_list": chat_list } })
            }
        } else {
            dialogRes = await Dialogue.create({
                "userID": tokenRes.id,
                "chat_list": [{ "id": id, "type": chatType, "msgType": type, "message": message, "date": new Date(), "unRead": 0 }]
            })
        }
        // 更新对话信息（好友）
        let dialogID = await Dialogue.findOne({ userID: id })
        if (dialogID) {
            let chat_list = dialogID.chat_list
            let index = chat_list.findIndex(item => {
                return item.id == tokenRes.id
            })
            if (index >= 0) {
                chat_list[index].message = message
                chat_list[index].date = new Date()
                chat_list[index].msgType = type
                chat_list[index].unRead = chat_list[index].unRead + 1
                dialogRes = await Dialogue.updateOne({ "userID": id }, { $set: { "chat_list": chat_list } })
            } else {
                chat_list.push({
                    id: tokenRes.id, type: chatType, msgType: type, message, date: new Date(), unRead: 1
                })
                dialogRes = await Dialogue.updateOne({ "userID": id }, { $set: { "chat_list": chat_list } })
            }
        } else {
            dialogRes = await Dialogue.create({
                "userID": id,
                "chat_list": [{ "id": tokenRes.id, "msgType": type, "type": chatType, "message": message, "date": new Date(), "unRead": 1 }]
            })
        }
    } else { //群聊
        let group_chat = await GroupChat.findOne({ groupID: id })
        let chatRes = null
        if (group_chat) {
            chatRes = await GroupChat.updateOne({
                groupID: id
            }, {
                $push: {
                    msg_list:
                        { msg: message, type, belong: tokenRes.id, date: new Date() }
                }
            })
        } else {
            chatRes = await GroupChat.create({
                "groupID": id,
                "msg_list": [{ "msg": message, "type": type, "belong": tokenRes.id, "date": new Date() }]
            })
        }

    }

}

// 获取聊天记录
exports.history = async data => {
    let { token, id, type } = data
    if (type == "private") {
        let tokenRes = verifyToken(token)
        let chats = await Chat.findOne({ fromUser: tokenRes.id, toUser: id }).populate("fromUser").populate("toUser")
        let friend = await Friend.findOne({ userID: tokenRes.id })
        let index = friend.friend_list.findIndex(item => {
            return id == item.user
        })
        let name = friend.friend_list[index].nickName
        if (chats) {
            return {
                chats,
                name
            }
        } else {
            return {
                chats: {
                    msg_list: []
                },
                name
            }
        }
    } else {
        let chats = await GroupChat.findOne({ groupID: id }).populate("groupID")
        if (chats) {
            let msg_list = chats.msg_list
            let res = await Promise.all(msg_list.map(async item => {
                let user = await User.findById(item.belong)
                item.user = {
                    name: user.name,
                    avatars: user.avatars
                }
                return item
            }))
            let name = chats.groupID.name
            return {
                chats: {
                    msg_list
                },
                name
            }
        } else {
            let group = await Group.findById(id)
            let name = group.name
            return {
                chats: {
                    msg_list: []
                },
                name
            }
        }
    }
}