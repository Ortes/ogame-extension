var annulables = [
    ".supply1",
    ".supply2",
    ".supply3",
    ".supply4",
    ".supply12",
    ".supply22",
    ".supply23",
    ".supply24",
    ".station14",
    ".station21",
    ".station31",
    ".station34",
    ".station44",
    ".station15",
    ".station33",
    ".research113",
    ".research120",
    ".research121",
    ".research114",
    ".research122",
    ".research115",
    ".research117",
    ".research118",
    ".research106",
    ".research108",
    ".research124",
    ".research123",
    ".research199",
    ".research109",
    ".research110",
    ".research111"
];

var navals = [
    ".supply212",
    ".military204",
    ".military205",
    ".military206",
    ".military207",
    ".military215",
    ".military211",
    ".military213",
    ".military214",
    ".civil202",
    ".civil203",
    ".civil208",
    ".civil209",
    ".civil210",
    ".civil212",
    ".defense401",
    ".defense402",
    ".defense403",
    ".defense404",
    ".defense405",
    ".defense406",
    ".defense407",
    ".defense408",
    ".defense502",
    ".defense503"
];

var taskLocation;
var caller;

chrome.storage.local.get('enable', function (item) {
	if (item.enable)
		startTask();
});

function startTask() {
    chrome.storage.local.get('queue', function(item) {
		if (item.queue.length == 0) return;
		taskLocation = item.queue[0].url;
		task = item.queue[0].task;
		if (window.location.href != item.queue[0].url) {
			if (window.location.href.indexOf("lobby") != -1) {
				setTimeout(() => {
					document.querySelectorAll("#accountlist > div > div.rt-table > div.rt-tbody > div > div > div.rt-td.action-cell > button")[0].click();
				}, 3000);
			}
			else
				window.location = taskLocation;
			return;
		}
		if (item.queue[0].number > 0) {
			document.querySelectorAll(task + " .detail_button")[0].click();
			setTimeout(function() { caller = setInterval(function() { tryTask(function(costMet, costCrys, costDeut) {
				try {
					var limitMet = parseInt(parseInt(document.querySelectorAll("#resources_metal")[0].innerHTML.replace(".", "")) / costMet) ;
					limitMet = costMet == 0 ? Number.MAX_VALUE : limitMet;
					var limitCrys = parseInt(parseInt(document.querySelectorAll("#resources_crystal")[0].innerHTML.replace(".", "")) / costCrys);
					limitCrys = costCrys == 0 ? Number.MAX_VALUE : limitCrys;
					var limitDeut = parseInt(parseInt(document.querySelectorAll("#resources_deuterium")[0].innerHTML.replace(".", "")) / costDeut);
					limitDeut = costDeut == 0 ? Number.MAX_VALUE : limitDeut;
					var limit = Math.min(Math.min(Math.min(limitMet, limitCrys), limitDeut), item.queue[0].number);
					document.querySelectorAll("#number")[0].value = limit;
					document.querySelectorAll("#content .build-it_wrap .build-it")[0].click();
					chrome.storage.local.get('queue', function(item) {
					var queue = item.queue;
					queue[0].number = queue[0].number - limit;
					if (queue[0].number < 1) queue.splice(0, 1);
					chrome.storage.local.set({queue: queue});
					clearInterval(caller);
					});
					setTimeout(function() { window.location = taskLocation; }, 4000);
				} catch (err) {
					window.location = taskLocation;
				}
			}) }, 1000); }, 4000);
		} else {
			if (document.querySelectorAll(".content-box-s .data").length != 0) return;
			if (document.querySelectorAll(task + " .fastBuild")[0] != null) {
				chrome.storage.local.get('queue', function(item) {
					var queue = item.queue;
					queue.splice(0, 1);
					chrome.storage.local.set({queue: queue});
				});
				document.querySelectorAll(task + " .fastBuild")[0].click();
			} else {
				document.querySelectorAll(task + " .detail_button")[0].click();
				setTimeout(function() { setInterval(function() { tryTask(function() { window.location = taskLocation; }) }, 1000); }, 4000);
			}
		}
    });
}

function tryTask(sucessFunction) {
    var costs = document.getElementById("costs");
    if (costs.querySelectorAll(".metal.tooltip").length != 0) {
		var costMet = parseInt(costs.querySelectorAll(".metal.tooltip .cost")[0].innerHTML.replace(".", ""));
    } else costMet = 0;
    if (costs.querySelectorAll(".crystal.tooltip").length != 0) {
		var costCrys = parseInt(costs.querySelectorAll(".crystal.tooltip .cost")[0].innerHTML.replace(".", ""));
    } else costCrys = 0;
    if (costs.querySelectorAll(".deuterium.tooltip").length != 0) {
		var costDeut = parseInt(costs.querySelectorAll(".deuterium.tooltip .cost")[0].innerHTML.replace(".", ""));
    } else costDeut = 0;
    if (parseInt(document.getElementById("resources_metal").innerHTML.replace(".", "")) > costMet
		&& parseInt(document.getElementById("resources_crystal").innerHTML.replace(".", "")) > costCrys
		&& parseInt(document.getElementById("resources_deuterium").innerHTML.replace(".", "")) > costDeut)
		sucessFunction(costMet, costCrys, costDeut);
    if (document.querySelectorAll("#tempcounter").length != 0
	&& document.querySelectorAll("#tempcounter")[0].innerHTML === "terminé") {
		window.location = taskLocation;
    }
}

for (i = 0; i < annulables.length; ++i) {
    var element = document.querySelectorAll(annulables[i])[0];
    if (element != null) {
		var link = document.createElement("a");
		link.appendChild(document.createTextNode("queue"));
		link.className = "extensionQueue";
		link.setAttribute("value", annulables[i]);
		link.onclick = function() {
			add2Queue({
			"url" : window.location.href,
			"task" : this.getAttribute('value'),
			"name" : this.parentElement.querySelectorAll(".textlabel")[0].innerHTML,
			"number" : "0"
			});
		};
		element.appendChild(link);
    }
}

for (i = 0; i < navals.length; ++i) {
    var element = document.querySelectorAll(navals[i])[0];
    if (element != null) {
		element.innerHTML += '<a class="extensionQueue">queue</a><input class="numberInput" type="number" min="1" max="999" value="1">';
		var buttonOk = element.querySelectorAll(".extensionQueue")[0];
		buttonOk.setAttribute('value', navals[i]);
		buttonOk.onclick = function() {
			add2Queue({
			"url" : window.location.href,
			"task" : this.getAttribute('value'),
			"name" : this.parentElement.parentElement.querySelectorAll(".textlabel")[0].innerHTML,
			"number" : this.parentElement.querySelectorAll(".numberInput")[0].value
			});
		};
    }
}

function add2Queue(element) {
    chrome.storage.local.get('queue', function(item) {
	if (typeof item.queue == 'undefined')
	    var queue = [];
	else
	    queue = item.queue;
	queue.push(element);
	chrome.storage.local.set({queue: queue});
    });
}


setInterval(() => {
	console.log($('#tempcounter').html());
	if ($('#tempcounter').html() == '1s') {
		setTimeout(() => {
			location.reload();
		}, 2000);
	}
}, 1000);

