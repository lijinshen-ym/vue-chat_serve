const Dynamic = require("../model/dynamicModel")
const Friend = require("../model/friendModel")
const Social = require("../model/socialModel")

const { verifyToken } = require("../tool/token")

exports.published = async data => {
    let { token, text, imgList, comments, like, date, address } = data
    let tokenRes = verifyToken(token)
    let tokenDynamic = await Dynamic.findOne({ userID: tokenRes.id })
    if (tokenDynamic) {
        let logList = tokenDynamic.logList
        logList.unshift({
            text, imgList, comments, like, date, address
        })
        res = await Dynamic.updateOne({ userID: tokenRes.id }, { $set: { logList } })
    } else {
        res = await Dynamic.create({
            userID: tokenRes.id,
            logList: [{
                text, imgList, comments, like, date, address
            }]
        })
    }
    if (res.userID || res.nModified == 1) {
        let friends = await Friend.findOne({ userID: tokenRes.id })
        let friend_list = friends.friend_list
        friend_list.push({
            user: tokenRes.id,
            nickName: ""
        })
        let result = await Promise.all(friend_list.map(async item => {
            let d_list = await Social.findOne({ userID: item.user })
            if (d_list) {
                let dynamicList = d_list.dynamicList
                dynamicList.unshift({
                    friend: tokenRes.id, date,
                })
                let d_res = await Social.updateOne({ userID: item.user }, { $set: { dynamicList } })
            } else {
                let d_res = await Social.create({
                    userID: item.user,
                    dynamicList: [
                        { friend: tokenRes.id, date }
                    ]
                })
            }
        }))
        return { status: 1, msg: "发布成功" }
    } else {
        return { status: 0, msg: "发布失败" }
    }

}