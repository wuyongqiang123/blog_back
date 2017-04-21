/**
 * Created by mac on 17/3/31.
 */
var express = require('express');
var router = express.Router();
//文件上传模块
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var fs = require('fs');

var Category = require('../models/Category');
var Articlelist = require('../models/Articlelist');
var User = require('../models/User');
var Notice = require('../models/Notice');
var Share = require('../models/Share');
var Link = require('../models/Link');

router.use(function(req, res, next) {
    if (!req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});

//统一返回格式
var responseData;

router.use( function(req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
} );


/*
 * 登录页
 * */
// router.get('/',multipartMiddleware,function (req,res,next) {
//     res.render('admin/index');
// });
/*
 * 首页
 * */
router.get('/main',function (req,res) {
    res.render('admin/main',{
        userInfo: req.userInfo
    });
});
/*
 * 文章管理首页面 Article
 * */
router.get('/articlelist',function (req,res) {

    /*
     *limit(Number) : 限制获取的数据条数
     * skip(2) : 忽略数据的条数
     */

    var page = Number(req.query.page || 1);
    var limit = 8;
    var pages = 0;

    Articlelist.count().then(function (count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Articlelist.find().limit(limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        }).then(function(articlelist) {
            console.log(articlelist)
            res.render('admin/datalist', {
                userInfo: req.userInfo,
                articlelist:articlelist,
                page:page
            });
        });
    });
});

/*
 * 文章添加页面 Article add
 * */
router.get('/addArticle',function (req,res) {
    Category.find().sort({_id: -1}).then(function(categories) {
        res.render('admin/addArticle', {
            userInfo: req.userInfo,
            categories: categories
        })
    });
});

/*
 * 文章添加保存 admin
 * */
router.post('/Article/add',multipartMiddleware,function (req,res) {

    var title = req.body.title;
    var abstract = req.body.abstract;
    var interest = req.body.interest;
    var content = req.body.content;
    var recommend = req.body.recommend;
    var top = req.body.top;
    var cover = req.body.covers;
    if (cover == ''){
        responseData.code = 1;
        responseData.message = '请上传封面';
        res.json(responseData);
        return;
    }
    if (content == '') {
        responseData.code = 2;
        responseData.message = '请输入内容';
        res.json(responseData);
        return;
    }
    var tops,recommends;
    if (top == 'on'){
        tops = true;
    }
    if (recommend == 'on'){
        recommends = true;
    }

    //保存数据到数据库
    var article = new  Articlelist({
        title:title,
        abstract:abstract,
        category:interest,
        user: req.userInfo._id.toString(),
        top:tops,
        recommend:recommends,
        content:content,
        cover:cover
    });
    article.save().then(function(rs) {

       responseData.message = '保存成功';
       res.json(responseData);
   });
});

/*
 * 文章修改
 * */
router.get('/editArticle',function (req,res) {

    var id = req.query.id || '';
    var categories = [];
    Category.find().sort({_id: -1}).then(function(rs){
        categories = rs;
      return Articlelist.findOne({
            _id:id
        }).populate('category');
    }).then(function (article) {
        if (!article){
            responseData.code = 1;
            responseData.message = '指定内容不存在';
            res.json(responseData);
        }else {
            res.render('admin/editArticle', {
                userInfo: req.userInfo,
                categories: categories,
                articles: article
            });
        }
    });
});
/*
 * 文章修改保存
 * */
router.post('/editArticle',function (req,res) {

    var id = req.body.id;
    var title = req.body.title;
    var abstract = req.body.abstract;
    var interest = req.body.interest;
    var content = req.body.content;
    var recommend = req.body.recommend;
    var top = req.body.top;
    var cover = req.body.covers;
    if (cover == ''){
        responseData.code = 1;
        responseData.message = '请上传封面';
        res.json(responseData);
        return;
    }
    if (content == '') {
        responseData.code = 2;
        responseData.message = '请输入内容';
        res.json(responseData);
        return;
    }
    var tops,recommends;
    if (top == 'on'){
        tops = true;
    }
    if (recommend == 'on'){
        recommends = true;
    }
    //保存数据库
    Articlelist.update({
        _id:id
    },{
        title:title,
        abstract:abstract,
        category:interest,
        user: req.userInfo._id.toString(),
        top:tops,
        recommend:recommends,
        content:content,
        cover:cover
    }).then(function () {
        responseData.message = '内容保存成功';
        res.json(responseData);
    });
});

