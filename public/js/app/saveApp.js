function saveApp(appToSave){
    $('#saveApp_' + appToSave).text("❤️")
    $('#saveApp_' + appToSave).removeClass("bnt3")
    $('#saveApp_' + appToSave).addClass("bnt2")
    $('#saveApp_' + appToSave).attr("onClick", "unsaveApp('"+ appToSave +"')")

    conRest('/save/' + appToSave, 'POST', {}, ()=>{})
}

function unsaveApp(appToUnsave){
    $('#saveApp_' + appToUnsave).text("🤍")
    $('#saveApp_' + appToUnsave).removeClass("bnt2")
    $('#saveApp_' + appToUnsave).addClass("bnt3")
    $('#saveApp_' + appToUnsave).attr("onClick", "saveApp('"+ appToUnsave +"')")

    conRest('/unsave/' + appToUnsave, 'POST', {}, ()=>{})
}

function createSaveButton(appName){
    isAppSaved(appName)
    return `<div id=saveAppContainer_${appName}></div>`
}

function isAppSaved(appName){
    var sendData = {appName}
    conSocket('isAppSaved', sendData, (data)=>{
        
        if(data.showButton){
            if(data.saved){
                var appendData = `  <div class="end" style="margin-right:18px;">
                                    <button class="bnt2 bg-light" style="border-radius: 100px height:45px; width: 45px;" id="saveApp_${appName}" onClick="unsaveApp('${appName}')">❤️</button>
                                    </div>`

                $(document).ready(function() {
                    $("#saveAppContainer_" + appName).empty()
                    $("#saveAppContainer_" + appName).append(appendData)
                });   
                      
            }else{
                var appendData = `  <div class="end" style="margin-right:18px;">
                                    <button class="bnt3 bg-light" style="border-radius: 100px height:45px; width: 45px;" id="saveApp_${appName}" onClick="saveApp('${appName}')">🤍</button>
                                    </div>`

                $(document).ready(function() {
                    $("#saveAppContainer_" + appName).empty()
                    $("#saveAppContainer_" + appName).append(appendData)
                });  
            }
        }
    })
  
}
