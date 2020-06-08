const mongoose = require("mongoose")

// 群用户表
var GroupUserSchema = new mongoose.Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },	//用户id
    name: { type: String },								//群内名称
    tip: { type: Number, default: 0 },						//未读消息数
    time: { type: Date },								    //加入时间
    shield: { type: Number },								//是否屏蔽群消息（0不屏蔽，1屏蔽）
});

//群表
var GroupSchema = new mongoose.Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },	//用户id
    name: { type: String },								//群名称
    imgurl: { type: String, default: 'group.png' },		//群头像
    time: { type: Date },								    //创建时间
    notice: { type: String },								//公告
    children: [GroupUserSchema]
});


module.exports = mongoose.model("Group", GroupSchema);