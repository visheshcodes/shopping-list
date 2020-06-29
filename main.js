function $(e){return document.querySelector(e);}
function $All(e){return document.querySelectorAll(e);}
function $aEL(e, eve, f){return e.addEventListener(eve, f);}
function $cE(e){return document.createElement(e);}

var dataList = [];

$('body').onload = function(){
	show();
	$aEL(window, 'resize', h);
	$aEL($('.addb'), 'click', function(){
		vadd(true);
	});
	$aEL($('.close'), 'click', info);
	$aEL($('.readb'), 'click', read);
	$aEL($('.infoB'), 'click', info);
	
	$aEL($('.table'), 'input', update);
	$aEL($('.table'), 'click', del);
}

function show(){
	l2t();
	
	h();
	vsum();
}

function l2t(){
	if(localStorage.dataList)
		dataList = JSON.parse(localStorage.dataList);
	else
		dataList = [{name:"", qty:"1", price:""}];
	
	if(dataList.length == 0)
		dataList = [{name:"", qty:"1", price:""}];
	
	count = 0;
	for(var r of dataList){
		vadd(false, r);
		count++
	}
}

function update(){
	var table = $All(".table");
	var e = event.target;
	e.innerHTML = e.value;
	
	t2l();
	vsum();
	h();
}

function t2l(){
	var list = $All(".records");
	dataList = [];
	count = 0;
	for(var i of list){
		var currName = $All(".name")[count].innerHTML;
		var currQty = $All(".qty")[count].innerHTML;
		var currPrice = $All(".price")[count].innerHTML;
	
		var recordD = {"name": currName, "qty": currQty, "price": currPrice};
	
		dataList[count] = recordD;
		
		count++;
	}
	
	localStorage.dataList = JSON.stringify(dataList);
}

function vsum(){
	var sum=0, priceValue = 0, price, cal=0, i=0;
	
	var qty = $All('.qty');
	var price = $All('.price');
	
	for(var e of price){
		var a = qty[i].value.replace(/[^\d|.]/g,"");
		qty[i].value = a;
		
		var b = e.value.replace(/[^\d|.]/g,"");
		e.value = b;
		
		i++;
		
		a = Number(a);
		b = Number(b);
		
		priceValue = a*b;
		
		if(priceValue){
			sum += priceValue;
		}
	}
	$('#total').innerHTML = sum;
}

function vadd(user, r){
	var records = document.createElement("DIV");
	records.classList = "demo-no-swipe demo-no-reorder records";
	
	var data = document.createElement("DIV");
	data.classList = "data";
	
	var name = document.createElement("TEXTAREA");
	name.classList = "demo-no-swipe demo-no-reorder input name";
	name.placeholder = "title";
	
	var qnp = document.createElement("DIV");
	qnp.classList = "qnp";
	
	var qty = document.createElement("TEXTAREA");
	qty.classList = "demo-no-swipe demo-no-reorder input qty";
	qty.placeholder = "quantity";
	qty.inputmode = "decimal";
	qty.innerHTML = "1";
	
	var price = document.createElement("TEXTAREA");
	price.classList = "demo-no-swipe demo-no-reorder input price";
	price.placeholder = "price";
	price.inputmode = "decimal";
	
	qnp.appendChild(qty);
	qnp.appendChild(price);
	
	data.appendChild(name);
	data.appendChild(qnp);
	
	var edit = document.createElement("DIV");
	edit.classList = "edit";
	
	var instant = document.createElement("SPAN");
	instant.classList = "instant";
	
	var del = document.createElement("BUTTON");
	del.classList = "demo-no-swipe demo-no-reorder del material-icons";
	del.innerHTML = "clear";
	
	edit.appendChild(instant);
	edit.appendChild(del);
	
	records.appendChild(data);
	records.appendChild(edit);
	
	if(user){
		records.classList.add("off");
	}
	
	$(".table").appendChild(records);
	
	if(r){
		name.innerHTML = r.name;
		qty.innerHTML = r.qty;
		price.innerHTML = r.price;
	}
	
	if(user){
		setTimeout(function(){
			records.classList.remove("off");
		}, 100);
		t2l();
	}
	
	if(user){
		
	}
}

