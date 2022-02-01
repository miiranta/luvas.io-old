//Local apps Express router
const express           = require("express")
const logged            = require("../src/middleware/logged")
const sanitizeInput     = require("../src/utils/other/sanitizeInput.js")

const router = new express.Router()



router.get("/test", logged(1), (req, res) => {

    res.send("app.html")
  
});

module.exports = router
