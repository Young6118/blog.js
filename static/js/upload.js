var log = console.log.bind(console)
var fd = null

var upload = function() {
    var request = {
        url: '/user/upload/avatar',
        method: 'post',
        data: fd,
        // 注意, 下面两行是上传文件的套路
        contentType: false,
        processData: false,
        success: function(r) {
            log('上传成功', r)
            $('body').append('使用 ajax 上传成功了')
        },
        error: function(e) {
            log('debug e', e)
        }
    }
    $.ajax(request)
}

$('#upload-file').on('change', () => {
    var element = $('#upload-file')
    var file = element.get(0).files[0]
    fd = new FormData()
    fd.append('avatar', file)
})

var __main = () => {
    $('#submit-button').on('click', (e) => {
        e.preventDefault()
        upload()
    })
}

$(document).ready(() => {
    __main()
})