const chalk             = require("chalk")
const express           = require("express")
const logged            = require("../middleware/logged")
const redirect          = require("../middleware/redirect")
const App               = require("../db/models/apps")
const verifyAppCreate   = require("../utils/verifyAppCreate")
const getFavicon        = require("../utils/getFavicon")
const fs                = require('fs')

const app = new express.Router()

//App creation Page (Admin only for now)
app.get("/app", logged(1), (req, res) => {

    res.render("app",{req})
  
});

//App redirect 
app.get("/app/:id", redirect, async (req, res) => {

    await App.findOne({name: req.params.id}).then(
        (appData) => {

        //App registered?
        if(appData){

            //Need Auth?
            if(appData.auth){
                if(!req.user){
                    return res.redirect("/login");
                }

                //Admin Level Required?
                if(req.user.admin < appData.adminlevel){
                    return res.redirect("/home");
                }

            }

            //Is Public?
            if(!appData.public){
                if(!req.user){
                    return res.redirect("/login");
                }
                if(appData.owner != req.user._id){
                    return res.redirect("/home");
                }
            }

            //Local app?
            if(appData.local){

                var pathExists = __dirname + "/../../templates/views/apps/" + req.params.id + ".hbs"; 

                if (fs.existsSync(pathExists)){
                    return res.render("apps/" + req.params.id ,{req})
                }else{
                    
                    return res.redirect("/home");
                }

            }

            //External app?
            if (appData.url.indexOf("http://") == 0 || appData.url.indexOf("https://") == 0) {
                res.redirect(appData.url);
            }
            else{
                res.redirect("https://" + appData.url);
            }


        }else{
            res.redirect("/home");
        }


        }
    )


});


//App create
app.post("/app", logged(1), async (req, res) => {

    const appData = req.body.appData
    
    await verifyAppCreate(appData).then((dataReturn)=>{
        if(dataReturn){return res.status(400).send()}
    })

    if(appData.auth){appData.auth = true}else{appData.auth = false}
    if(appData.local){appData.local = true}else{appData.local = false}
    if(appData.public){appData.public = true}else{appData.public = false}
    appData.adminlevel = (typeof appData.adminlevel === 'undefined') ? 0 : appData.adminlevel;

    if(req.user.admin < 2){
        if(appData.local||appData.auth||appData.adminlevel != 0){return res.status(401).send()}
    }

    if(appData.local == false){
        var favicon = await getFavicon(appData.url)
    }else{
        var favicon = "/img/default-app-icon.png"
    }
    
    try{
    const app = await App.create({...appData, owner: req.user._id, picture: favicon})
    console.log(chalk.magenta.bold("[App] ")+chalk.green("Created: ")+chalk.blue(appData.name)) 
    }catch(e){return res.status(400).send()}

    res.send()

});


module.exports = app