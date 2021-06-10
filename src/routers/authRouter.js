//Requires
const express   = require("express")
const passport  = require('passport')
const logged    = require("../middleware/logged")
require("../passport")

//Creates router
const app = new express.Router()

//Login Page
app.get("/login", (req, res) => {

    //Load view WELCOME
    res.render("login",{ })
  
});

//Home Page (Logged only)
app.get("/", logged, (req, res) => {

    //Load view WELCOME
    res.render("main",{ email: req.user.email })
  
});

//Logout Page (Logged only)
app.get("/logout", logged, (req, res) => {

    //Destroy session
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
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

//---------------------------------------------




//Export router
module.exports = app
