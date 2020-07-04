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


// 修改群信息
exports.modifyInfo = async data => {
    let { id, name, nickName, token, notice } = data
    let key = null
    let value = null
    if (name || notice) {
        if (name) {
            key = "name"
            value = name
        } else {
            key = "notice"
            value = notice
        }
        let res = await Group.updateOne({ _id: id }, { $set: { [key]: value } })
        return res
    } else if (nickName) {
        let tokenRes = verifyToken(token)
        let group = await Group.findById(id)
        let user_list = group.user_list
        let index = user_list.findIndex(item => {
            return item.user == tokenRes.id
        })
        user_list[index].nickName = nickName
        let res = await Group.updateOne({ _id: id }, { $set: { user_list } })
        return res
    }

}

// 添加群成员
exports.addMember = async data => {
    let { id, list } = data
    let oldList = []
    let list_result = await Promise.all(list.map(async item => {
        let user = await User.findOne({ _id: item })
        let obj = { user: item, nickName: user.name }
        oldList.push(obj)
        return item
    }))
    // 群组创建成功后将该群添加到群成员的群列表中
    let promise_res = await Promise.all(list.map(async item => {
        gl = await GroupList.findOne({ userID: item })
        if (gl) {
            group_list = gl.group_list
            group_list.push({
                group: id
            })
            gl_res = await GroupList.updateOne({ userID: item }, { $set: { group_list } })
        } else {
            gl_res = await GroupList.create({
                userID: item,
                group_list: [
                    { group: id }
                ]
            })
        }
    }))
    let group = await Group.findById(id)
    let user_list = group.user_list
    let newList = [...user_list, ...oldList]
    let res = await Group.updateOne({ _id: id }, { $set: { user_list: newList } })
    return res
}

// 退出群聊
exports.exit = async data => {
    let { id, token } = data
    let tokenRes = verifyToken(token)
    let group = await Group.findById(id)
    let user_list = group.user_list
    let index = user_list.findIndex(item => {
        return item.user == tokenRes.id
    })
    user_list.splice(index, 1)
    let res = await Group.updateOne({ _id: id }, { $set: { user_list } })

    // 将该群添加到邀请的好友群列表中
    let group_list = await GroupList.findOne({ userID: tokenRes.id })
    let list = group_list.group_list
    let g_index = list.findIndex(item => {
        return item.group == id
    })
    list.splice(g_index, 1)
    let result = await GroupList.updateOne({ userID: tokenRes.id }, { $set: { group_list: list } })
    console.log(res, result)
    return res
}

//转让群主
exports.transfer = async data => {
    let { id, manager } = data
    console.log(manager)
    let res = await Group.updateOne({ _id: id }, { $set: { manager } })
    let group = await Group.findById(id)

    //以下操作是将群主放在user_list的首位 
    let user_list = group.user_list
    let index = user_list.findIndex(item => {
        return item.user == manager
    })
    let old_manager = user_list.splice(index, 1)
    console.log(old_manager)
    let new_manager = {
        user: old_manager[0].user,
        nickName: old_manager[0].nickName
    }
    console.log(new_manager)
    user_list.unshift(new_manager)
    let result = await Group.updateOne({ _id: id }, { $set: { user_list } })

    return res
}

// 管理群成员
exports.management = async data => {

}

// 解散群聊
exports.dissolve = async data => {

}