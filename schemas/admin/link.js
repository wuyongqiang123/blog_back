/**
 * Created by mac on 17/4/1.
 */
var mongoose = require('mongoose');

//友情链接的表结构
module.exports = new mongoose.Schema({

    //友情链接标题
    title:String,
    //分享内容
    content: String,
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    }

});