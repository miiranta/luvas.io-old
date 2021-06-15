//Requires
const chalk              = require("chalk")
const jwt                = require("jsonwebtoken")
const verifyAppCreate    = require("./utils/verifyAppCreate")
const verifyNick         = require("./utils/verifyNick")

//IO - all users
//Socket - specific user

//Verify JWT
function verifyToken(token){
    try{return jwt.verify(token, process.env.JWT_SECRET)}
    catch{return false}
}


const socketLoad = function(io){


//GET When connection starts
io.on("connection", (socket)=>{

    //Welcome message
    sendMessage("Websocket connected!")


//SEND--------------------------------   

    //SEND error
    function sendError(data){
    socket.emit("error", data)
    }

    //SEND callback message
    function sendMessage(data){
    socket.emit("message", data)
    }

//------------------------------------   

//GET---------------------------------  

    //GET Auth
    socket.on("auth", (token)=>{

        //get token
        var userId = verifyToken(token)

        //if valid
        if(userId){
            return sendMessage("Authenticated.")
        }

        //if not valid
        sendError("No authentication found.")

    })

    //GET nickCheck
    socket.on("nick", async (nick, callback)=>{

        verifyNick(nick).then((data)=>{callback(data)})

    })

    //GET createAppCheck
    socket.on("app", (data, callback)=>{

        verifyAppCreate(data).then((dataReturn)=>{callback(dataReturn)})

    })


//------------------------------------   


    

//When connection ends
socket.on("disconnect", () =>{
        
  

        
})
})

}

module.exports = socketLoad
