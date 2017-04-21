/**
 * Created by mac on 17/4/10.
 */
var $;
layui.define(['layer', 'form'], function (exports) {
    $ = layui.jquery;
    var form = layui.form();
    var layer = layui.layer;

    var index = layer.load(1);
    layer.close(index);


    //添加分类数据
    $('#addnotice').click(function () {

        layer.prompt({
            formType: 2,
            value: '',//初始值
            title: '请输入公告内容'
        }, function(value, index, elem){

            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/admin/notice/add',
                data: {
                    notice:value
                },
                dataType: 'json',
                success: function(result) {
                    //提示信息
                    layer.msg(result.message);

                    if (!result.code) {
                        layer.close(index);
                        location.href = "/admin/notice";
                    }
                }
            });
        });
    });



    exports('notice', {});

});

function editnotice(id,name) {
    layer.prompt({
        formType: 2,
        value: name,
        title: '修改公告内容'
    }, function(value, index, elem){
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/admin/notice/edit',
            data: {
                name:value,
                id:id
            },
            dataType: 'json',
            success: function(result) {
                //提示信息
                layer.msg(result.message);

                if (!result.code) {
                    layer.close(index);
                    location.href = "/admin/notice";
                }
            }
        })
    });
}
function deletenotice(id) {
    layer.confirm('确定删除？'+ name, {
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.msg('删除Id为【' + id + '】的数据');
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/admin/notice/delete',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (result) {
                //提示信息
                layer.msg(result.message);

                if (result.code == 0) {
                    location.href = "/admin/notice";
                }
            }
        });
    });
}