function del(){
	const e = event.target;
	
	if(e.classList.contains("del")){
		var record = e.parentElement.parentElement;
		record.classList.add("off");
		setTimeout(function(){
			record.remove();
			t2l();
		}, 100);
	}
}

function info(){
	var bg = $All(".bg");
	
	for(var e of bg)
		e.classList.toggle("on");
	
	$(".infoB").classList.toggle("active");
	
	menu();
}

function h(){
	var names = $All(".name");
	
	var i=0;
	
	for(var e of names){
		var record = e.parentElement;
		
		e.style.height = "25px";
		
		var h = e.scrollHeight+2+"px";
		
		e.style.height = h;
		
		i++;
	}
}

function setupSlip(list) {
        list.addEventListener('slip:beforereorder', function(e){
            if (e.target.classList.contains('demo-no-reorder')) {
                e.preventDefault();
            }
        }, false);

        list.addEventListener('slip:beforeswipe', function(e){
            if (e.target.nodeName == 'INPUT' || e.target.classList.contains('demo-no-swipe')) {
                e.preventDefault();
            }
        }, false);

        list.addEventListener('slip:beforewait', function(e){
            if (e.target.classList.contains('instant')) e.preventDefault();
        }, false);

        list.addEventListener('slip:afterswipe', function(e){
            e.target.parentNode.appendChild(e.target);
        }, false);

        list.addEventListener('slip:reorder', function(e){
            e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
            return false;
        }, false);
		
        return new Slip(list);
    }
    setupSlip($('.table'));

function read(){
	$(".readmode").classList.toggle("off");
	$(".readb").classList.toggle("on");
	$(".addb").classList.toggle("off");
	$(".readh").classList.toggle("off");
	$('.sl').classList.toggle("off");
	$(".content").classList.toggle("off");
	
	var c = $(".content").classList.contains("off");
	if(c) readmode();
}

function readmode(){
	const readmode = $(".readmode");
	readmode.innerHTML = "";
	
	for(data of dataList){
		var rrecord = $cE("div");
		rrecord.classList = "rrecord";
		
		var rname = $cE("div");
		rname.classList = "rname";
		if(data.name)
			rname.innerHTML = data.name;
		else
			rname.innerHTML = "unnamed";
		
		var rqnpnt = $cE("div");
		rqnpnt.classList = "rqnpnt";
		
		var rprice = $cE("div");
		rprice.classList = "rprice";
		if(data.price)
			rprice.innerHTML = data.price;
		else
			rprice.innerHTML = "0";
		rqnpnt.appendChild(rprice);
		
		var star = $cE("div");
		star.classList = "star";
		star.innerHTML = "*";
		rqnpnt.appendChild(star);
		
		var rqty = $cE("div");
		rqty.classList = "rqty";
		rqty.innerHTML = data.qty;
		rqnpnt.appendChild(rqty);
		
		var equal = $cE("div");
		equal.classList = "equal";
		equal.innerHTML = "=";
		rqnpnt.appendChild(equal);
		
		var rt = $cE("div");
		rt.classList = "rt";
		rt.innerHTML = data.price*data.qty;
		rqnpnt.appendChild(rt);
		
		if(rqnpnt.innerText.length > 40){
			rqnpnt.style.flexDirection = "column";
			rqnpnt.style.textAlign = "right";
		}
		
		rrecord.appendChild(rname);
		rrecord.appendChild(rqnpnt);
		
		readmode.appendChild(rrecord);
	}
}

$aEL($('.clrb'),'click', function(){
	var c = confirm("All data will be cleared!");
	if(c){
		localStorage.clear();
		window.location.href = "index.html";
	}
});

var menuPages = [menu, credits, license];
var currMenuPage = 0;

$('.back').addEventListener('click', back);

function back(){
	menuPages[currMenuPage-1]();
}

function menu(){
	$(".back").classList.add("off");
	$(".opt").classList.remove("off");
	$(".credit").classList.add("off");
	$(".license").classList.add("off");
}

$aEL($('.creditb'),'click', credits);

function credits(){
	$(".back").classList.remove("off");
	$(".opt").classList.add("off");
	$(".credit").classList.remove("off");
	$(".license").classList.add("off");
	
	currMenuPage = 1;
}

$aEL($('.readlicense'),'click', license);

function license(){
	$(".credit").classList.add("off");
	$(".license").classList.remove("off");
	
	currMenuPage = 2;
}