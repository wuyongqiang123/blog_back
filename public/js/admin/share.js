/**
 * Created by mac on 17/4/11.
 */
var $;

layui.define(['layer', 'form'], function (exports) {
    $ = layui.jquery;
    var form = layui.form();
    var layer = layui.layer;

    var index = layer.load(1);
    layer.close(index);


    //添加分享数据
    $('#addshare').click(function () {

        layer.prompt({title: '请输入分享标题'}, function(reluts, index){
            layer.close(index);
            layer.prompt({title: '请输入分享内容,(应该为http地址)', formType: 2}, function(text, index){
                layer.close(index);
                //通过ajax提交请求
                $.ajax({
                    type: 'post',
                    url: '/admin/share/add',
                    data: {
                        title:reluts,
                        content:text
                    },
                    dataType: 'json',
                    success: function(result) {
                        //提示信息
                        layer.msg(result.message);

                        if (!result.code) {
                            layer.close(index);
                            location.href = "/admin/share";
                        }
                    }
                });
            });
        });

    });


    exports('share', {});

});
function editcategory(id,title,content) {
    var layer = layui.layer;
    layer.prompt({value:title,title: '请输入分享标题'}, function(reluts, index){
        layer.prompt({title: '请输入分享内容,(应该为http地址)', formType: 2,value: content}, function(text, index){

            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/admin/share/edit',
                data: {
                    title:reluts,
                    content:text,
                    id:id
                },
                dataType: 'json',
                success: function(result) {
                    //提示信息
                    layer.msg(result.message);

                    if (!result.code) {
                        layer.close(index);
                        location.href = "/admin/share";
                    }
                }
            });
        });
    });

}

function deletecategory(id) {
    var layer = layui.layer;
    layer.confirm('确定删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.msg('删除Id为【' + id + '】的数据');
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/admin/share/delete',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (result) {
                //提示信息
                layer.msg(result.message);
                if (!result.code) {
                    location.href = "/admin/share";
                }

            }
        });

    });
}