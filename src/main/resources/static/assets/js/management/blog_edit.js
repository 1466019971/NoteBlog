var editor;
layui.use(['element', 'form', 'layer', 'upload'], function () {
    var form = layui.form;
    var element = layui.element;
    var $ = layui.$;
    var upload = layui.upload;
    element.render();
    form.render();

    var post = function (data, draft, msg) {
        data.field.draft = draft;
        data.field.content = editor.html();
        data.field.cover = $("#coverImg").find("img").attr("src");
        $.ajax({
            type: "post"
            , url: BMY.url.prefix + "/blog/doEdit"
            , dataType: "json"
            , data: data.field
            , success: function (json) {
                BMY.okMsgHandle(json, msg);
                if (json.code === BMY.status.ok)
                    location.hash = vipspa.stringifyParam("blogs", {});
            }
        });
    };
    //监听提交
    form.on('submit(postSubmit)', function (data) {
        post(data, false, "修改博文成功！");
        return false;
    });

    form.on('submit(draftSubmit)', function (data) {
        post(data, true, "修改草稿成功！");
        return false;
    });

    upload.render({
        elem: '#coverImg' //绑定元素
        , url: BMY.url.prefix + '/profile/upload/' //上传接口
        , done: function (res) {
            if (res.code === 0) {
                $("#coverImg").html('<p><img style="width: 144px;height: 90px;" src="' + res.data.src + '"></p>');
            }
            layer.msg(res.msg);
        }
        , error: function () {
            layer.msg("上传失败！");
        }
    });

});

$(function () {

    $('input#tagName').tagsInput({
        defaultText: "点我新增标签",
        width: "auto",
        height: "32px",
        minChars: 1,
        onChange: function (a, e) {
            var length = $("input#tagName").val().split(",").length;
            if (length > 4) {
                layer.msg("最多只能4个！");
                $("#tagName").removeTag(e)
            }
        }
    });

    editor = KindEditor.create('#editor', {
        width: "auto",
        minHeight: 300,
        items: [
            'source', 'preview', 'undo', 'redo', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', 'image', 'graft',
            'flash', 'insertfile', 'table', 'hr', 'emoticons', 'pagebreak',
            'link', 'unlink', 'about'
        ],
        uploadJson: BMY.url.prefix + '/blog/upload',
        dialogOffset: 0, //对话框距离页面顶部的位置，默认为0居中，
        allowImageUpload: true,
        allowMediaUpload: true,
        themeType: 'black',
        fixToolBar: true,
        autoHeightMode: true,
        filePostName: 'uploadFile',//指定上传文件form名称，默认imgFile
        resizeType: 1,//可以改变高度
        afterBlur: function () {
            //失去焦点的时候保存下草稿防止操作失误不小心
        },
        //错误处理 handler
        errorMsgHandler: function (message, type) {
            try {
                JDialog.msg({type: type, content: message, timer: 2000});
            } catch (Error) {
                alert(message);
            }
        }
    });

});






