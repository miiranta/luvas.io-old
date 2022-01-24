const express                                 = require("express")
const passport                                = require('passport')
const logged                                  = require("../middleware/logged")
const notLogged                               = require("../middleware/notLogged")
const {sanitizeInput}                         = require("../utils/other/sanitizeInput.js")
const logout                                  = require("../utils/auth/logout.js")
const { deleteOneSession, deleteAllSessions } = require("../utils/auth/deleteSession")
require("../passport")

const router = new express.Router()

//Login Page
router.get("/login", notLogged, (req, res) => {
  res.render("login")
});

//Logout
router.get("/logout", logged(0), async (req, res) => {
  const codeRes = await logout(req) 
  if(codeRes.redirect){
      res.redirect(codeRes.redirect)
  }
  res.status(codeRes.status).send()
})

//Remove One Session
router.delete("/session", logged(0), async (req, res) => {
  const codeRes = await deleteOneSession(req) 
  res.status(codeRes.status).send()
})


//Remove All Sessions
router.delete("/session/all", logged(0), async (req, res) => {
  const codeRes = await deleteAllSessions(req) 
  res.status(codeRes.status).send()
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
