const User = require("../model/userModel")
const Friend = require("../model/friendModel")
const { verifyToken } = require("../tool/token")
const Application = require("../model/application")
const { chineseToPinYin } = require("../tool/parseChinese")
// 发送好友请求
exports.addition = async data => {
    let { token, id, note } = data
    let res = verifyToken(token)
    let result = await Application.findOne({ userID: id })
    let answer = null;
    if (!result) {
        answer = await Application.create({
            userID: id,
            applyList: [
                { note, applyId: res.id, time: new Date() }
            ]
        })
    } else {
        let arr = result.applyList
        let bool = arr.map(item => {
            return item.applyId == res.id
        })
        // 存在的话则先删除
        if (bool) {
            let sss = await Application.update({ userID: id }, { $pull: { applyList: { applyId: res.id } } })
        }
        answer = await Application.update({
            userID: id,
        }, {
            '$push': {
                applyList: { note, applyId: res.id, time: new Date() }
            }
        });
    }
    if (answer.nModified == 0) {
        return {
            status: 0,
            msg: "请求发送失败，请稍后再试"
        }

    } else {
        return {
            status: 1,
            msg: "请求发送成功"
        }
    }
}

// 获取好友请求
exports.acquire = async data => {
    let res = verifyToken(data.token)
    let result = await Application.findOne({ userID: res.id })
    // type 为 number 时获取的是请求的数量
    // type 为 details 时获取的是请求的详情
    if (data.type == "number") {
        if (result) {
            return result
        } else {
            return {
                applyList: []
            }
        }
    } else {
        let acquire = {
            userID: result.userID,
            applyList: []
        }
        result.applyList.map(item => {
            acquire.applyList.push({
                note: item.note,
                applyId: item.applyId,
                time: item.time
            })
        })
        let arr = await Promise.all(acquire.applyList.map(async item => {
            let user = await User.findOne({ _id: item.applyId })
            item.avatars = user.avatars
            item.name = user.name
            return item
        }))
        return acquire
    }

}

// 处理好友请求
exports.deal = async data => {
    let { token, applyId, operation, nickName } = data
    let tokenRes = verifyToken(token)
    if (operation == "agree") {
        let table = await Friend.findOne({ userID: tokenRes.id })
        let applyTable = await Friend.findOne({ userID: applyId })
        let answer = null
        if (table) {
            answer = await Friend.update({
                userID: tokenRes.id
            }, { $push: { friend_list: { user: applyId, nickName } } })
            if (answer.nModified) {
                let sss = await Application.update({ userID: tokenRes.id }, { $pull: { applyList: { applyId } } })
                answer = {
                    msg: "已同意该用户的好友请求",
                    status: 1
                }
            }
        } else {
            answer = await Friend.create({
                userID: tokenRes.id,
                friend_list: [{ "user": applyId, nickName }]
            });
            if (answer) {
                let sss = await Application.update({ userID: tokenRes.id }, { $pull: { applyList: { applyId } } })
                answer = {
                    msg: "已同意该用户的好友请求",
                    status: 1
                }
            }
        }
        if (applyTable) {
            let applyResult = await Friend.update({
                userID: applyId
            }, { $push: { friend_list: { user: tokenRes.id, nickName } } })
        } else {
            let c_s = await Friend.create({
                userID: applyId,
                friend_list: [{ "user": tokenRes.id, nickName }]
            });
        }
        return answer
    } else {
        let sss = await Application.update({ userID: tokenRes.id }, { $pull: { applyList: { applyId } } })
        return {
            status: 0,
            msg: "已经拒绝该用户的请求"
        }
    }

}

// 获取好友
exports.friends = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let result = await Friend.findOne({ userID: tokenRes.id }).populate("friend_list.user", "avatars")
    let friend_list = result.friend_list
    let val = {}
    // 生成大写字母并生成分组对象
    for (var i = 0; i < 26; i++) {
        let res = String.fromCharCode(65 + i);
        val[res] = []
    }
    // 将好友昵称文字转为拼音并将放入分组对象中
    for (let i = 0; i < friend_list.length; i++) {
        let pinyin = chineseToPinYin(friend_list[i].nickName)
        let initial = pinyin.substr(0, 1)
        val[initial].push(friend_list[i])
    }
    return { friends: val, total: friend_list.length }
}

// 判断用户是否为好友
exports.judge = async data => {
    let { token, id } = data
    let tokenRes = verifyToken(token)
    let res = await Friend.findOne({ userID: tokenRes.id })
    let friend_list = res.friend_list
    let index = friend_list.findIndex(item => {
        return item.user == id
    })
    if (index) {
        return { status: 1, isFriend: true }
    } else {
        return { status: 1, isFriend: false }
    }
}