$ = (e) => document.querySelector(e);
$All = (e) => document.querySelectorAll(e);
$aEL = (e, eve, f) => e.addEventListener(eve, f);
$cE = (e) => document.createElement(e);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

dataList = [],
menuPages = [menu, credits, license],
currMenuPage = 0;

class Record{
	constructor(name, qty, price){
		this.name = name;
		this.qty = qty;
		this.price = price;
	}
}

$('body').onload = () => {
	show();

	$aEL(window, 'resize', h);
	$aEL($('.addb'), 'click', () => vadd(false));
	$aEL($('.close'), 'click', info);
	$aEL($('.readb'), 'click', read);
	$aEL($('.infoB'), 'click', info);
	$aEL($('.back'), 'click', back);
	$aEL($('.table'), 'input', update);
	$aEL($('.table'), 'click', del);
	$aEL($('.creditb'),'click', credits);
	$aEL($('.readlicense'),'click', license);
	$aEL($('.clrb'),'click', allClear);
}

const show = () => {
	storageToDom();
	h();
	vsum();
}

const update = () => {
	var e = event.target;

	floatValidate(e);

	e.innerHTML = e.value;
	
	DomToStorage();
	vsum();
	h();
}

const DomToStorage = () => {
	var records = $All(".records");
	var names = $All(".name");
	var qtys = $All(".qty");
	var prices = $All(".price");

	dataList = [];

	for(count=0;count < records.length; count++){
		var currName = names[count].value;
		var currQty = qtys[count].value;
		var currPrice = prices[count].value;
	
		var recordD = new Record(currName, currQty, currPrice);
	
		dataList.push(recordD);
	}
	
	localStorage.dataList = JSON.stringify(dataList);
}

const storageToDom = () => {
	dataList = [];
	var initRecord = new Record("", 1, "");
	$(".table").innerHTML = "";

	if(localStorage.dataList)
		dataList = JSON.parse(localStorage.dataList);
	else{
		dataList = [initRecord];
	}
	
	if(dataList.length == 0){
		dataList = [initRecord];
	}
	
	for(var data of dataList){
		vadd(data);
	}
}

const floatValidate = (e) => {
	var floatRegX = new RegExp("[^\\d|.]","g");

	if(e.classList.contains("qty") || e.classList.contains("price")){
		e.value = e.value.replace(floatRegX, "");
	}
}

const vsum = () => {
	var sum = 0, priceValue = 0, price,  i=0;
	
	var qty = $All('.qty');
	var price = $All('.price');
	
	for(var e of price){
		var a = qty[i].value;
		
		var b = e.value;
		
		i++;
		
		a = Number(a);
		b = Number(b);
		
		priceValue = Number((a * b).toFixed(2));
		
		if(priceValue){
			sum += priceValue;
		}
	}
	$('#total').innerHTML = sum;
}

const vadd = (data) => {
	var records = $cE("div");
	records.classList = "demo-no-swipe demo-no-reorder records";

	var dataC = $cE("div");
	dataC.classList = "dataC";
	
	var dataE = $cE("div");
	dataE.classList = "data";
	
	var name = $cE("textarea");
	name.classList = "demo-no-swipe demo-no-reorder input name";
	name.placeholder = "title";
	if(data){
		name.innerHTML = data.name
	}
	
	var qnp = $cE("div");
	qnp.classList = "qnp";
	
	var qty = $cE("textarea");
	qty.classList = "demo-no-swipe demo-no-reorder input qty";
	qty.placeholder = "quantity";
	qty.inputmode = "decimal";
	if(data) qty.innerHTML = data.qty;
	else qty.innerHTML = "1";
	
	var price = $cE("textarea");
	price.classList = "demo-no-swipe demo-no-reorder input price";
	price.placeholder = "price";
	price.inputmode = "decimal";
	if(data) price.innerHTML = data.price;
	
	qnp.appendChild(price);
	qnp.appendChild(qty);
	
	dataE.appendChild(name);
	dataE.appendChild(qnp);

	dataC.appendChild(dataE);
	
	var edit = $cE("DIV");
	edit.classList = "edit";
	
	var instant = $cE("button");
	instant.classList = "instant";
	
	var del = $cE("button");
	del.classList = "demo-no-swipe demo-no-reorder del";
	
	edit.appendChild(del);

	edit.appendChild(instant);
	
	records.appendChild(dataC);
	records.appendChild(edit);
	
	if(!data){
		records.classList.add("off");
	}
	
	$(".table").appendChild(records);
	
	DomToStorage();

	if(!data){
		setTimeout(() => {
			records.classList.remove("off");
		}, 100);
	}
}

