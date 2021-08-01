const chalk     = require("chalk")
const User      = require("../db/models/users")
const url       = require("url")

const logged = function(x){

    //x is adminLevel needed!

    return async (req, res, next) => {

        try {

            if(!req.session.redirect){req.session.redirect = "/home"}

            if(!req.user){

                //redirect system
                var redirect
                if(req.route.path){redirect = req.route.path}else{redirect = "/home"}
                if(redirect == "/login"){redirect = "/home"}
                if(redirect == "/logout"){redirect = "/home"}
                req.session.redirect = redirect

                console.log(chalk.magenta.bold("[Session] ")+chalk.yellow("Redirecting non-auth user")) 
                req.user = {}
                return res.redirect("/login")
            }
            //Admin level is enough?
            if(req.user.admin < x){
                console.log(chalk.magenta.bold("[Session] ")+chalk.yellow("Redirecting non-admin user")) 
                req.user = {}
                return res.redirect("/home")
            }


            //Add IP to session ---------------------------------------------

            if(req.socket.remoteAddress){
            if(req.user.token){

                var ip = req.socket.remoteAddress || null;

                var token = req.user.token
                const openSessions = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})

                const yourSession = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

                yourSession[0].ip = ""
                const newReqTokens = [{...yourSession[0], ip}]
                req.user.tokens = openSessions.concat(newReqTokens)

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

