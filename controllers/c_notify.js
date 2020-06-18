const Notify = require("../model/notifyModel")
const { verifyToken } = require("../tool/token")

exports.getNotice = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let res = await Notify.findOne({ userID: tokenRes.id })
    if (res && res.notify_list.length > 0) {
        let result = await Notify.findOne({ userID: tokenRes.id }).populate("notify_list.user")
        console.log(result)
        return result
    } else {
        return {}
    }
}