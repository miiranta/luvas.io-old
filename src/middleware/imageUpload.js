const multer = require("multer")

//Image Upload MIddleware ----------------------------
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("File must be image"))
        }

        cb(undefined, true)
        
    }

})
//---------------------------------------------------

module.exports = upload