//Requires
const express   = require("express")
const passport  = require('passport')
const logged    = require("../middleware/logged")
const notLogged = require("../middleware/notLogged")
const chalk     = require("chalk")
const User      = require("../db/models/users")
require("../passport")

//Creates router
const app = new express.Router()


//Login Page--------------------------
app.get("/login" ,notLogged, (req, res) => {

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
  
})


//Remove One Session----------------------------
app.delete("/session", logged, async (req, res) => {

  const token = req.body.sessionToDelete

  //Destroy token in db
  try{
    req.user.tokens = req.user.tokens.filter((tokenFound)=>{
        return token !== tokenFound.token
    })
    //Update db
    await User.updateOne(req.user)
  }catch(e){return res.status(400).send()}

  //Respond
  console.log(chalk.yellow("Unlogged user (session): ") + chalk.red(req.user.name))
  res.status(200).send()

})


//Remove All Sessions----------------------------
app.delete("/session/all", logged, async (req, res) => {

  //Destroy tokens in db
  req.user.tokens = [];
  await User.updateOne(req.user)

  //Respond
  console.log(chalk.yellow("Unlogged user (all sessions): ") + chalk.red(req.user.name))
  res.status(200).send()

})

  
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


//-----------------Facebook-------------------

//Redirect to facebooks page
app.get('/auth/facebook', passport.authenticate('facebook',{scope: ["public_profile", "email"]}));

//Return with access token
app.get('/auth/facebook/redirect',
passport.authenticate('facebook', { failureRedirect: '/logout' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/home');
});

//--------------------------------------------

//Export router
module.exports = app
