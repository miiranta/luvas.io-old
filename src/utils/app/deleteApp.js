const App               = require("../../db/models/apps")
const printToConsole    = require("../other/printToConsole")
const { sanitizeInput } = require("../other/sanitizeInput")

async function deleteApp(req){
    const appName = sanitizeInput(req.params.id)
    
    //Is the owner correct?
    try{
        const appDb = await App.findOne({name: appName})
        if(appDb){
            if(appDb.owner != req.user._id){return {status: 400}}
        }else{return {status: 400}}
    }catch(e){return {status: 400}}

    //Delete
    await App.deleteOne({name: appName})
    printToConsole('app', 'App deleted: ', appName, ' by ' + req.user.nick)
    return {status: 202, redirect: '/home'}
}

module.exports = deleteApp