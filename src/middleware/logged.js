//Requires
const chalk     = require("chalk")
const User      = require("../db/models/users")
const url       = require("url")

const logged = function(x){

    //x is adminLevel needed!

    //Creates middleware function
    return async (req, res, next) => {

        try {

            //Set default redirect if not set
            if(!req.session.redirect){req.session.redirect = "/home"}

            //If req.user does not exist > redirect to login
            if(!req.user){

                //redirect system
                var redirect
                if(req.route.path){redirect = req.route.path}else{redirect = "/home"}
                req.session.redirect = redirect

                //Go to /login with redirect property
                console.log(chalk.red("Redirecting non-auth user!"))
                req.user = {}
                return res.redirect("/login")
            }
            //Admin level is enough?
            if(req.user.admin < x){
                console.log(chalk.red("Redirecting non-admin user!"))
                req.user = {}
                return res.redirect("/home")
            }


            //Add IP to session ---------------------------------------------

            if(req.socket.remoteAddress){
            if(req.user.token){
                //Get IP
                var ip = req.socket.remoteAddress || null;

                //Every session except the one you are using
                var token = req.user.token
                const openSessions = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})

                //The session you are using
                const yourSession = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

                //Add IP to session
                yourSession[0].ip = ""
                const newReqTokens = [{...yourSession[0], ip}]
                req.user.tokens = openSessions.concat(newReqTokens)

                //Save to db
                await User.updateOne({_id: req.user._id},{tokens: req.user.tokens})
            }
            }

            //-----------------------------------------------------------------    


            next();

        }
        catch (error) {res.redirect("/")}


    }




}

module.exports = logged

