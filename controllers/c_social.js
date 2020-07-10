const Social = require("../model/socialModel")
const Friend = require("../model/friendModel")
const Dynamic = require("../model/dynamicModel")
const User = require("../model/userModel")

const { verifyToken } = require("../tool/token")

exports.acquire = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let social = await Social.findOne({ userID: tokenRes.id })
    if (social) {
        let dynamicList = social.dynamicList
        if (dynamicList.length == 0) {  //
            return {
                dynamicList
            }
        } else {
            let result = await Friend.findOne({ userID: tokenRes.id }).populate("friend_list.user", "avatars")
            if (result) {
                let friend_list = result.friend_list
                let newDynamicList = []
                let mapRes = await Promise.all(dynamicList.map(async item => {
                    console.log(item)
                    let obj = {}
                    let index = friend_list.findIndex(item2 => {
                        console.log("找好友")
                        return item2.user._id == item.friend
                    })

                    if (index > -1) {
                        let friend = friend_list[index]
                        obj.avatars = friend.user.avatars
                        obj.id = friend.user._id
                        obj.nickName = friend.nickName
                    } else {
                        let tokenUser = await User.findById(tokenRes.id)
                        obj.avatars = tokenUser.avatars
                        obj.id = tokenUser._id
                        obj.nickName = tokenUser.name
                    }
                    let f_dynamic = await Dynamic.findOne({ userID: item.friend })
                    let logIndex = f_dynamic.logList.findIndex(item3 => {
                        console.log("找动态")
                        return new Date(item3.date).getTime() == new Date(item.date).getTime()
                    })
                    obj.log = f_dynamic.logList[logIndex]
                    console.log(obj)
                    newDynamicList.push(obj)
                    // console.log(newDynamicList)
                    return item
                }))
                // 排序（因为以上map遍历以及内嵌了await 导致执行顺序会乱）
                function listSort(a, b) {
                    return new Date(b.log.date).getTime() - new Date(a.log.date).getTime()
                }
                return newDynamicList.sort(listSort)
            } else {
                return {
                    dynamicList
                }
            }
        }
    } else { //social不存在直接返回
        return {
            dynamicList: []
        }
    }
}