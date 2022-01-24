const App               = require("../../db/models/apps")
const printToConsole    = require("../other/printToConsole")
const { sanitizeInput } = require("../other/sanitizeInput")
const verifyAppUpdate   = require("./verifyAppUpdate")

async function editApp(req){
    const appData = req.body
    const appName = sanitizeInput(req.params.id)
  
    await verifyAppUpdate(appData).then((dataReturn)=>{
        if(dataReturn){return {status: 400}}
    })

    if(appData.auth){appData.auth = true}else{appData.auth = false}
    if(appData.local){appData.local = true}else{appData.local = false}
    if(appData.public){appData.public = true}else{appData.public = false}
    appData.adminlevel = (typeof appData.adminlevel === 'undefined') ? 0 : appData.adminlevel;

    if(req.user.admin < 2){
        if(appData.local||appData.auth||appData.adminlevel != 0){return {status: 401}}
    }

    //Is the owner correct?
    try{
        const appDb = await App.findOne({name: appName})
        if(appDb){
            if(appDb.owner != req.user._id){return {status: 401}}
        }else{return {status: 400}}
    }catch(e){return {status: 400}}

    //Set the same name
    if(appData.name){
        appData.name = appName
    }

    //Update
    if(appData.description){
        appData.description = JSON.stringify(appData.description)
    }
    
    try{
        await App.updateOne({name: appName}, {...appData})
    }catch(e){
        return {status: 400}
    }

    printToConsole('app', 'App edited: ', appName, ' by ' + req.user.nick)
    return {status: 202}

}

module.exports = editApp;