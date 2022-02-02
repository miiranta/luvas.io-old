const App                   = require("../../db/models/apps");
const { sanitizeInput }     = require("../other/sanitizeInput");
const updateRelevanceScore  = require("./updateRelevanceScore");

async function redirectToApp(req){
    const appData = await App.findOne({name: sanitizeInput(req.params.id)})

        //App registered?
        if(appData){

            //Need Auth?
            if(appData.auth){
                if(!req.user){
                    return {status: 200, redirect: '/login'};
                }

                //Admin Level Required?
                if(req.user.admin < appData.adminlevel){
                    return {status: 401, redirect: '/home'};
                }

            }

            //Is Public?
            if(!appData.public){
                if(!req.user){
                    return {status: 200, redirect: '/login'};
                }
                if(appData.owner != req.user._id){
                    return {status: 401, redirect: '/home'};
                }
            }

            //Local app?
            if(appData.local){
                await App.updateOne({_id: appData._id}, {$inc : {'viewCount' : 1}})
                updateRelevanceScore(appData)
                return {status: 200, redirect: appData.url};
            }

            //External app?
            if (appData.url.indexOf("http://") == 0 || appData.url.indexOf("https://") == 0) {
                await App.updateOne({_id: appData._id}, {$inc : {'viewCount' : 1}})
                updateRelevanceScore(appData)
                return {status: 200, redirect: appData.url};
            }
            else{
                await App.updateOne({_id: appData._id}, {$inc : {'viewCount' : 1}})
                updateRelevanceScore(appData)
                return {status: 200, redirect: "https://" + appData.url};
            }

        }else{
            return {status: 400, redirect: '/home'};
        }

}

module.exports = redirectToApp