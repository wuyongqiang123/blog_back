/**
 * Created by mac on 17/4/5.
 * 分类
 *
 */
var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({

    //分类名称
    name: String,
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    }
});