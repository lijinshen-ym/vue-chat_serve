const Message = require("../model/messageModel")
const User = require("../model/userModel")
const Friend = require("../model/friendModel")

const { verifyToken } = require("../tool/token")

// 发布留言
exports.published = async data => {
    let { token, id, content } = data
    let tokenRes = verifyToken(token)
    let idMessage = await Message.findOne({ userID: id })
    let result = null

    if (idMessage) {
        let messages = idMessage.messages
        messages.unshift({
            user: tokenRes.id,
            content,
            nickName: null,
            children: [],
            date: new Date()
        })
        result = await Message.updateOne({ userID: id }, { $set: { messages } })
    } else {
        result = await Message.create({
            userID: id,
            messages: [{
                user: tokenRes.id,
                content,
                nickName: null,
                children: [],
                date: new Date()
            }]

        })
    }
    if (result.userID || result.nModified) {
        return { status: 1, msg: "发表成功" }
    } else {
        return { stats: 0, msg: "发表失败" }
    }
}

// 获取留言
exports.acquire = async data => {
    let { token, id, page, limit } = data
    let tokenRes = verifyToken(token)
    let user = await User.findById(tokenRes.id)
    let idMessage = await Message.findOne({ userID: id }).populate("messages.user", ["name", "avatars"])
    if (idMessage) {
        let messages = idMessage.messages
        if (messages.length == 0) {
            return {
                messages
            }
        } else {
            let mount = messages.length
            let maxPage = Math.ceil(mount / limit)
            if (page > maxPage) {
                return {
                    messages: [],
                }
            } else {
                let skip = (page - 1) * limit
                let oldMessage = messages.splice(skip, limit)
                let tokenFriend = await Friend.findOne({ userID: tokenRes.id })
                let friend_list = tokenFriend.friend_list
                let newMessage = []
                oldMessage.map(async item => {
                    let obj = {
                        user: item.user,
                        content: item.content,
                        _id: item._id,
                        date: item.date
                    }
                    obj.children = []
                    if (item.user._id.toString() == tokenRes.id) {
                        obj.nickName = user.name
                        item.children.map(item3 => {
                            if (item3.user.toString() == tokenRes.id.toString()) {
                                obj.children.push({
                                    user: item3.user,
                                    name: user.name,
                                    content: item3.content
                                })
                            } else {
                                let index = friend_list.findIndex(item5 => {
                                    return item3.user.toString() == item5.user.toString()
                                })
                                obj.children.push({
                                    user: item3.user,
                                    name: friend_list[index].nickName,
                                    content: item3.content
                                })
                            }
                        })
                        newMessage.push(obj)
                    } else {
                        let index = friend_list.findIndex(item2 => {
                            return item2.user.toString() == item.user._id.toString()
                        })
                        if (index > -1) {
                            obj.nickName = friend_list[index].nickName
                            item.children.map(item3 => {
                                if (item3.user.toString() == tokenRes.id.toString()) {
                                    obj.children.push({
                                        user: item3.user,
                                        name: user.name,
                                        content: item3.content
                                    })
                                } else {
                                    let index = friend_list.findIndex(item5 => {
                                        return item3.user.toString() == item5.user.toString()
                                    })
                                    obj.children.push({
                                        user: item3.user,
                                        name: friend_list[index].nickName,
                                        content: item3.content
                                    })
                                }
                            })
                            newMessage.push(obj)
                        }
                    }

                })
                return {
                    messages: newMessage,
                }
            }
        }
    } else {
        return {
            messages: []
        }
    }
}

// 回复留言
exports.reply = async data => {
    let { token, id, messageID, date, content } = data
    let tokenRes = verifyToken(token)
    let idMessage = await Message.findOne({ userID: id })
    let messages = idMessage.messages
    let index = messages.findIndex(item => {
        return messageID.toString() == item.user.toString() && new Date(item.date).getTime() == new Date(date).getTime()
    })
    messages[index].children.unshift({
        user: tokenRes.id,
        date: new Date(),
        content
    })
    let result = await Message.updateOne({ userID: id }, { $set: { messages } })
    if (result.nModified > 0) {
        return { status: 1, msg: "回复成功" }
    }
}