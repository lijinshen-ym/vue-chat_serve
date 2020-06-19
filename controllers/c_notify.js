const Notify = require("../model/notifyModel")
const { verifyToken } = require("../tool/token")

exports.getNotice = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let res = await Notify.findOne({ userID: tokenRes.id })
    if (res && res.notify_list.length > 0) {
        let result = await Notify.findOne({ userID: tokenRes.id }).populate("notify_list.user")
        return result
    } else {
        return {}
    }
}

exports.readNotice = async data => {
    let { token, id } = data
    let tokenRes = verifyToken(token)
    let res = await Notify.findOne({ userID: tokenRes.id })
    let notify_list = res.notify_list
    notify_list = notify_list.map(item => {
        if (item._id == id) {
            item.unRead = true
        }
        return item
    })
    let modifyResult = await Notify.update({ userID: tokenRes.id }, { $set: { notify_list: notify_list } })
    if (modifyResult.nModified) {
        return { status: 1, msg: "操作成功" }
    } else {
        return { status: 1, msg: "操作失败" }
    }
}
exports.deleteNotice = async data => {
    let { token, id } = data
    let tokenRes = verifyToken(token)
    let res = await Notify.findOne({ userID: tokenRes.id })
    let notify_list = res.notify_list
    let index = notify_list.findIndex(item => {
        return item._id == id
    })
    notify_list.splice(index, 1)
    let modifyResult = await Notify.update({ userID: tokenRes.id }, { $set: { notify_list: notify_list } })
    if (modifyResult.nModified) {
        return { status: 1, msg: "操作成功" }
    } else {
        return { status: 0, msg: "操作失败" }
    }
}