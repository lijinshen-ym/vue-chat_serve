const Dynamic = require("../model/dynamicModel")
const Friend = require("../model/friendModel")
const FDList = require("../model/friendsDynamicModel")

const { verifyToken } = require("../tool/token")

exports.published = async data => {
    let { token, text, imgList, comments, like, date, address } = data
    let tokenRes = verifyToken(token)
    let tokenDynamic = await Dynamic.findOne({ userID: tokenRes.id })
    let res = null
    let index = 0
    if (tokenDynamic) {
        let dynamicList = tokenDynamic.dynamicList
        dynamicList.push({
            text, imgList, comments, like, date, address
        })
        index = dynamicList.length - 1
        res = await Dynamic.updateOne({ userID: tokenRes.id }, { $set: { dynamicList } })
    } else {
        res = await Dynamic.create({
            userID: tokenRes.id,
            dynamicList: [{
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
            let d_list = await FDList.findOne({ userID: item.user })
            if (d_list) {
                let dynamicList = d_list.dynamicList
                dynamicList.push({
                    friend: tokenRes.id, index,
                })
                let d_res = await FDList.updateOne({ userID: item.user }, { $set: { dynamicList } })
            } else {
                let d_res = await FDList.create({
                    userID: item.user,
                    dynamicList: [
                        { friend: tokenRes.id, index }
                    ]
                })
            }
        }))
        return { status: 1, msg: "发布成功" }
    } else {
        return { status: 0, msg: "发布失败" }
    }

}