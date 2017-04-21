/**
 * Created by mac on 17/4/10.
 */
var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({

    //公告名称
    name: String,
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    }
});