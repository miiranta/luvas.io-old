const chalk              = require("chalk")
const jwt                = require("jsonwebtoken")
const verifyAppCreate    = require("./utils/verifyAppCreate")
const verifyNick         = require("./utils/verifyNick")
const getApps            = require("./utils/getApps")

function verifyToken(token){
    try{return jwt.verify(token, process.env.JWT_SECRET)}
    catch{return false}
}

const socketLoad = function(io){

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

        verifyNick(nick).then((data)=>{callback(data)})

    })

    socket.on("app", (data, callback)=>{

        verifyAppCreate(data).then((dataReturn)=>{callback(dataReturn)})

    })


socket.on("disconnect", () =>{
        
        
})
})

}

module.exports = socketLoad
