/**
 * Created by mac on 17/3/30.
 */

var express = require('express');
var router = express.Router();

var Articlelist = require('../models/Articlelist');
var Notice = require('../models/Notice');
var Catgrories = require('../models/Category');
var Share = require('../models/Share');
var Link = require('../models/Link');

/*
 * 首页
 * */
router.get('/',function (req,res) {
    //获取首页数据（文章 ）
    Articlelist.find().populate(['category','user']).sort({
        addTime:-1
    }).then(function(articlelist) {
        //查找公告
        Notice.find().then(function (notices) {
            //查找推荐的文章
            Articlelist.find({
                recommend:true
            }).populate(['category','user']).sort({
                addTime:-1
            }).then(function (reluts) {
                //最近分享
                Share.find().then(function (shares) {
                    //友情链接
                    Link.find().then(function (links) {
                        res.render('main/home', {
                            userInfo: req.userInfo,
                            articlelist:articlelist,
                            recommends:reluts,
                            notices:notices,
                            shares:shares,
                            links:links
                        });
                    });
                });
            });
        });
    });


});

/*
 * 选中文章 detail
 */
router.get('/main/detail',function (req,res) {
    //查找选中文章
    var id = req.query.id;
    Articlelist.findOne({
        _id:id
    }).populate(['category','user']).then(function(articlelist) {
        //查找分类
        Catgrories.find().then(function (catgrories) {
            //查找推荐的文章
            Articlelist.find({
                recommend:true
            }).populate(['category','user']).sort({
                addTime:-1
            }).then(function (reluts) {
                res.render('main/detail', {
                    userInfo: req.userInfo,
                    catgrories:catgrories,
                    recommends:reluts,
                    articlelist:articlelist
                });
            });
        });

    });
});
/*
 * 文章专栏 article
 */
router.get('/main/article',function (req,res) {

    Articlelist.find().populate(['category','user']).sort({
        addTime:-1
    }).then(function(articlelist) {
        //查找分类
        Catgrories.find().then(function (catgrories){
            //查找推荐的文章
            Articlelist.find({
                recommend:true
            }).populate(['category','user']).sort({
                addTime:-1
            }).then(function (reluts) {
                res.render('main/article', {
                    userInfo: req.userInfo,
                    catgrories:catgrories,
                    recommends:reluts,
                    articlelist:articlelist
                });
            });
        });
    });
});
/*
 * 资源分享专栏
 */
router.get('/main/resource',function (req,res) {
    res.render('main/resource');
});
/*
 * 点点滴滴专栏  timeline
 */
router.get('/main/timeline',function (req,res) {
    res.render('main/timeline');
});
/*
 * 留言墙  Messagewall
 */
router.get('/main/Messagewall',function (req,res) {
    res.render('main/Messagewall');
});

module.exports = router;
