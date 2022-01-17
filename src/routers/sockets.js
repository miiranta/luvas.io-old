const verifyAppCreate                       = require("../utils/verifyAppCreate")
const verifyAppUpdate                       = require("../utils/verifyAppUpdate")
const verifyNick                            = require("../utils/verifyNick")
const {verifyBioSocket}                     = require("../utils/verifyBio")
const fetchApps                             = require("../utils/getApps.js")
const {sanitizeInput, sanitizeObject}       = require("../utils/sanitizeInput.js")

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

    
    socket.on("disconnect", () =>{
            
            
    })

})

}

module.exports = loadSockets
