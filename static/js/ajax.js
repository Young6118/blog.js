var ajax = (method, path, data, callback) => {
    var r = new XMLHttpRequest()
    // 端口不一样 就可以演示跨域了
    var host = 'http://0.0.0.0:4000'
    path = host + path
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            callback(r.response)
        }
    }
    r.send(data)
}

$.ajax({
    url: url,
    method: method,
    data: data,
    success: function(r) {
        if (r.success) {
            successResponse(r.data)
        } else {
            errorResponse(r.message)
        }
    },
    error: function(e) {
        // 406: 用户名已经占用
        const r = {
            success: false,
            message: '网络错误, 请重新尝试',
        }
        globalErrorResponse(r)
    }
})

var fetch = (url, callback) => {
    ajax('GET', url, '', function(r) {
        console.log('debug raw response', r, r.length)
        var data = JSON.parse(r)
        callback(data)
    })
}

var create = (url, form, callback) => {
    var data = JSON.stringify(form)
    ajax('POST', url, data, function(r) {
        console.log('debug add response', r, r.length)
        var data = JSON.parse(r)
        callback(data)
    })
}

var testFetch = () => {
    var url = '/api/article/all'
    var response = (r) => {
        console.log('debug r', r)
    }
    fetch(url, response)
}

var testCreate = () => {
    var url = '/api/article/add'
    var response = (r) => {
        console.log('create response', r)
    }
    var form = {
        title: 'nodeclub',
        content: 'node11',
    }
    create(url, form, response)
}

var __main = () => {
    testFetch()
    // testCreate()
}

__main()