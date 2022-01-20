var block = 0
var winLocal = window.location.pathname.split("/");
var saveButtonEnable = false;

var page = 0
var search = "";
var sort = 0;
var local = false;
var createdbyme = false;
var profile = "";

function setVarsByLocation(){
    switch(winLocal[1]) {
        case "home":
            search = document.getElementById("search").value
            sort = document.getElementById("sort").value
            local = document.getElementById("local").checked
            createdbyme = false;
            saveButtonEnable = true;
            break;

        case "user":
            search = document.getElementById("search").value
            sort = document.getElementById("sort").value
            local = document.getElementById("local").checked
            createdbyme = false;
            profile = window.location.pathname.split("/").pop();
            saveButtonEnable = true;
            break;

        case "account":
            search = document.getElementById("search").value
            sort = document.getElementById("sort").value
            local = document.getElementById("local").checked
            createdbyme = true;
            saveButtonEnable = false;
            break;
        
        default:
            search = "";
            sort = 0;
            local = false;
            createdbyme = false;
            saveButtonEnable = false;
            break;
    }
}


//SOCKET
function loadPage(){
    setVarsByLocation();
    var searchData = {search, local, createdbyme, sort, page, profile}
  
    if(block==0){
        block = 1

        socket.emit("search", searchData, (data)=>{
            updateButtons(data);
            appendApps(data);
            block = 0
        })
    }
}

$("#searchzone").on("change keyup", () => {
    page = 0;
    $("#page").text(page+1)
    loadPage();
}) 
    

//PAGE MANAGEMENT
function updateButtons(searchResults){
    if((page-1)>=0){
        $("#previous").prop("disabled", false);
    }else{
        $("#previous").prop("disabled", true);
    }

    if(searchResults.length == 10){
        $("#next").prop("disabled", false);
    }else{
        $("#next").prop("disabled", true);
    }
}

$("#previous").on("click", function(){
    if(block == 0){
        page = page - 1;
        $("#page").text(page+1)
        loadPage();
    }
})

$("#next").on("click", function(){
    if(block == 0){
        page = page + 1;
        $("#page").text(page+1)
        loadPage();  
    }
})


//Append Apps
function appendApps(searchResults){
    $('#showzone').empty();
    if(searchResults.length == 0){

        //No apps found
        var appendModel = ` <div>
                                <div>
                                <p>No apps found ;(</p>
                                </div>
                            </div>`;

            $('#showzone').append(appendModel);
    }else{

        //For each app make:
        $.each(searchResults, (i, result) => {

            var saveButton = ''
            if(saveButtonEnable){
                saveButton = createSaveButton(result.name)
            }

            var appendModel = ` <div>
                                    <div>
                                    <p>${(i+1) + 10*page}----------------</p>
                                    </div>

                                    <div>
                                    <p>${result.title}</p>
                                    </div>

                                    <div>
                                    <a href="/post/${result.name}">Show more</a>
                                    </div>

                                    <div>
                                    <p>${result.createdAt}</p>
                                    </div>

                                    <div>
                                    <p>${result.nick}</p>
                                    </div>

                                    `
                                    +
                                    saveButton
                                    +
                                    `

                                </div>`;

            $('#showzone').append(appendModel);
        })
    }
}
    

//Initial
loadPage();
