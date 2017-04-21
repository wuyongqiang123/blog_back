var $;
layui.define(['layer', 'form'], function (exports) {
   $ = layui.jquery;
    var form = layui.form();
    var layer = layui.layer;

    var index = layer.load(1);
    layer.close(index);



    //每次页面重载的时候获取一下分类列表
    $.ajax({
        url: '/admin/category/list',
        success: function(responseData) {
            // var obj = JSON.stringify(responseData.data);

        }
    });


    //添加分类数据
    $('#addclassification').click(function () {

        layer.prompt({
            formType: 2,
            value: '',//初始值
            title: '请输入分类名称'
        }, function(value, index, elem){

            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/admin/category/add',
                data: {
                    category:value
                },
                dataType: 'json',
                success: function(result) {
                    //提示信息
                    layer.msg(result.message);

                    if (!result.code) {
                        layer.close(index);
                        location.href = "/admin/classification";
                    }
                }
            });
        });
    });


    //监听添加提交
    form.on('submit(formUpdateLog)', function (data) {

        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭

    });


    exports('classification', {});

});

function editcategory(id,name) {
    layer.prompt({
        formType: 2,
        value: name,
        title: '修改分类名称'
    }, function(value, index, elem){
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/admin/category/edit',
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
                    location.href = "/admin/classification";
                }
            }
        })
    });
}

function deletecategory(id,name) {
    layer.confirm('确定删除？'+ name, {
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.msg('删除Id为【' + id + '】的数据');
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/admin/category/delete',
            data: {
                id:id
            },
            dataType: 'json',
            success: function(result) {
                //提示信息
                layer.msg(result.message);

                if (result.code == 0) {
                     location.href = "/admin/classification";
                }

            }
        });

    });
}