const Group = require("../model/groupModel")
const User = require("../model/userModel")
const GroupNumber = require("../model/numberModel")
const GroupList = require("../model/groupListModel")
const { verifyToken } = require("../tool/token")

// 创建群组
exports.create = async data => {
    let { token, name, imgUrl, user_list } = data
    let tokenRes = verifyToken(token)
    user_list = user_list.split(",")
    user_list.unshift(tokenRes.id)
    let g_n = await GroupNumber.findOne({ name: "number" })
    if (!g_n) {
        g_n = await GroupNumber.create({
            name: "number"
        })
    }
    let list = []
    let list_result = await Promise.all(user_list.map(async item => {
        let user = await User.findOne({ _id: item })
        let obj = { user: item, nickName: user.name }
        list.push(obj)
        return item
    }))
    let group_number = g_n.group_number
    let new_group = await Group.create({
        manager: tokenRes.id,
        number: group_number,
        name,
        imgUrl,
        user_list: list
    })
    if (new_group) {
        group_number++
        let result = await GroupNumber.updateOne({ name: "number" }, { $set: { group_number } })
        let gl = null
        let group_list = null
        let gl_res = null

        // 群组创建成功后将该群添加到群成员的群列表中
        let promise_res = await Promise.all(user_list.map(async item => {
            gl = await GroupList.findOne({ userID: item })
            if (gl) {
                group_list = gl.group_list
                group_list.push({
                    group: new_group._id
                })
                gl_res = await GroupList.updateOne({ userID: item }, { $set: { group_list } })
            } else {
                gl_res = await GroupList.create({
                    userID: item,
                    group_list: [
                        { group: new_group._id }
                    ]
                })
            }
        }))

    }
    return new_group
}

// 获取群详情
exports.groupInfo = async data => {
    let { id, token } = data
    let tokenRes = verifyToken(token)
    let group = await Group.findById(id).populate("user_list.user", "avatars")
    let user_list = group.user_list
    let index = user_list.findIndex(item => {
        return tokenRes.id == item.user._id
    })
    let nickName = user_list[index].nickName
    return {
        group,
        nickName
    }
}

// 修改群头像
exports.modify = async data => {
    let { id, imgUrl } = data
    let res = await Group.updateOne({ _id: id }, { $set: { imgUrl } })
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

// 获取群列表
exports.getList = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let list = await GroupList.findOne({ userID: tokenRes.id }).populate("group_list.group", ["name", "imgUrl"])
    if (list) {
        return list
    } else {
        return {
            group_list: []
        }
    }

}