
layui.use(['form', 'layedit'], function () {
    var form = layui.form();
    var $ = layui.jquery;
    var layedit = layui.layedit;

    //评论和留言的编辑器
    var editIndex = layedit.build('remarkEditor', {
        height: 150,
        tool: ['face', '|', 'left', 'center', 'right', '|', 'link'],
    });
    //评论和留言的编辑器的验证
    layui.form().verify({
        content: function (value) {
            value = $.trim(layedit.getText(editIndex));
            if (value == "") return "自少得有一个字吧";
            layedit.sync(editIndex);
        }
    });
    //监听评论提交
    form.on('submit(formRemark)', function (data) {
        var index = layer.load(1);
        var article = data.field.editorContent;
        var  articleid = $('#articleId').val();
        $.ajax({
            type: 'post',
            url: '/api/comment/post',
            data: {
                articleid: articleid,
                article: article
            },
            success: function(responseData) {
                layer.close(index);

                setTimeout(function () {
                    $('#remarkEditor').val('');
                    editIndex = layui.layedit.build('remarkEditor', {
                        height: 150,
                        tool: ['face', '|', 'left', 'center', 'right', '|', 'link'],
                    });
                    layer.msg("评论成功", { icon: 1 });
                    location.href = "/main/detail?id="+articleid;
                },500);


            }
        });
        return false;
    });
});

