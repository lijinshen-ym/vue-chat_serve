const Group = require("../model/groupModel")
const User = require("../model/userModel")
const GroupNumber = require("../model/numberModel")
const { verifyToken } = require("../tool/token")

// 创建群组
exports.create = async data => {
    let { token, name, imgUrl, group_list } = data
    group_list = group_list.split(",")
    let tokenRes = verifyToken(token)
    let g_n = await GroupNumber.findOne({ name: "number" })
    if (!g_n) {
        g_n = await GroupNumber.create({
            name: "number"
        })
    }
    let list = []
    let list_result = await Promise.all(group_list.map(async item => {
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
        group_list: list
    })
    if (new_group) {
        group_number++
        let result = await GroupNumber.updateOne({ name: "number" }, { $set: { group_number } })
    }
    return new_group
}
