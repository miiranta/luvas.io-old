//Requires
const chalk = require("chalk")

//IO - all users
//Socket - specific user

const socketLoad = function(io){

//GET When connection starts
io.on("connection", (socket)=>{

    


//------------------------------------   

    //GET jwt
    socket.on("jwt", (data)=>{
    
    })//End of GET jwt

    sendMessage("Websocket connected!")
    const ip = socket
    console.log(chalk.blue("New Websocket connected!"))


    //GET send
    socket.on("send", (data)=>{})



//------------------------------------   

    //SEND error
    function sendError(data){
    socket.emit("error", data)
    }

    //SEND callback message
    function sendMessage(data){
    socket.emit("message", data)
    }

//------------------------------------   




//------------------------------------   


    

//When connection ends
socket.on("disconnect", () =>{
        
  



        
})
})

}

module.exports = socketLoad
