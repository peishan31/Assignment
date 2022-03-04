function newtask(el) {
	var taskArray = [];
	var matches = document.getElementsByClassName("divtask");
	for (var i = 0, l = matches.length; i < l; i++) 
		taskArray.push(matches[i].getAttribute("id"));
	
	if( taskArray.length ) {
		var nexttask = Math.max.apply(null, taskArray) + 1;
	} else {
		var nexttask = 1;
	}
	
	var newDiv = document.createElement("div");	
	newDiv.id = nexttask;
	newDiv.className = 'divtask';
	newDiv.draggable = 'true';
	newDiv.addEventListener('dragstart', function() {drag(event)}, false);
	
	var taskcontent = document.createElement('P');
	var t = document.createTextNode("Task description");
	taskcontent.appendChild(t);     
	taskcontent.className = 'taskcontent';
	taskcontent.contentEditable = "true";
	newDiv.appendChild(taskcontent);
	
    document.getElementsByClassName("card-body")[0].appendChild(newDiv);
}

function drop(ev, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    el.appendChild(document.getElementById(data));
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function deletediv(ev) {
    ev.preventDefault();
	var data=ev.dataTransfer.getData("text");
	var ev = document.getElementById(data);
	
	var bintest = confirm("Delete this task?");
		if (bintest == true) {
			ev.parentNode.removeChild(ev);
		} else {
	}
}
