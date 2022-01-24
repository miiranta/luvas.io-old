const verifyAppCreate           = require("./verifyAppCreate")
const App                       = require("../../db/models/apps")
const getFavicon                = require("../other/getFavicon")
const printToConsole = require("../other/printToConsole")

async function createApp(req){
    const appData = req.body

    //Is app valid?
    await verifyAppCreate(appData).then((dataReturn)=>{
        if(dataReturn){return {status: 400}}
    })

    if(appData.auth){appData.auth = true}else{appData.auth = false}
    if(appData.local){appData.local = true}else{appData.local = false}
    if(appData.public){appData.public = true}else{appData.public = false}
    appData.adminlevel = (typeof appData.adminlevel === 'undefined') ? 0 : appData.adminlevel;

    if(req.user.admin < 2){
        if(appData.local||appData.auth||appData.adminlevel != 0){return {status: 401}}
    }

    //Favicon/image
    if(appData.local == false){
        var favicon = await getFavicon(appData.url)
    }else{
        var favicon = "/img/default-app-icon.png"
    }

    //Add to db
    try{
        appData.description = JSON.stringify(appData.description.content)
        await App.create({...appData, owner:  req.user._id, picture: favicon})

        printToConsole('app', 'New app created: ', appData.name, ' by ' + req.user.nick)
        
    }catch(e){
        console.log(e)
        return {status: 400};
    }

    return {status: 201};
}

module.exports = createApp;