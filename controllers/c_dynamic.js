const Dynamic = require("../model/dynamicModel")
const Friend = require("../model/friendModel")
const Social = require("../model/socialModel")
const User = require("../model/userModel")
const DyNotify = require("../model/dyNotifyModel")
const userSocket = require("../model/userSocketModel")
const ComNotify = require("../model/comNotifyModel")

const { verifyToken } = require("../tool/token")

// 发布动态
exports.published = async data => {
    let { token, text, imgList, comments, like, date, address } = data
    let tokenRes = verifyToken(token)
    let user = await User.findById(tokenRes.id)
    // 添加到我的动态表中
    let tokenDynamic = await Dynamic.findOne({ userID: tokenRes.id })
    if (tokenDynamic) {
        let logList = tokenDynamic.logList
        logList.unshift({
            text, imgList, comments, like, date, address
        })
        res = await Dynamic.updateOne({ userID: tokenRes.id }, { $set: { logList } })
    } else {
        res = await Dynamic.create({
            userID: tokenRes.id,
            logList: [{
                text, imgList, comments, like, date, address
            }]
        })
    }
    if (res.userID || res.nModified == 1) {

        let friends = await Friend.findOne({ userID: tokenRes.id })
        let friend_list = friends.friend_list
        friend_list.push({  //将token用户也添加到好友表中
            user: tokenRes.id,
            nickName: ""
        })
        let result = await Promise.all(friend_list.map(async item => {
            // 添加到我的动态表中成功后添加到朋友圈表中（我和好友的朋友圈）
            let d_list = await Social.findOne({ userID: item.user })
            if (d_list) {
                let dynamicList = d_list.dynamicList
                dynamicList.unshift({
                    friend: tokenRes.id, date,
                })
                let d_res = await Social.updateOne({ userID: item.user }, { $set: { dynamicList } })
            } else {
                let d_res = await Social.create({
                    userID: item.user,
                    dynamicList: [
                        { friend: tokenRes.id, date }
                    ]
                })
            }

            // 添加到好友新动态通知表中
            if (item.user != tokenRes.id) {
                let dy = await DyNotify.findOne({ userID: item.user })
                if (dy) {
                    let notify_list = dy.notify_list
                    notify_list[0] = {
                        fromUser: user._id,
                        fromImg: user.avatars
                    }
                    let d_res = await DyNotify.updateOne({ userID: item.user }, { $set: { notify_list } })
                } else {
                    let d_res = await DyNotify.create({
                        userID: item.user,
                        notify_list: [
                            {
                                ormUser: user._id,
                                fromImg: user.avatars
                            }
                        ]
                    })
                }
                let socketUser = await userSocket.findOne({ userId: item.user })
                global.io.to(socketUser.socketId).emit("getDyNotify")
            }
        }))
        return { status: 1, msg: "发布成功" }
    } else {
        return { status: 0, msg: "发布失败" }
    }

}

// 点赞
exports.giveALike = async data => {
    let { token, id, date } = data
    let tokenRes = verifyToken(token)
    let user = await User.findById(tokenRes.id)
    let idDynamic = await Dynamic.findOne({ userID: id })
    let logList = idDynamic.logList
    let index = logList.findIndex(item => {
        return new Date(item.date).getTime() == new Date(date).getTime()
    })
    let likeIndex = logList[index].like.findIndex(item2 => {
        return item2.id.toString() == user._id.toString()
    })
    let res = null
    if (likeIndex > -1) {
        logList[index].like.splice(likeIndex, 1)
        res = await Dynamic.updateOne({ userID: id }, { $set: { logList } })
    } else {
        logList[index].like.unshift({ id: user._id, nickName: null })
        res = await Dynamic.updateOne({ userID: id }, { $set: { logList } })
        if (res.nModified > 0) {
            if (tokenRes.id != id) {
                // 添加到通知表
                let comNotify = await ComNotify.findOne({ userID: id })
                let result = null
                if (comNotify) {
                    let obj = {
                        fromUser: tokenRes.id,
                        fromName: user.name,
                        toUser: null,
                        toName: null,
                        date: new Date(),
                        logDate: date,
                        type: "like",
                        content: null,
                        text: logList[index].text,
                        unRead: false,
                        id
                    }
                    let notify_list = comNotify.notify_list
                    notify_list.unshift(obj)
                    result = await ComNotify.updateOne({ userID: id }, { $set: { notify_list } })
                } else {
                    let notify_list = [{
                        fromUser: tokenRes.id,
                        fromName: user.name,
                        toUser: null,
                        toName: null,
                        date: new Date(),
                        logDate: date,
                        type: "like",
                        content: null,
                        text: logList[index].text,
                        unRead: false,
                        id
                    }]
                    result = await ComNotify.create({ userID: id, notify_list })
                }
                if (result.userID || result.nModified > 0) {
                    let socketUser = await userSocket.findOne({ userId: id })
                    global.io.to(socketUser.socketId).emit("getComNotify")
                }
            }
        }
    }
    return {}
}

// 评论
exports.comment = async data => {
    let { token, id, date, toUser, toName, content } = data
    let tokenRes = verifyToken(token)
    let user = await User.findById(tokenRes.id)
    let idDynamic = await Dynamic.findOne({ userID: id })
    let logList = idDynamic.logList
    let index = logList.findIndex(item => {
        return new Date(item.date).getTime() == new Date(date).getTime()
    })
    logList[index].comments.push({
        fromUser: user._id,
        fromName: user.name,
        toUser,
        toName,
        content,
    })
    let res = await Dynamic.updateOne({ userID: id }, { $set: { logList } })
    if (res.nModified == 1) {
        // 添加到通知表
        let arr = []
        if (toUser == id) {  //当toUser和id相同时，只需通知一个人(动态的主人)
            arr = [{ to: id, id: tokenRes.id, name: user.name }]
        } else if (user._id == id && toUser != id) { //当fromUser和id相同而toUser不同时，只需通知一个人（toUser）
            arr = [{ to: toUser, id: tokenRes.id, name: user.name }]
        } else { //不同时，则需要通知两个人
            arr = [{ to: id, id: tokenRes.id, name: user.name }, { to: toUser, id: tokenRes.id, name: user.name }]
        }
        let pro_result = await Promise.all(arr.map((async item => {
            let comNotify = await ComNotify.findOne({ userID: item.to })
            let result = null
            if (comNotify) {
                let obj = {
                    fromUser: item.id,
                    fromName: item.name,
                    toUser,
                    toName,
                    date: new Date(),
                    logDate: date,
                    type: "comment",
                    content,
                    text: logList[index].text,
                    unRead: false,
                    id
                }
                let notify_list = comNotify.notify_list
                notify_list.unshift(obj)
                result = await ComNotify.updateOne({ userID: id }, { $set: { notify_list } })
            } else {
                let notify_list = [{
                    fromUser: item.id,
                    fromName: item.name,
                    toUser,
                    toName,
                    date: new Date(),
                    logDate: date,
                    type: "comment",
                    content,
                    text: logList[index].text,
                    unRead: false,
                    id
                }]
                result = await ComNotify.create({ userID: item.to, notify_list })
            }
            if (result.userID || result.nModified > 0) {
                let socketUser = await userSocket.findOne({ userId: item.to })
                global.io.to(socketUser.socketId).emit("getComNotify")
            }
        })))
        return { status: 1, msg: "评论成功" }
    } else {
        return { status: 0, msg: "评论失败" }
    }

}
