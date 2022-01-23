const verifyAppCreate                       = require("../utils/app/verifyAppCreate")
const verifyAppUpdate                       = require("../utils/app/verifyAppUpdate")
const verifyNick                            = require("../utils/profile/verifyNick")
const {verifyBioSocket}                     = require("../utils/profile/verifyBio")
const {verifyCommentSocket}                 = require("../utils/comment/verifyComment")
const fetchApps                             = require("../utils/app/fetchApps.js")
const fetchComments                         = require("../utils/comment/fetchComments.js")
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

        socket.on("nick", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeInput(data))
            verifyNick(dataSanit).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("bio", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeInput(data))
            verifyBioSocket(dataSanit, socket).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("appCr", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeObject(data))
            verifyAppCreate(dataSanit).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("appUp", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeObject(data))
            verifyAppUpdate(dataSanit).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("search", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeObject(data))
            fetchApps(dataSanit, socket).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("commentVer", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeObject(data))
            verifyCommentSocket(dataSanit).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("commentLoad", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeObject(data))
            fetchComments(dataSanit).then((dataReturn)=>{callback(dataReturn)})

        })

        socket.on("isAppSaved", async (data, callback)=>{
            dataSanit = JSON.parse(sanitizeObject(data))
            isAppSaved(dataSanit, socket).then((dataReturn)=>{callback(dataReturn)})

        })
 
        socket.on("disconnect", () =>{
                
                
        })

    })

}

module.exports = {loadSockets}
