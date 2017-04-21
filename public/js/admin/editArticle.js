/**
 * Created by mac on 17/3/31.
 */

layui.use(['form', 'layedit','upload','jquery'], function() {
    var form = layui.form()
        , layer = layui.layer
        , layedit = layui.layedit
        , $ = layui.jquery;


    var cover = '';

    //上传编辑器图片
    layedit.set({
        uploadImage: {
            url: '/api/upload' //接口url
            ,ext: 'jpg|png|gif' //那么，就只会支持这三种格式的上传。注意是用|分割。
            ,type: 'post' //默认post
            ,success: function(res){
                console.log('成功了');

            }
        }
    });

    //创建一个编辑器
    var editIndex = layedit.build('LAY_demo_editor', {
        height: 350 //设置编辑器高度
    });

    //自定义验证规则
    form.verify({
        title: function (value) {
            if (value.length < 5) {
                return '标题至少得5个字符啊';
            }
        }
        ,abstract:function(value) {
            if (value.length < 10) {
                return '摘要至少得10个字符啊';
            }
        }
        , content: function (value) {

            layedit.sync(editIndex);
        }

    });

    //监听置顶CheckBox
    form.on('checkbox(top)', function (data) {
        console.log(data.elem.checked); //是否被选中，true或者false
    });
    //监听推荐CheckBox
    form.on('checkbox(recommend)', function (data) {
    });

    //上传封面
    layui.upload({
        url: '/api/cover'
        ,ext: 'jpg|png|gif' //那么，就只会支持这三种格式的上传。注意是用|分割。
        ,method: 'post' //上传接口的http类型
        ,success: function(res){
            var dataObj=eval("("+res+")");//转换为json对象
            cover = dataObj.url;
            articleCoverImg.src = dataObj.url;
        }
    });


    //监听提交
    form.on('submit(demo1)', function (data) {
        // alert(JSON.stringify(data.field))

        //判断图片是否有值，还是本要图片
        var src=document.getElementById("articleCoverImg").src;
        var srcname = src.substring(src.lastIndexOf("/")+1);
        if (srcname != 'cover_default.jpg'){//如果不是本地图片
            cover = src;
        }
        var id = data.field.id;
        var title = data.field.title;
        var abstract = data.field.abstract;
        var interest = data.field.interest;
        var content = data.field.content;
        var recommend = data.field.recommend || 'off';
        var top = data.field.top || 'off';

        //提交请求
        $.ajax({
            type: 'post',
            url: '/admin/editArticle',
            data: {
                id:id,
                title: title,
                abstract: abstract,
                interest:interest,
                content:content,
                recommend:recommend,
                top:top,
                covers:cover
            },
            dataType: 'json',
            success:function(result) {
                layer.msg(result.message,{
                    time:2000
                });
                if (!result.code) {
                    location.href = "/admin/articlelist";
                }
            }
        })

        return false;
    });
})