const Dialogue = require("../model/dialogueModel")
const Friend = require("../model/friendModel")
const { verifyToken } = require("../tool/token")
exports.dialogueList = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let res = await Dialogue.findOne({ "userID": tokenRes.id })
    let chat_list = res.chat_list
    let arr = await Promise.all(chat_list.map(async item => {
        if (item.type == 'private') { //是私聊则从好友表中获取到好友信息
            let result = await Friend.findOne({ userID: tokenRes.id }).populate("friend_list.user", "avatars")
            let index = result.friend_list.findIndex(f_item => {
                return f_item.user._id == item.id
            })
            let friend = result.friend_list[index]
            item.avatars = friend.user.avatars
            item.name = friend.nickName
        } else { //是群聊则寻找群组信息

        }
        return item
    }))
    return arr
}