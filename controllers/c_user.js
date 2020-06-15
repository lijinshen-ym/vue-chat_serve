const User = require("../model/userModel")
const Friend = require("../model/friendModel")
const { verifyToken } = require("../tool/token")
const { decrypt } = require("../tool/crypto")

// 获取用户信息
exports.getInfo = async data => {
    let { id, token } = data
    let tokenRes = verifyToken(token)
    if (id) { //获取其他用户的信息
        let res = await Friend.findOne({ userID: tokenRes.id }).populate("friend_list.user")
        let index = res.friend_list.findIndex(item => {
            return item.user._id == id
        })
        console.log(index)
        let user = {}
        if (index > 0) {
            let obj = res.friend_list[index]
            user = {
                nickName: obj.nickName,
                sex: obj.user.sex,
                address: obj.user.address,
                birthday: obj.user.birthday,
                avatars: obj.user.avatars,
                signature: obj.user.signature,
                _id: obj.user._id,
                name: obj.user.name,
                email: obj.user.email,
                isFriend: true
            }
            console.log(user)
            return user
        } else {
            let result = await User.findOne({ _id: id })
            user = {
                sex: result.sex,
                address: result.address,
                birthday: result.birthday,
                avatars: result.avatars,
                signature: result.signature,
                _id: result._id,
                name: result.name,
                email: result.email,
                isFriend: false
            }
            return user
        }

        return user
    } else { //获取登陆用户的信息
        let user = await User.findOne({ _id: tokenRes.id })
        return user
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