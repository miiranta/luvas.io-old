const express                               = require("express")
const passport                              = require('passport')
const logged                                = require("../middleware/logged")
const notLogged                             = require("../middleware/notLogged")
const chalk                                 = require("chalk")
const User                                  = require("../db/models/users")
const {sanitizeInput}                       = require("../utils/other/sanitizeInput.js")
require("../passport")

const router = new express.Router()

//Login Page--------------------------
router.get("/login", notLogged, (req, res) => {

  res.render("login")
  
});


//Logout Page (Logged only)-------------
router.get("/logout", logged(0), async (req, res) => {

    var token = req.user.token
  
    try{
      req.user.tokens = req.user.tokens.filter((tokenFound)=>{
          return token !== tokenFound.token
      })
      await User.updateOne({_id: req.user._id}, req.user)
    }catch(e){return res.redirect('/login')}

    console.log(chalk.magenta.bold("[Session] ") + chalk.yellow("Logged out user: ") + chalk.blue(req.user.email)) 
    req.session = null
    req.logout()

    res.redirect('/')
})


//Remove One Session----------------------------
router.delete("/session", logged(0), async (req, res) => {

  const token = req.body.sessionToDelete

  try{
    req.user.tokens = req.user.tokens.filter((tokenFound)=>{
        return token !== tokenFound.token
    })
    await User.updateOne({_id: req.user._id}, req.user)

  }catch(e){return res.status(400).send()}

  console.log(chalk.magenta.bold("[Session] ") + chalk.yellow("Destroyed session for: ") + chalk.blue(req.user.email)) 
  res.status(200).send()

})


//Remove All Sessions----------------------------
router.delete("/session/all", logged(0), async (req, res) => {

  try{

    req.user.tokens = [];
    await User.updateOne({_id: req.user._id}, req.user)

  }catch(e){return res.status(400).send()}
 
  console.log(chalk.magenta.bold("[Session] ") + chalk.yellow("Destroyed all sessions for: ") + chalk.blue(req.user.email)) 
  res.status(200).send()

})

  
//----------------Google-----------------------

router.get('/auth/google',passport.authenticate('google', { scope: ['profile','email']}))

router.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/logout' }),logged(),
  function(req, res) {

    res.redirect(sanitizeInput(req.session.redirect));
    req.session.redirect = "/home"
});


//-----------------Facebook-------------------

router.get('/auth/facebook', passport.authenticate('facebook',{scope: ["public_profile", "email"]}))

router.get('/auth/facebook/redirect',
passport.authenticate('facebook', { failureRedirect: '/logout' }),logged(),
function(req, res) {

  res.redirect(sanitizeInput(req.session.redirect));
  req.session.redirect = "/home"
});

//--------------------------------------------

module.exports = router
