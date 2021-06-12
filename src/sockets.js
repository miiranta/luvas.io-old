//Requires
const chalk       = require("chalk")
const jwt         = require("jsonwebtoken")
const User        = require("./db/models/users")

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

        //Contain special character?
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(format.test(nick)){return callback("Nicks can't contain special characters!")}

        //Contain spaces?
        if(/\s/g.test(nick)){return callback("Nicks can't have spaces!")}

        //Too big / too small
        if(nick.length>15||nick.length<5){return callback("Nicks need to have between 5 to 15 characters!")}

        //Search Db for nick taken
        const user = await User.findOne({nick})
        if(user){return callback("Nick already taken!")}

        //Everything is fine
        callback(false);

    })


//------------------------------------   


    

//When connection ends
socket.on("disconnect", () =>{
        
  



        
})
})

}

module.exports = socketLoad
