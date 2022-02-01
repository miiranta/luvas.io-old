var appFetPage = 0
var appFetSaveButtonEnable = false;

function appFetSetVarsByLocation(){
    var search = "";
    var sort = 0;
    var local = false;
    var createdbyme = false;
    var profile = "";

    switch(winLocal[1]) {
        case "home":
            search = document.getElementById("appFetSearch").value
            sort = document.getElementById("appFetSort").value
            local = document.getElementById("appFetLocal").checked
            createdbyme = false;
            appFetSaveButtonEnable = true;
            break;

        case "user":
            search = document.getElementById("appFetSearch").value
            sort = document.getElementById("appFetSort").value
            local = document.getElementById("appFetLocal").checked
            createdbyme = false;
            profile = window.location.pathname.split("/").pop();
            appFetSaveButtonEnable = true;
            break;

        case "account":
            search = document.getElementById("appFetSearch").value
            sort = document.getElementById("appFetSort").value
            local = document.getElementById("appFetLocal").checked
            createdbyme = true;
            appFetSaveButtonEnable = false;
            break;
        
        default:
            search = "";
            sort = 0;
            local = false;
            createdbyme = false;
            appFetSaveButtonEnable = false;
            break;
    }

    return {search, local, createdbyme, sort, page: appFetPage, profile}
}


//SOCKET
function appFetLoadPage(){
    var searchData = appFetSetVarsByLocation();

    if(block==0){
        block = 1
        conSocket("search", searchData, (data)=>{
            appFetUpdateButtons(data);
            appFetAppendApps(data);
            block = 0
        })
    }
}

$("#appFetSearchzone").on("change keyup", () => {
    appFetPage = 0;
    $("#appFetPage").text(appFetPage+1)
    appFetLoadPage();
}) 
    
//PAGE MANAGEMENT
function appFetUpdateButtons(searchResults){
    if((appFetPage-1)>=0){
        $("#appFetPrevious").prop("disabled", false);
    }else{
        $("#appFetPrevious").prop("disabled", true);
    }

    if(searchResults.length == 10){
        $("#appFetNext").prop("disabled", false);
    }else{
        $("#appFetNext").prop("disabled", true);
    }
}

$("#appFetPrevious").on("click", function(){
    if(block == 0){
        appFetPage = appFetPage - 1;
        $("#appFetPage").text(appFetPage+1)
        appFetLoadPage();
    }
})

$("#appFetNext").on("click", function(){
    if(block == 0){
        appFetPage = appFetPage + 1;
        $("#appFetPage").text(appFetPage+1)
        appFetLoadPage();  
    }
})

//Append Apps
function appFetAppendApps(searchResults){
    $('#appFetShowzone').empty();
    if(searchResults.length == 0){

        //No apps found
        var appendModel = ` <div class="box2 border2-shadow2 bg-shadow2">
                                <div>
                                <p class="light">No apps found ;(</p>
                                </div>
                            </div>`;

            $('#appFetShowzone').append(appendModel);
    }else{

        //For each app make:
        $.each(searchResults, (i, result) => {

            var saveButton = ''
            if(appFetSaveButtonEnable){
                saveButton = createSaveButton(result.name)
            }

            var appendModel = ` <div class="box2 border2-shadow2 bg-light row">
                                    <div>
                                    <p>${(i+1) + 10*appFetPage}----------------</p>
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

            $('#appFetShowzone').append(appendModel);
        })
    }
}
    
//Initial
appFetLoadPage();
