chrome.storage.local.get('queue', function(item) {
    var ul = document.querySelectorAll("ul")[0];
    for (i = 0; i < item.queue.length; ++i) {
	var li = document.createElement("li");
	li.appendChild(document.createTextNode((item.queue[i].number > 0 ? item.queue[i].number : "") + " " + item.queue[i].name));
	var button = document.createElement("input");
	button.type = "button";
	button.id = i.toString();
	button.value = "delete";
	button.className = "button";
	button.addEventListener("click", function() { del(this.id); });
	li.appendChild(button);
	ul.appendChild(li);
    }
});

// chrome.storage.local.get('auth', function(item) {
//     if (typeof item.auth != 'undefined') {
// 	document.querySelectorAll("#login")[0].value = item.auth.login;
// 	document.querySelectorAll("#password")[0].value = item.auth.password;
//     } else {
// 	document.querySelectorAll("#login")[0].value = "login";
// 	document.querySelectorAll("#password")[0].value = "password";
//     }
// });


function del(index) {
    chrome.storage.local.get('queue', function(item) {
	var queue = item.queue;
	queue.splice(index, 1);
	chrome.storage.local.set({queue: queue});
    });
    var li = document.getElementById(index).parentNode;
    li.parentNode.removeChild(li);
    var buttons = document.querySelectorAll(".button");
    for (i = index; i < buttons.length; ++i) {
	buttons[i].id = buttons[i].id - 1;
    }
}

chrome.storage.local.get('enable', function(item) {
    if (item.enable) {
	document.querySelectorAll("#enable")[0].checked = "true";
    }
});

document.querySelectorAll("#enable")[0].addEventListener("change", function() {
    chrome.storage.local.set({'enable' : document.querySelectorAll("#enable")[0].checked});
});

// document.querySelectorAll("#login")[0].addEventListener("change", function() {
//     chrome.storage.local.get('auth', function(item) {
// 	if (typeof item.auth == 'undefined')
// 	    var auth = {'login' : document.querySelectorAll("#login")[0].value, 'password' : ''};
// 	else
// 	    auth = {'login' : document.querySelectorAll("#login")[0].value, 'password' : item.auth.password};
// 	chrome.storage.local.set({auth : auth});
//     });
// });

// document.querySelectorAll("#password")[0].addEventListener("change", function() {
//     chrome.storage.local.get('auth', function(item) {
// 	if (typeof item.auth == 'undefined')
// 	    var auth = {'login' : '', 'password' : document.querySelectorAll("#password")[0].value};
// 	else
// 	    auth = {'login' : item.auth.login, 'password' : document.querySelectorAll("#password")[0].value};
// 	chrome.storage.local.set({auth : auth});
//     });
// });
