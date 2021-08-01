const multer = require("multer")

const upload = multer({

    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    },
    
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            req.fileError = {"message":"File must be image"}
            return cb()
        }

        cb(undefined, true)
        
    }

})

module.exports = upload