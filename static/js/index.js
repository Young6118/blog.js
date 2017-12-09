var amount = 3
var e = function(selector) {
	return document.querySelector(selector)
}
var es = function(selector) {
	return document.querySelectorAll(selector)
}
var bindAll = function(selector, eventName, callback) {
	var elements = document.querySelectorAll(selector)
	for(var i = 0; i < elements.length; i++) {
		var e = elements[i]
		bindEvent(e, eventName, callback)
	}
}
var bindEvent = function(element, eventName, callback) {
	element.addEventListener(eventName, callback)
}
var toggleClass = function(element, className) {
	if (element.classList.contains(className)) {
		element.classList.remove(className)
	} else {
		element.classList.add(className)
	}
}
var removeClassAll = function(className) {
	var elements = document.querySelectorAll('.' + className)
	for (var i = 0; i < elements.length; i++) {
		var ele = elements[i]
		ele.classList.remove(className)
	}
}
var change = function(cur) {
	var index = (amount + cur - 2) % amount
	changeDirect(index)
}
var changeDirect = function(index) {
	e('.imgs').dataset.index = index
	removeClassAll('active')
	removeClassAll('highlight')
	toggleClass(e(`.img-${index}`), 'active')
	toggleClass(e(`.dot-${index}`), 'highlight')
}
var changeAuto = function() {
	change(parseInt(e('.imgs').dataset.index))
}
var toggleButton = function () {
	var loginBtn = e('.login-btn')
	var logoutBtn = e('.logout-btn')
	var regBtn = e('.reg-btn')
	var catalogue = e('.catalogue')
	if(e('.cur-user').innerHTML == "游客") {
		toggleClass(logoutBtn, 'hide')
		toggleClass(catalogue, 'hide')
	} else {
		toggleClass(loginBtn, 'hide')
		toggleClass(regBtn, 'hide')
	}
}
bindAll('.dot', 'mouseover', (event)=> {
	var index = parseInt(event.target.dataset.list)
	clearInterval(id)
	changeDirect(index)
})
bindAll('.dot', 'mouseout', ()=> {
	id = setInterval(changeAuto, 4000)
})

var id = setInterval(changeAuto, 4000)
toggleButton()