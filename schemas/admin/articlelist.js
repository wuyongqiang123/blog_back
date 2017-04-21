/**
 * Created by mac on 17/4/5.
 * 文章
 */
var mongoose = require('mongoose');
//文章表结构
module.exports = new mongoose.Schema({

    //内容标题
    title: String,
    //摘要
    abstract:String,
    //关联字段 - 内容分类的id
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
    //关联字段 - 用户id
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },
    //置顶
    top:{
        type: Boolean,
        default: false
    },
    //推荐
    recommend:{
        type: Boolean,
        default: false
    },
    //内容
    content: {
        type: String,
        default: ''
    },
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    //封面
    cover:String,
    //阅读量
    views: {
        type: Number,
        default: 0
    },
    //评论
    comments: {
        type: Array,
        default: []
    }
});