	var autoSave = function () {
	    save()
	    var date = new Date()
	    var time = date.toTimeString()
	    $('.auto-save-prompt')[0].innerHTML = time + ' saved newest version to local'
	}
	var save = function () {
		var arr = $('form')[0].innerText.split('\n')
		 var s =  ''
		for(var i = 3; i < arr.length - 3; i++) {
			s += arr[i] + String.fromCharCode(10)
		}
	    var len = s.length
	    var obj = {
	        text: s,
	        len: len,
	    }
	    var str = localStorage.savedText
	    if (str) {
	        var object = load()
	        var oldLength = object.len
	        if (len > oldLength) {
	            localStorage.savedText = JSON.stringify(obj)
	        }
	    } else {
	        localStorage.savedText = JSON.stringify(obj)

	    }
	}
	var load = function () {
	    var str = localStorage.savedText
	    var obj = JSON.parse(str)
	    return obj
	}
	var recovery = function () {
	    var clipboard = new Clipboard('.btn', {
	        text: function () {
	            var obj = load()
	            return obj.text
	        }
	    });

	    clipboard.on('success', function () {
	    	$('.recovery-prompt')[0].innerHTML = '已成功复制到剪贴板中，请直接粘贴至编辑区域'
	    	setTimeout(function() {
	    		$('.recovery-prompt')[0].innerHTML = '点击按钮回滚至历史文章本地缓存'
	    	}, 2000)
	    });

	    clipboard.on('error', function () {
	        $('.recovery-prompt')[0].innerHTML = '回滚失败，请重试'
	    });
	}
	var main = function () {
	    var delay = 1000 * 60 * 3
	    setInterval(autoSave, delay)
	}

	function keyDown(e) {

	    var currKey = 0,
	        e = e || event || window.event;
	    currKey = e.keyCode || e.which || e.charCode;
	    if (currKey == 83 && (e.ctrlKey || e.metaKey)) {
	        e.preventDefault();
	        save()
	    }
	}
	document.onkeydown = keyDown;

	main()