//文章删除
router.post('/Article/delete',function (req,res) {
    //获取要删除的分类的id
    var id = req.body.id || '';
    Articlelist.remove({
        _id: id
    }).then(function() {

        responseData.message = '删除成功';
        res.json(responseData);
    });
});
/*
 *分类管理页面 classification
 */
router.get('/classification',function (req,res) {
    /*
     * 1: 升序
     * -1: 降序
     * */
    Category.find().sort({_id: -1}).limit(10).skip(0).then(function(categories) {
        res.render('admin/classification', {
            userInfo: req.userInfo,
            categories: categories,
        });
    });
});
//admin分类修改
router.post('/category/edit',function (req,res) {
    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.body.id || '';
    var name = req.body.name;
    if (name == '') {
        responseData.code = 1;
        responseData.message = '分类名字不能为空';
        res.json(responseData);
        return;
    }
    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        console.log('category'+category)
        if (!category) {
            responseData.code = 2;
            responseData.message = '分类信息不存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (name == category.name) {
                responseData.message = '修改成功';
                res.json(responseData);

                return Promise.reject();
            } else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            responseData.code = 3;
            responseData.message = '数据库中已经存在同名分类';
            res.json(responseData);

            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function() {
        responseData.message = '修改成功';
        res.json(responseData);
    });

});
//分类删除
router.post('/category/delete',function (req,res) {
    //获取要删除的分类的id
    var id = req.body.id || '';
    Category.remove({
        _id: id
    }).then(function() {

        responseData.message = '删除成功';
        res.json(responseData);
    });
});
//admin添加分类
router.post('/category/add',function (req,res) {
    var name = req.body.category;
    if (name == '') {
        responseData.code = 1;
        responseData.message = '分类名字不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中相同的
    Category.findOne({
        name:name

    }).then(function (reluts) {
        if (reluts) {
            //表示数据库中有该记录
            responseData.code = 2;
            responseData.message = '分类已经存在';
            res.json(responseData);
            return;
        }
        //保存信息到数据库中
        var category = new Category({
            name:name
        });
        return category.save();
    }).then(function (reults) {
        responseData.message = '添加成功';
        res.json(responseData);
    });

});
//admin获取分类列表
router.get('/category/list',function (req,res) {

    //查询全部分类
    Category.find().then(function (reluts) {
        responseData.category = reluts;
        res.json(responseData);
    });
});
//全部用户
router.get('/users',function (req,res) {
    //查询全部用户
    User.find().then(function (users) {
        res.render('admin/users', {
            userInfo: req.userInfo,
            users: users
        })
    });
});
//网站公告
router.get('/notice',function (req,res) {
    Notice.find().then(function (reluts) {
        res.render('admin/notice',{
            userInfo: req.userInfo,
            notices: reluts
        });
    });
});
//添加公告
router.post('/notice/add',multipartMiddleware,function (req,res) {
    var name = req.body.notice;

    //查询数据库中相同的
    Notice.findOne({
        name:name

    }).then(function (reluts) {
        if (reluts) {
            //表示数据库中有该记录
            responseData.code = 2;
            responseData.message = '公告已经存在';
            res.json(responseData);
            return;
        }
        //保存信息到数据库中
        var notice = new Notice({
            name:name
        });
        return notice.save();
    }).then(function (reults) {
        responseData.message = '添加成功';
        res.json(responseData);
    })
});
//修改公告
router.post('/notice/edit',multipartMiddleware,function (req,res) {
    //获取要修改的公告的信息，并且用表单的形式展现出来
    var id = req.body.id || '';
    var name = req.body.name;
    if (name == '') {
        responseData.code = 1;
        responseData.message = '分类名字不能为空';
        res.json(responseData);
        return;
    }
    //获取要修改的公告信息
    Notice.findOne({
        _id: id
    }).then(function(notice) {
        if (!notice) {
            responseData.code = 2;
            responseData.message = '公告信息不存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (name == notice.name) {
                responseData.message = '修改成功';
                res.json(responseData);

                return Promise.reject();
            } else {
                //要修改的公告名称是否已经在数据库中存在
                return Notice.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(samenotice) {
        if (samenotice) {
            responseData.code = 3;
            responseData.message = '数据库中已经存在同名公告';
            res.json(responseData);
            return Promise.reject();
        } else {
            return Notice.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function() {
        responseData.message = '修改成功';
        res.json(responseData);
    });
});
//删除公告
router.post('/notice/delete',multipartMiddleware,function (req,res) {
    //获取要删除的公告的id
    var id = req.body.id || '';
    Notice.remove({
        _id: id
    }).then(function() {

        responseData.message = '删除成功';
        res.json(responseData);
    });
});
//最近分享
router.get('/share',function (req,res){
    Share.find().then(function (shares) {
        res.render('admin/share',{
            userInfo: req.userInfo,
            shares:shares
        });
    });
});
//添加最近分享
router.post('/share/add',multipartMiddleware,function (req,res) {
    var title = req.body.title;
    var content = req.body.content;
    //查询数据库中相同的
    Share.findOne({
        title:title
    }).then(function (reluts) {
        if (reluts) {
            //表示数据库中有该记录
            responseData.code = 2;
            responseData.message = '公告已经存在';
            res.json(responseData);
            return;
        }
        //保存信息到数据库中
        var share = new Share({
            title:title,
            content:content
        });
        return share.save();
    }).then(function(reluts) {
        responseData.message = '添加成功';
        res.json(responseData);
    });
});
//修改最近分享
router.post('/share/edit',multipartMiddleware,function (req,res){
    var title = req.body.title;
    var content = req.body.content;
    var id = req.body.id;

    //获取要修改的最近分享信息
    Share.findOne({
        _id: id
    }).then(function(share) {
        if (!share) {
            responseData.code = 2;
            responseData.message = '分享信息不存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (title == share.title || content == share.content) {
                responseData.message = '修改成功';
                res.json(responseData);

                return Promise.reject();
            } else {
                //要修改的分享标题是否已经在数据库中存在
                return Notice.findOne({
                    _id: {$ne: id},
                    title: title
                });
            }
        }
    }).then(function(sameshare) {
        if (sameshare) {
            responseData.code = 3;
            responseData.message = '数据库中已经存在同名公告';
            res.json(responseData);
            return Promise.reject();
        } else {
            return Share.update({
                _id: id
            }, {
                title: title,
                content:content
            });
        }
    }).then(function() {
        responseData.message = '修改成功';
        res.json(responseData);
    })
});
//删除最近分享
router.post('/share/delete',multipartMiddleware,function (req,res){
    //获取要删除的公告的id
    var id = req.body.id || '';
    Share.remove({
        _id: id
    }).then(function() {

        responseData.message = '删除成功';
        res.json(responseData);
    });
});
//友情链接
router.get('/link',function (req,res) {
    Link.find().then(function (links) {
        res.render('admin/link',{
            userInfo: req.userInfo,
            links:links
        });
    });
});
//添加友情链接
router.post('/link/add',multipartMiddleware,function (req,res) {
    var title = req.body.title;
    var content = req.body.content;
    //查询数据库中相同的
    Link.findOne({
        title:title
    }).then(function (reluts) {
        if (reluts) {
            //表示数据库中有该记录
            responseData.code = 2;
            responseData.message = '友情链接已经存在';
            res.json(responseData);
            return;
        }
        //保存信息到数据库中
        var link = new Link({
            title:title,
            content:content
        });
        return link.save();
    }).then(function(reluts) {
        responseData.message = '添加成功';
        res.json(responseData);
    });
});
//修改友情链接
router.post('/link/edit',multipartMiddleware,function (req,res){
    var title = req.body.title;
    var content = req.body.content;
    var id = req.body.id;

    //获取要修改的友情链接信息
    Link.findOne({
        _id: id
    }).then(function(link) {
        if (!link) {
            responseData.code = 2;
            responseData.message = '友情链接信息不存在';
            res.json(responseData);
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (title == link.title || content == link.content) {
                responseData.message = '修改成功';
                res.json(responseData);

                return Promise.reject();
            } else {
                //要修改的友情链接标题是否已经在数据库中存在
                return Link.findOne({
                    _id: {$ne: id},
                    title: title,
                    content:content
                });
            }
        }
    }).then(function(samelink) {
        if (samelink) {
            responseData.code = 3;
            responseData.message = '数据库中已经存在同名公告';
            res.json(responseData);
            return Promise.reject();
        } else {
            return Link.update({
                _id: id
            }, {
                title: title,
                content:content
            });
        }
    }).then(function() {
        responseData.message = '修改成功';
        res.json(responseData);
    })
});
//删除友情链接
router.post('/link/delete',multipartMiddleware,function (req,res){
    //获取要删除的友情链接的id
    var id = req.body.id || '';
    Link.remove({
        _id: id
    }).then(function() {

        responseData.message = '删除成功';
        res.json(responseData);
    });
});


module.exports = router;
