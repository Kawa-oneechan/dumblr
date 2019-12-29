function openNewPost(postType) {
	var id = 'new-'+postType+'-post';
	var f = document.getElementById(id);
	f.firstElementChild.reset();
	openModal(id);
}

function openModal(id) {
	document.getElementById('shadow').style['display'] = 'block';
	document.getElementById(id).style['display'] = 'block';
	window.scroll({'left':0,'top':0,'behavior':'smooth'});
}

function closeModal(id) {
	document.getElementById('shadow').style['display'] = 'none';
	document.getElementById(id).style['display'] = 'none';
}

function submitX(f, okay) {
    xhr = new XMLHttpRequest();
	xhr.open(f.method, f.action);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status === 200) {
			okay(xhr);
		}
		else if (xhr.status !== 200) {
			alert('Request failed.  Returned status of ' + xhr.status);
		}
	};

	let jsonData = {};
	for (var i = 0; i < f.elements.length; i++) {
		if (f.elements[i].name)
			jsonData[f.elements[i].name] = f.elements[i].value;
	}
	let payload = 'type=json&data=' + encodeURIComponent(JSON.stringify(jsonData));

	xhr.send(encodeURI(payload));
}

function submitAndPush(f) {
	submitX(f, function(xhr) {
		var placeholder = document.getElementById('posts');
		placeholder.innerHTML = xhr.responseText + placeholder.innerHTML;
		window.scroll({'left':0,'top':0,'behavior':'smooth'});
	});
}