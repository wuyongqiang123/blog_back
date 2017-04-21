/**
 * Created by mac on 17/4/1.
 */
var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({

    //用户名
    account: String,
    //密码
    password: String,
    //性别
    sex:String,
    //头像
    avatar:String,
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    //是否是管理员
    isAdmin: {
        type: Boolean,
        default: false
    }

});