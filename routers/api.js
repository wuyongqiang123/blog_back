/**
 * Created by mac on 17/4/1.
 */
var express = require('express');
var router = express.Router();
//文件上传模块
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var fs = require('fs');
//模型
var User = require('../models/User');//用户
var Category = require('../models/Category');//分类
var Articlelist = require('../models/Articlelist');//文章



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
 *上传编辑器图片
 */
router.post('/upload',multipartMiddleware,function (req,res,next) {


    //临时文件
    var tmpPath = req.files.file.path;
    //文件名字
    var name = req.files.file.name;
    //上传文件路径
    var targetPath = 'public/temp/' + req.files.file.name;
    //将上传的临时文件移动到指定的目录下
    fs.rename(tmpPath,targetPath,function (err) {
        if(err){
            console.log('移动失败');
        }
        //删除临时文件
        fs.unlink(tmpPath, function(){
            if(err) {
                console.log('删除失败');
            }

        })
    });
    // 获取上传图片的路径
    var path=process.env.PORT+targetPath;
    // 将路径返回给前端页面JSON.stringify()
    res.json({code:0,msg:'上传成功',data:{src:path,title:name}});

});
//上传封面
router.post('/cover',multipartMiddleware,function (req,res,next) {

    //临时文件
    var tmpPath = req.files.cover.path;
    //文件名字
    var name = req.files.cover.name;
    //上传文件路径
    var targetPath = 'public/cover/' + req.files.cover.name;
    //将上传的临时文件移动到指定的目录下
    fs.rename(tmpPath,targetPath,function (err) {
        if(err){
            console.log('移动失败');
        }
        //删除临时文件
        fs.unlink(tmpPath, function(){
            if(err) {
                console.log('删除失败');
            }

        })
    });
    // 获取上传图片的路径
    var path=process.env.PORT+targetPath;
    // 将路径返回给前端页面JSON.stringify()
    var string = JSON.stringify({code:0,msg:'上传成功',url:path});
    res.json(string);

});

/*
 * 上传头像 portrait
 */
router.post('/portrait',multipartMiddleware,function (req,res,next) {
    // console.log(req.files);
    //临时文件
    var tmpPath = req.files.file.path;
    //文件名字
    var name = req.files.file.name;
    //上传文件路径
    var targetPath = 'public/Head_portrait/' + req.files.file.name;
    //将上传的临时文件移动到指定的目录下
    fs.rename(tmpPath,targetPath,function (err) {
        if(err){
            console.log('移动失败');
        }
        //删除临时文件
        fs.unlink(tmpPath, function(){
            if(err) {
                console.log('删除失败');
            }
        })
    });
    // 获取上传图片的路径
    var path=process.env.PORT+targetPath;
    // 将路径返回给前端页面
    var string = JSON.stringify({code:0,msg:'上传成功',url:path});
    // console.log(string);
    res.json(string);

});
//用户注册
router.post('/user/register',multipartMiddleware,function (req,res) {
    // console.log(req.body);
   var account = req.body.account;
   var  password = req.body.password;
   var  sex = req.body.sex;
   var  avatar = req.body.avatar;
   if (avatar == '') {
       responseData.code = 1;
       responseData.message = '请上传头像';
       res.json(responseData);
       return;

   }
    //用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
    User.findOne({
        account:account
    }).then(function(userinfo) {
        if (userinfo) {
            //表示数据库中有该记录
            responseData.code = 2;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        var user = new User({
            account: account,
            password: password,
            sex:sex,
            avatar:avatar
        });
        return user.save();
    }).then(function (reults) {
        responseData.message = '注册成功';
        res.json(responseData);
    });
});
//用户登录
router.post('/user/login',multipartMiddleware,function (req,res) {
    var account = req.body.account;
    var  password = req.body.password;
    //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功

    User.findOne({
        account: account,
        password: password
    }).then(function(user) {
        if (!user) {
            responseData.code = 1;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        //用户名和密码是正确的
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: user._id,
            account: user.account,
            avatar:user.avatar
        };

        // 用户信息写入 cookies
        req.cookies.set('userInfo', JSON.stringify({
            _id: user._id,
            account: user.account,
            avatar:user.avatar
        }));
        res.json(responseData);
        return;
    })
});
// 退出
router.get('/user/logout', function(req, res) {
    // 清空 cookies 中用户信息
    req.cookies.set('userInfo', null);
    res.json(responseData);
});
//获取文章条数
router.get('/admin/articlelist_count',function (req,res) {

    Articlelist.count().then(function (count) {
        responseData.count = count;
        res.json(responseData);
    });
});

//评论提交
router.post('/comment/post',function (req,res) {

    //文章的id
    var articleid = req.body.articleid || '';

    var postData = {
        account: req.userInfo.account,
        addTime: new Date(),
        avatar:req.userInfo.avatar,
        content: req.body.article
    };

    //查询当前这篇内容的信息
    Articlelist.findOne({
        _id: articleid
    }).then(function(list) {

        list.comments.push(postData);
        return list.save();
    }).then(function(newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent.comments.reverse();
        res.json(responseData);
    });
});


module.exports = router;