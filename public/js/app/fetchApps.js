const appFetPageSize = 5
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
            formatDates();
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

    if(searchResults.length == appFetPageSize){
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
        var appendModel = ` <div class="box2 border2-shadow1 bg-shadow2">
                                <div>
                                <p class="light" style="margin-top: 20px;">No apps found ;(</p>
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
                
                                    <div class="col">

                                        <div class="row" style="width:150px">
                                            <img style="margin-left:30px; width:50px height:50px;" src="${result.picture}">
                                        </div>

                                        <div class="row">
                                            <div style="margin-left:4px;" class="start">
                        
                                                <div class="start" style="margin-left:80px;">
                                                    <h2>${result.name}</h2>
                                                </div>
                                                <div style="width:100px;">
                                                    <h2>${(i+1) + appFetPageSize*appFetPage}</h2>
                                                </div>

                                            </div>

                                            <div class="start" style="margin-left:84px; margin-top: 2px;">
                                                <p class="shadow2">${result.title}</p>
                                            </div>

                                            <div class="start" style="margin-left:100px; margin-top: 5px;">
                                                <p>by&nbsp</p>
                                                <a href="${'/user/' + result.nick}">
                                                <p style="font-weight:bold;">${result.nick}</p>
                                                </a>
                                            </div>

                                            <div class="start" style="margin-left:100px;">
                                                <p class="makeDate">${result.createdAt}</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <div class="start" style="margin-left:18px;">
                                            <a href="${'/post/' + result.name}">
                                            <button class="bnt4 bg-light shadow1" type="button" style="margin-top: 10px;">show more</button>   
                                            </a>
                                        </div>
                                        
                                        `
                                        +
                                        saveButton
                                        +
                                        `
                                    </div>

                                </div>`;

            $('#appFetShowzone').append(appendModel);
        })
    }
}
    
//Initial
appFetLoadPage();

