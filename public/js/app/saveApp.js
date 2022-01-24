function saveApp(appToSave){
    $('#saveApp_' + appToSave).text("unsave")
    $('#saveApp_' + appToSave).attr("onClick", "unsaveApp('"+ appToSave +"')")

    conRest('/save/' + appToSave, 'POST', {}, ()=>{})
}

function unsaveApp(appToUnsave){
    $('#saveApp_' + appToUnsave).text("save")
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
                var appendData = `  <div>
                                    <button id="saveApp_${appName}" onClick="unsaveApp('${appName}')">unsave</button>
                                    </div>`

                $(document).ready(function() {
                    $("#saveAppContainer_" + appName).empty()
                    $("#saveAppContainer_" + appName).append(appendData)
                });   
                      
            }else{
                var appendData = `  <div>
                                    <button id="saveApp_${appName}" onClick="saveApp('${appName}')">save</button>
                                    </div>`

                $(document).ready(function() {
                    $("#saveAppContainer_" + appName).empty()
                    $("#saveAppContainer_" + appName).append(appendData)
                });  
            }
        }
    })
  
}
