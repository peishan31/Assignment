function newtask(el) {
    div1 = document.querySelectorAll(".div1 .divtask").length + 1
    // div2 = document.querySelectorAll(".div2 .divtask").length
    // div3 = document.querySelectorAll(".div3 .divtask").length

    if (div1 <= 3) {
        // console.log("div1: "+div1)
        // console.log("div2: "+div2)
        // console.log("div3: "+div3)
        var taskDesc = prompt("Enter task:");

        if (taskDesc!=null) {
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
            // var t = document.createTextNode("Task description");
            taskcontent.ondblclick = (ev) => {
                //console.log(this);
                // console.log("id:" + ev.target.id);
                taskId = ev.target.id;
                taskDesc = prompt("Enter updated task description");
                if (taskDesc!=null)
                    document.getElementById(taskId).innerHTML = taskDesc;
            }
            var t = document.createTextNode(taskDesc);
            taskcontent.appendChild(t);
            taskcontent.id="task"+nexttask;     
            taskcontent.className = 'taskcontent';
            taskcontent.contentEditable = "false";
            newDiv.appendChild(taskcontent);
            
            document.getElementsByClassName("card-body")[0].appendChild(newDiv);

            console.log("=======================================")
            console.log("1"+ document.getElementsByClassName("div1")[0].innerHTML)
            console.log("2"+ document.getElementsByClassName("div2")[0].innerHTML)
            console.log("3"+ document.getElementsByClassName("div3")[0].innerHTML)
        }
        else {
            alert("Please enter something!");
        }
    }
    else {
        alert("Column is already at its max.")
    }
}

function drop(ev, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    el.appendChild(document.getElementById(data));

    
    console.log("=======================================")
    console.log("1"+ document.getElementsByClassName("div1")[0].innerHTML)
    console.log("2"+ document.getElementsByClassName("div2")[0].innerHTML)
    console.log("3"+ document.getElementsByClassName("div3")[0].innerHTML)
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    // div1 = document.querySelectorAll(".div1 .divtask").length
    // div2 = document.querySelectorAll(".div2 .divtask").length
    // div3 = document.querySelectorAll(".div3 .divtask").length

    // console.log("div1: "+div1)
    // console.log("div2: "+div2)
    // console.log("div3: "+div3)
    
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev.target.id)
    // compare where I was before that (store 2, 3 row before that)
    // if it's bigger than 3 then alert and move back to it's orginal position

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

// local storage
if (JSON.parse(localStorage.getItem('createdBoardName')) != null) {

    document.getElementById("createNew").style.display = "none";
    document.getElementById("board").style.display = "block";

    createdBoardNameJSON = JSON.parse(localStorage.getItem('createdBoardName'))
    createdBoardName = createdBoardNameJSON['createdBoardName'];
    title1 = createdBoardNameJSON['title1'];
    title2 = createdBoardNameJSON['title2'];
    title3 = createdBoardNameJSON['title3'];
    document.getElementById("createdBoardName").innerHTML = createdBoardName;
    document.getElementById("title1").innerHTML = title1;
    document.getElementById("title2").innerHTML = title2;
    document.getElementById("title3").innerHTML = title3;
}
else {
    // hide content & unhide btn
    document.getElementById("createNew").style.display = "block";
    document.getElementById("board").style.display = "none";
    
}

function createNew() {
    // create prompt to create board name and titles
    
    createdBoardName = prompt("Enter board name: ");
    title1 = prompt("Enter first column: ");
    title2 = prompt("Enter second column: ");
    title3 = prompt("Enter third column: ");

    if (createdBoardName!=null&&title1!=null&&title2!=null&&title3!=null) {

        localStorage.clear(); // delete previous existing storage
        
        createdBoardNameJSON = {
            'createdBoardName': createdBoardName,
            'title1': title1,
            'title2': title2,
            'title3': title3
        };

        localStorage.setItem('createdBoardName', JSON.stringify(createdBoardNameJSON));

        document.getElementById("createdBoardName").innerHTML = createdBoardName;
        document.getElementById("title1").innerHTML = title1;
        document.getElementById("title2").innerHTML = title2;
        document.getElementById("title3").innerHTML = title3;

        document.getElementById("createNew").style.display = "none";
        document.getElementById("board").style.display = "block";
    }
    else {
        alert("Please try again!")
    }
}


function updateTaskDescChanges() {
    const input = document.getElementById('1');
    input.addEventListener('input', updateValue);

    function updateValue(e) {
    console.log(e.target);
    }
}
