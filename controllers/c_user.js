const User = require("../model/userModel")
const Friend = require("../model/friendModel")
const { verifyToken } = require("../tool/token")
const { decrypt } = require("../tool/crypto")
const Application = require("../model/application")

// 获取用户信息
exports.getInfo = async data => {
    if (data.id) {
        let users = await User.findOne({ _id: data.id })
        return users
    } else {
        let res = verifyToken(data.token)
        let users = await User.findOne({ _id: res.id })
        return users
    }

}

// 修改用户信息
exports.modify = async data => {
    let token = verifyToken(data.token)
    let { type, value } = data
    if (value.oldpwd) {
        let res = await User.findOne({ _id: token.id })
        let pwd = decrypt(res.pwd)
        if (pwd == value.oldpwd) {
            let result = await User.updateOne({ _id: token.id }, { [type]: value.newpwd })
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
        } else {
            return {
                status: 0,
                msg: "修改失败，原始密码输入错误"
            }
        }
    } else {
        let res = await User.updateOne({ _id: token.id }, { [type]: value })
        if (res.nModified) {
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

}

// 查找用户
exports.findUser = async data => {
    let res = verifyToken(data.token)
    let user = await User.findOne({ email: data.email })
    let obj = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatars: user.avatars
    }
    let tokenUser = await User.findOne({ _id: res.id })
    if (user) {
        let result = await Friend.findOne({ userID: res.id })
        if (result) {
            let isFriend = result.friend_list.map(item => {
                return item == user._id
            })
            if (isFriend) {
                obj.isFriend = true
            } else {
                obj.isFriend = false
            }
        } else {
            obj.isFriend = false
        }
        if (tokenUser.email == data.email) {
            obj.isFriend = true
        }
        return obj
    } else {
        return { msg: "未找到该用户", status: 0 }
    }
}

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