/**
 * Created by mac on 17/4/7.
 */



layui.define(['layer', 'form','laypage'], function (exports) {
    var $ = layui.jquery;
    var form = layui.form();
    var layer = layui.layer;
    var laypage = layui.laypage;

    var index = layer.load(1);
    layer.close(index);

   var page = window.document.getElementById('page');
   var Indexcurr = page.value;
   //进来先获取文章条数
    $.ajax({
        url: '/api/admin/articlelist_count',
        dataType: 'json',
        success:function(result) {
            var obj = JSON.stringify(result.count);
            ////计算总页数
            var pages = Math.ceil(obj / 8);
            laypage({
                cont: 'pageNav',
                pages: pages,
                groups: 3,
                skip: true,
                curr: Indexcurr,
                jump: function (obj, first) {
                    var currentIndex = obj.curr;
                    if (!first) {
                        location.href = "/admin/articlelist?page="+currentIndex;
                    }

                }
            });
        }
    });





    //添加数据
    $('#addArticle').click(function () {
        var index = layer.load(1);
        setTimeout(function () {
            layer.close(index);
            // layer.msg('打开添加窗口');
            location.href = "/admin/addArticle";
        }, 500);
    });

    //监听置顶CheckBox
    form.on('checkbox(top)', function (data) {
        var index = layer.load(1);
        setTimeout(function () {
            layer.close(index);
            if (data.elem.checked) {
                data.elem.checked = false;
            }
            else {
                data.elem.checked = true;
            }
            layer.msg('操作失败，返回原来状态');
            form.render();  //重新渲染
        }, 300);
    });

    //监听推荐CheckBox
    form.on('checkbox(recommend)', function (data) {
        var index = layer.load(1);
        setTimeout(function () {
            layer.close(index);
            layer.msg('操作成功');
        }, 300);
    });

});

function editarticle(id) {

    var index = layer.load(1);
    setTimeout(function () {
        layer.close(index);
        // layer.msg('打开添加窗口');
        location.href = "/admin/editArticle?id="+id;
    }, 500);

}
function deletearticle(id) {

    var $ = layui.jquery;
    layui.layer.confirm('确定删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/admin/Article/delete',
            data: {
                id:id
            },
            dataType: 'json',
            success: function(result) {
                //提示信息
                layer.msg(result.message);

                if (result.code == 0) {
                   window.location.href = "/admin/articlelist";
                    // location.replace(location.href);
                }

            }
        })

    });
}