const del = () => {
	var e = event.target;

	if(e.classList.contains("del")){
		var record = e.parentElement.parentElement;
		record.classList.add("off");
		setTimeout(() => {
			record.remove();
			DomToStorage();
		}, 100);
	}
}

const info = () => {
	var bg = $All(".bg");
	
	for(var e of bg)
		e.classList.toggle("on");
	
	$(".infoB").classList.toggle("active");
	
	menu();
}

const h = () => {
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

const setupSlip = (list) => {
        list.addEventListener('slip:beforereorder', (e) => {
            if (e.target.classList.contains('demo-no-reorder')) {
                e.preventDefault();
            }
        }, false);

        list.addEventListener('slip:beforeswipe', (e) => {
            if (e.target.nodeName == 'INPUT' || e.target.classList.contains('demo-no-swipe')) {
                e.preventDefault();
            }
        }, false);

        list.addEventListener('slip:beforewait', (e) => {
            if (e.target.classList.contains('instant')) e.preventDefault();
        }, false);

        list.addEventListener('slip:afterswipe', (e) => {
            e.target.parentNode.appendChild(e.target);
        }, false);

        list.addEventListener('slip:reorder', (e) => {
            e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
            return false;
        }, false);
		
        return new Slip(list);
    }
    setupSlip($('.table'));

const read = () => {
	$(".readmode").classList.toggle("off");
	$(".readb").classList.toggle("on");
	$(".addb").classList.toggle("off");
	$(".readh").classList.toggle("off");
	$('.sl').classList.toggle("off");
	$(".content").classList.toggle("off");
	
	var c = $(".content").classList.contains("off");
	if(c) readmode();
}

const readmode = () => {
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
		
		var rqnp = $cE("div");
		rqnp.classList = "rqnp";

		var rqty = $cE("div");
		rqty.classList = "rqty";
		rqty.innerHTML = data.qty;
		rqnp.appendChild(rqty);
		
		var star = $cE("div");
		star.classList = "star";
		star.innerHTML = "*";
		rqnp.appendChild(star);

		var rprice = $cE("div");
		rprice.classList = "rprice";
		if(data.price)
			rprice.innerHTML = data.price;
		else
			rprice.innerHTML = "0";
		rqnp.appendChild(rprice);

		var rtC = $cE("div");
		rtC.classList = "rtC";
		
		var rt = $cE("div");
		rt.classList = "rt";
		rt.innerHTML = Number((data.price*data.qty).toFixed(2));
		rtC.appendChild(rt);

		var equal = $cE("div");
		equal.classList = "equal";
		equal.innerHTML = "=";
		rtC.appendChild(equal);
		
		if(rqnp.innerText.length > 40){
			rqnp.style.flexDirection = "column";
			rqnp.style.textAlign = "right";
		}
		
		rrecord.appendChild(rname);
		rrecord.appendChild(rqnp);
		rrecord.appendChild(rtC);
		
		readmode.appendChild(rrecord);
	}
}

const allClear = () => {
	var c = confirm("All data will be cleared!");
	if(c){
		localStorage.clear();
		window.location.href = "index.html";
	}
}

const back = () => {
	menuPages[currMenuPage-1]();
}

function menu(){
	$(".back").classList.add("off");
	$(".opt").classList.remove("off");
	$(".credit").classList.add("off");
	$(".license").classList.add("off");
}

function credits(){
	$(".back").classList.remove("off");
	$(".opt").classList.add("off");
	$(".credit").classList.remove("off");
	$(".license").classList.add("off");
	
	currMenuPage = 1;
}

function license(){
	$(".credit").classList.add("off");
	$(".license").classList.remove("off");
	
	currMenuPage = 2;
}