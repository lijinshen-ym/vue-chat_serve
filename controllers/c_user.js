const User = require("../model/userModel")
const Friend = require("../model/friendModel")
const { verifyToken } = require("../tool/token")
const { decrypt } = require("../tool/crypto")
const Application = require("../model/application")

// 获取用户信息
exports.getinfo = async data => {
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
        console.log(result)
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

// 添加好友
exports.addition = async data => {
    let { token, id, note } = data
    let res = verifyToken(token)
    let result = await Application.findOne({ userID: id })
    let answer = null;
    if (!result) {
        answer = await Application.create({
            userID: id,
            applyList: [
                { note, applyId: res.id }
            ]
        })
    } else {
        let arr = result.applyList
        let bool = arr.map(item => {
            return item.applyId == res.id
        })
        console.log(arr, bool)
        // 存在的话则先删除
        if (bool) {
            let sss = await Application.update({ userID: id }, { $pull: { applyList: { applyId: res.id } } })
            console.log(sss)
        }
        answer = await Application.update({
            userID: id,
        }, {
            '$push': {
                applyList: { note, applyId: res.id }
            }
        });
    }
    return answer
}