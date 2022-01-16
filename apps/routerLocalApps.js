//Local apps Express router

const chalk             = require("chalk")
const express           = require("express")
const logged            = require("../src/middleware/logged")

const router = new express.Router()



router.get("/test", logged(1), (req, res) => {

    res.send("app.html")
  
});

module.exports = router
