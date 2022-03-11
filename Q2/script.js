localStorage.clear(); // delete previous existing storage

function newtask(el) {
    div1 = document.querySelectorAll(".div1 .divtask").length + 1

    if (div1 <= 3) {
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
            
            var t = document.createTextNode(taskDesc);
            taskcontent.appendChild(t);
            taskcontent.id="task"+nexttask;     
            taskcontent.className = 'taskcontent';
            taskcontent.contentEditable = "true";
            newDiv.appendChild(taskcontent);
            
            document.getElementsByClassName("card-body")[0].appendChild(newDiv);

            div1 = document.querySelectorAll(".div1 .divtask").length
            div2 = document.querySelectorAll(".div2 .divtask").length
            div3 = document.querySelectorAll(".div3 .divtask").length
            
            setColumnCountInStorage(div1, div2, div3)
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

    // check if column has more than 3 tasks
    createdBoardNameJSON = JSON.parse(localStorage.getItem('columnCount'))
    prevDiv1 = createdBoardNameJSON['column1'];
    prevDiv2 = createdBoardNameJSON['column2'];
    prevDiv3 = createdBoardNameJSON['column3'];

    targetColumnClass=el.className.split(' ')[1]; // current drop's classname E.g. "div1", "div2", "div3"
    if (targetColumnClass=="div1") {
        if (prevDiv1<3) {
            el.appendChild(document.getElementById(data));
        }   
    }
    else if (targetColumnClass=="div2") {
        if (prevDiv2<3) {
            el.appendChild(document.getElementById(data));
        } 
    }
    else if (targetColumnClass=="div3") {
        if (prevDiv3<3) {
            el.appendChild(document.getElementById(data));
        } 
    }
    // check if need add inside
    setColumnCountInStorage(div1, div2, div3)
}

function setColumnCountInStorage(div1, div2, div3) {

    div1 = document.querySelectorAll(".div1 .divtask").length
    div2 = document.querySelectorAll(".div2 .divtask").length
    div3 = document.querySelectorAll(".div3 .divtask").length

    columnCountJSON = {
        'column1': div1,
        'column2': div2,
        'column3': div3
    }
    
    localStorage.setItem('columnCount', JSON.stringify(columnCountJSON)); 
    //console.log("curr added column: "+ JSON.stringify(columnCountJSON));
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) { 
    
    ev.dataTransfer.setData("text", ev.target.id);
    //console.log(ev.target.id);
}

function deletediv(ev) {
    ev.preventDefault();
	var data=ev.dataTransfer.getData("text");
	var ev = document.getElementById(data);
	
	var bintest = confirm("Delete this task?");
		if (bintest == true) {
			ev.parentNode.removeChild(ev);

            div1 = document.querySelectorAll(".div1 .divtask").length
            div2 = document.querySelectorAll(".div2 .divtask").length
            div3 = document.querySelectorAll(".div3 .divtask").length

            // ***
            
            columnCountJSON = {
                'column1': div1,
                'column2': div2,
                'column3': div3
            }
            localStorage.setItem('columnCount', JSON.stringify(columnCountJSON)); 
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
