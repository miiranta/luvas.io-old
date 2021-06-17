const chalk             = require("chalk")
const express           = require("express")
const logged            = require("../middleware/logged")
const App               = require("../db/models/apps")
const verifyAppCreate   = require("../utils/verifyAppCreate")
const getFavicon        = require("../utils/getFavicon")

//Creates router
const app = new express.Router()

//App creation Page (Admin only for now)
app.get("/app", logged(1), (req, res) => {

    //Load view APP
    res.render("app",{req})
  
});


//App redirect 
app.get("/app/:id", logged(0), (req, res) => {

    
  
});


//App create
app.post("/app", logged(1), async (req, res) => {

    const appData = req.body.appData
    
    //Verify app data
    await verifyAppCreate(appData).then((dataReturn)=>{
        if(dataReturn){return res.status(400).send()}
    })

    //Integrity (Avoid strings in the booleans)
    if(appData.auth){appData.auth = true}else{appData.auth = false}
    if(appData.local){appData.local = true}else{appData.local = false}
    if(appData.public){appData.public = true}else{appData.public = false}

    //Security (Local and auth only accessible by adminLevel 1)
    if(req.user.admin < 1){
        if(appData.local||appData.auth){return res.status(401).send()}
    }

    //Get favicon
    const favicon = await getFavicon(appData.url)

    //Create app in db
    try{
    const app = await App.create({...appData, owner: req.user._id, picture: favicon})
    console.log(chalk.magenta.bold("[App] ")+chalk.green("Created: ")+chalk.blue(appData.name)) 
    }catch(e){return res.status(400).send()}

    //Send
    res.send()

});




//Export router
module.exports = app