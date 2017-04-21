
layui.use(['element', 'layer', 'util', 'form','jquery','upload'], function () {
    var $ = layui.jquery;
    var form = layui.form();
    var layer = layui.layer;
    var upload = layui.upload;

    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');

    //变量 密码 头像
    var password = '111111';//默认为111111
    var avatar = '';
    var sex = '男';//性别保存变量 默认为男


    //上传头像
    layui.upload({
        url: '/api/portrait'
        ,ext: 'jpg|png|gif' //那么，就只会支持这三种格式的上传。注意是用|分割。
        ,method: 'post' //上传接口的http类型
        ,success: function(res){
            var dataObj=eval("("+res+")");//转换为json对象
            avatar = dataObj.url;//上传成功赋值给avatar
            LAY_demo_upload.src = dataObj.url;
            // document.getElementById('LAY_demo_upload').src = res.url;
        }
    });

    //模拟QQ登陆
    // $('.blog-user').click(function () {
    //     var user = this;
    //     var index = layer.load(1);
    //     setTimeout(function () {
    //         layer.close(index);
    //         $(user).toggleClass('layui-hide').siblings('a.blog-user').toggleClass('layui-hide');
    //     }, 800);
    // });



    //性别  女
    form.on('radio(radio_l)', function(data) {
        console.log(data.value); //被点击的radio的value值
        sex = '女';
    });
    //性别  男
    form.on('radio(radio_n)', function(data) {
        console.log(data.value); //被点击的radio的value值
        sex = '男';
    });

    //注册按钮提交
    form.on('submit(register)', function (data) {
        // alert(data.field.account+sex);
        //自定义验证规则
        form.verify({
            account: function(value){
                if(value == ''){
                    return '用户名不能为空';
                }
            }
            ,password: function(value) {
                if (value == '') {
                    return '密码不能为空';

                }
                else if (value.length <6){
                    return [/(.+){6,12}$/, '密码必须6到12位'];
                }
                password = value;
            }
            ,repassword:function(value) {
                if (value == '') {
                    return '确认密码不能为空';
                }
                else{
                   if (value != password) {//两次输入的密码必须一致
                       return '两次输入的密码不一致';
                   }
                }
            }
        });
        //提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                account: data.field.account,
                password: data.field.password,
                repassword:data.field.repassword,
                sex:data.field.sex,
                avatar:avatar
            },
            dataType: 'json',
            success:function(result) {
                layer.msg(result.message);
                if (!result.code) {
                    //注册成功
                    setTimeout(function() {
                        $loginBox.show();
                        $registerBox.hide();
                    }, 1000);

                }
            }
        })

        return false;
    });
    //登录按钮提交
    form.on('submit(formUpdateLog)',function (data) {
        //自定义验证规则
        form.verify({
            account: function(value){
                if(value == ''){
                    return '用户名不能为空';
                }
            }
            ,password: function(value) {
                if (value == '') {
                    return '密码不能为空';
                }
            }
        });

        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                account:data.field.account,
                password: data.field.password
            },
            dataType: 'json',
            success: function(result) {
                //提示信息
                layer.msg(result.message);

                if (!result.code) {
                    //登录成功
                    window.location.reload();
                }
            }
        })

        return false;
    });

    //退出
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/user/logout',
            success: function(result) {
                if (!result.code) {
                    window.location.reload();
                }
            }
        });
    })

    //分享工具
    layui.util.fixbar({
        bar1: '&#xe641;',
        click: function (type) {
            if (type === 'bar1') {
                var sear = new RegExp('layui-hide');
                if (sear.test($('.blog-share').attr('class'))) {
                    shareIn();
                } else {
                    shareOut();
                }
            }
        }
    });

    //子栏目导航点击事件
    $('.child-nav span').click(function () {
        layer.msg('切换到相应栏目');
        $(this).addClass('child-nav-btn-this').siblings().removeClass('child-nav-btn-this');
    });

    //侧边导航开关点击事件
    $('.blog-navicon').click(function () {
        var sear = new RegExp('layui-hide');
        if (sear.test($('.blog-nav-left').attr('class'))) {
            leftIn();
        } else {
            leftOut();
        }
    });
    //侧边导航遮罩点击事件
    $('.blog-mask').click(function () {
        leftOut();
    });
    //blog-body和blog-footer点击事件，用来关闭百度分享和类别导航
    $('.blog-body,.blog-footer').click(function () {
        shareOut();
        categoryOut();
    });
    //类别导航开关点击事件
    $('.category-toggle').click(function (e) {
        e.stopPropagation();    //阻止事件冒泡
        categroyIn();
    });
    //类别导航点击事件，用来关闭类别导航
    $('.article-category').click(function () {
        categoryOut();
    });
    //具体类别点击事件
    $('.article-category > a').click(function (e) {
        e.stopPropagation(); //阻止事件冒泡
    });

    //显示百度分享
    function shareIn() {
        $('.blog-share').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        $('.blog-share').removeClass('shareOut');
        $('.blog-share').addClass('shareIn');
        $('.blog-share').removeClass('layui-hide');
        $('.blog-share').addClass('layui-show');
    }
    //隐藏百度分享
    function shareOut() {
        $('.blog-share').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.blog-share').addClass('layui-hide');
        });
        $('.blog-share').removeClass('shareIn');
        $('.blog-share').addClass('shareOut');
        $('.blog-share').removeClass('layui-show');
    }
    //显示侧边导航
    function leftIn() {
        $('.blog-mask').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        $('.blog-nav-left').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');

        $('.blog-mask').removeClass('maskOut');
        $('.blog-mask').addClass('maskIn');
        $('.blog-mask').removeClass('layui-hide');
        $('.blog-mask').addClass('layui-show');

        $('.blog-nav-left').removeClass('leftOut');
        $('.blog-nav-left').addClass('leftIn');
        $('.blog-nav-left').removeClass('layui-hide');
        $('.blog-nav-left').addClass('layui-show');
    }
    //隐藏侧边导航
    function leftOut() {
        $('.blog-mask').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.blog-mask').addClass('layui-hide');
        });
        $('.blog-nav-left').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.blog-nav-left').addClass('layui-hide');
        });

        $('.blog-mask').removeClass('maskIn');
        $('.blog-mask').addClass('maskOut');
        $('.blog-mask').removeClass('layui-show');

        $('.blog-nav-left').removeClass('leftIn');
        $('.blog-nav-left').addClass('leftOut');
        $('.blog-nav-left').removeClass('layui-show');
    }
    //显示类别导航
    function categroyIn() {
        $('.category-toggle').addClass('layui-hide');
        $('.article-category').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');

        $('.article-category').removeClass('categoryOut');
        $('.article-category').addClass('categoryIn');
        $('.article-category').addClass('layui-show');
    }
    //隐藏类别导航
    function categoryOut() {
        $('.article-category').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.article-category').removeClass('layui-show');
            $('.category-toggle').removeClass('layui-hide');
        });

        $('.article-category').removeClass('categoryIn');
        $('.article-category').addClass('categoryOut');
    }

});


//百度分享插件
window._bd_share_config = {
    "common": {
        "bdSnsKey": {},
        "bdText": "",
        "bdStyle": "0",
        "bdSize": "32"
    },
    "share": {}
};
with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];

