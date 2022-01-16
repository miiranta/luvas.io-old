const verifyAppCreate    = require("./utils/verifyAppCreate")
const verifyNick         = require("./utils/verifyNick")
const verifyBio          = require("./utils/verifyBio")
const fetchApps          = require("./utils/getApps.js")

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

        verifyNick(nick).then((dataReturn)=>{callback(dataReturn)})

    })

    socket.on("bio", (data, callback)=>{
    
        verifyBio(data, socket).then((dataReturn)=>{callback(dataReturn)})

    })

    socket.on("app", (data, callback)=>{

        verifyAppCreate(data).then((dataReturn)=>{callback(dataReturn)})

    })

    socket.on("search", (data, callback)=>{
    
        fetchApps(data, socket).then((dataReturn)=>{callback(dataReturn)})

    })

    
    socket.on("disconnect", () =>{
            
            
    })

})

}

module.exports = loadSockets
