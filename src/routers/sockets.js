const verifyAppCreate                       = require("../utils/app/verifyAppCreate")
const verifyAppUpdate                       = require("../utils/app/verifyAppUpdate")
const verifyNick                            = require("../utils/profile/verifyNick")
const {verifyBioSocket}                     = require("../utils/profile/verifyBio")
const {verifyCommentSocket}                 = require("../utils/comment/verifyComment")
const fetchApps                             = require("../utils/app/getApps.js")
const fetchComments                         = require("../utils/comment/getComments.js")
const isAppSaved                            = require("../utils/app/isAppSaved.js")
const {sanitizeInput, sanitizeObject}       = require("../utils/other/sanitizeInput.js")


const loadSockets = function(io){

    io.on("connection", (socket)=>{

        sendMessage("Websocket connected!")

    //SEND--------------------------------   

        function sendError(data){
        socket.emit("error", data)
        }

        function sendMessage(data){
        socket.emit("message", data)
        }

    //------------------------------------   

    //GET---------------------------------  

        socket.on("nick", async (nick, callback)=>{

            verifyNick(sanitizeInput(nick)).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("bio", async (data, callback)=>{

            verifyBioSocket(sanitizeInput(data), socket).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("appCr", async (data, callback)=>{

            verifyAppCreate(sanitizeObject(data)).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("appUp", async (data, callback)=>{

            verifyAppUpdate(sanitizeObject(data)).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("search", async (data, callback)=>{
        
            fetchApps(sanitizeObject(data), socket).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("commentVer", async (data, callback)=>{
        
            verifyCommentSocket(sanitizeObject(data)).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("commentLoad", async (data, callback)=>{
        
            fetchComments(sanitizeObject(data)).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("isAppSaved", async (data, callback)=>{
        
            isAppSaved(sanitizeObject(data), socket).then((dataReturn)=>{callback(dataReturn)})

        })
 
        socket.on("disconnect", () =>{
                
                
        })

    })

}

module.exports = {loadSockets}
