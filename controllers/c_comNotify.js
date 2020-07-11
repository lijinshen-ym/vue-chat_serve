const ComNotify = require("../model/comNotifyModel")
const Friend = require("../model/friendModel")
const User = require("../model/userModel")
const { verifyToken } = require("../tool/token")

exports.obtain = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let user = await User.findById(tokenRes.id)
    let res = await ComNotify.findOne({ userID: tokenRes.id })
    if (res) {
        let notify_list = res.notify_list
        let friends = await Friend.findOne({ userID: tokenRes.id })
        let list = []
        notify_list.map(item => {
            if (item.type == 'like') {
                friends.friend_list.map(friend => {
                    if (friend.user == item.fromUser) {
                        item.fromName = friend.nickName
                    }
                })
                list.push(item)
            } else {
                if (item.fromUser == tokenRes.id) {
                    item.fromName = user.name
                }
                if (item.toUser == tokenRes.id) {
                    item.toName = user.name
                }
                friends.friend_list.map(friend => {
                    // console.log(friend.user,item.f)
                    if (friend.user == item.fromUser) {
                        item.fromName = friend.nickName
                    }
                    if (friend.user == item.toUser) {
                        item.toUser = friend.nickName
                    }
                })
                // console.log(item)
                list.push(item)
            }
        })
        return list
    } else {
        return []
    }
}