//Requires
const express   = require("express")
const passport  = require('passport')
const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const User      = require("../db/models/users")
require("../passport")

//Creates router
const app = new express.Router()


//Login Page--------------------------
app.get("/login", (req, res) => {

  //Load view LOGIN
  res.render("login",{ })
  
});


//Logout Page (Logged only)-------------
app.get("/logout", logged, async (req, res) => {

    var token = req.user.token
  
    //Destroy token in db
    try{
      req.user.tokens = req.user.tokens.filter((tokenFound)=>{
          return token !== tokenFound.token
      })
      //Update db
      await User.updateOne(req.user)
    }catch(e){return res.redirect('/login')}

    //Destroy session
    console.log(chalk.yellow("Unlogged user: ") + chalk.red(req.user.name))
    req.session = null
    req.logout()

    //Redirect
    res.redirect('/login')
  
});

  
//----------------Google-----------------------

//Redirect to googles page
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

//Return with access token 
app.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/logout' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
});

//---------------------------------------------




//Export router
module.exports = app
