// window.onload=function(){
//     var nav=document.getElementById('nav2');
//     var table1=document.getElementById("table-viwe1");
window.onload=function(){
	var choose = document.querySelectorAll('.choose-li');
	var viwe = document.querySelectorAll(".table-viwe");
	for (var i = choose.length - 1; i >= 0; i--) {
		choose[i].index=i;
		choose[i].onclick=function() {
			for (var i = viwe.length - 1; i >= 0; i--) {
				choose[i].className="";
				viwe[i].style.display="none";
			}
			choose[this.index].className="active";
			viwe[this.index].style.display="block";
		}

	}
}
var yPush = function(state, title, path) {
	history.pushState(state, title, path)

}
yPush(0, '', '/')