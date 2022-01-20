const chalk                                 = require("chalk")
const express                               = require("express")
const logged                                = require("../middleware/logged")
const redirect                              = require("../middleware/redirect")
const App                                   = require("../db/models/apps")
const User                                  = require("../db/models/users")
const Like                                  = require("../db/models/likes")
const verifyAppCreate                       = require("../utils/app/verifyAppCreate")
const verifyAppUpdate                       = require("../utils/app/verifyAppUpdate")
const getFavicon                            = require("../utils/other/getFavicon")
const {sanitizeInput, sanitizeObject}       = require("../utils/other/sanitizeInput.js")

const router = new express.Router()

//App creation Page (Admin only for now)
router.get("/app", logged(1), (req, res) => {

    res.render("app", {user: sanitizeObject(req.user)})
  
});

//App redirect 
router.get("/app/:id", redirect, async (req, res) => {

    await App.findOne({name: sanitizeInput(req.params.id)}).then(
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
                return res.redirect(appData.url);
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
router.post("/app", logged(1), async (req, res) => {

    const appData = sanitizeObject(req.body)
    
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
        appData.description = appData.description.content
        await App.create({...appData, owner:  req.user._id, picture: favicon})
        console.log(chalk.magenta.bold("[App] ")+chalk.green("Created: ")+chalk.blue(appData.name)) 
    }catch(e){
        console.log(e)
        return res.status(400).send()
    }

    res.send()
});


//App edit page
router.get("/edit/:id", logged(0), async (req, res) => {
    
    const appData = await App.findOne({"name": sanitizeInput(req.params.id)})
    
    //App registered?
    if(appData){
        req.post = appData;

        //App owner trying to edit?
        if(appData.owner == req.user._id){
            return res.render("edit", {post: appData, user: req.user})
        }
        return res.redirect("/home")
    }  
    return res.redirect("/home")
    
})

//App edit
router.post("/edit/:id", logged(0), async (req, res) => {
    const appData = sanitizeObject(req.body)
    const appName = sanitizeObject(req.params.id)
    
    await verifyAppUpdate(appData).then((dataReturn)=>{
        if(dataReturn){return res.status(400).send()}
    })

    if(appData.auth){appData.auth = true}else{appData.auth = false}
    if(appData.local){appData.local = true}else{appData.local = false}
    if(appData.public){appData.public = true}else{appData.public = false}
    appData.adminlevel = (typeof appData.adminlevel === 'undefined') ? 0 : appData.adminlevel;

    if(req.user.admin < 2){
        if(appData.local||appData.auth||appData.adminlevel != 0){return res.status(401).send()}
    }

    //Is the owner correct?
    try{
        const appDb = await App.findOne({name: appName})
        if(appDb){
            if(appDb.owner != req.user._id){return res.status(401).send()}
        }else{return res.status(400).send()}
    }catch(e){return res.status(400).send()}

    //Set the same name
    if(appData.name){
        appData.name = appName
    }

    //Update
    try{
        await App.updateOne({name: appName}, {...appData})
    }catch(e){
        return res.status(400).send()
    }

    res.send()
});

//App delete
router.get("/delete/:id", logged(0), async (req, res) => {
    const appName = sanitizeObject(req.params.id)

    //Is the owner correct?
    try{
        const appDb = await App.findOne({name: appName})
        if(appDb){
            if(appDb.owner != req.user._id){return res.status(401).send()}
        }else{return res.status(400).send()}
    }catch(e){return res.status(400).send()}

    //Delete
    await App.deleteOne({name: appName})
    res.redirect('/home')

})

//App Save
router.post("/save/:id", logged(0), async (req, res) => {
    const appName = sanitizeObject(req.params.id)
    const appDb = await App.findOne({name: appName})

    if(!appDb){
        return res.status(400).send()
    }

    const likeExists = await Like.findOne({postId: appDb._id, likeOwner: req.user._id})

    if(likeExists){
        return res.status(400).send()
    }

    await Like.create({postId: appDb._id, likeOwner: req.user._id})
    res.send()
})

//App Unsave
router.post("/unsave/:id", logged(0), async (req, res) => {
    const appName = sanitizeObject(req.params.id)
    const appDb = await App.findOne({name: appName})

    if(!appDb){
        return res.status(400).send()
    }

    await Like.deleteOne({postId: appDb._id, likeOwner: req.user._id})
    res.send()
})



module.exports = router