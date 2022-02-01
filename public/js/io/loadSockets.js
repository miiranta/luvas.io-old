const socket = io()

//Global recievers
socket.on("error",(data)=>{
    console.log("Error: " + data)
})

socket.on("message",(data)=>{
    console.log(data)
})

socket.on("messagePopUp",(data)=>{
    openWarning(data)
})


//Emit function
function conSocket(channel, dataToSend, callback){
    var dataToSendFiltered = JSON.stringify(dataToSend)

    socket.emit(channel, dataToSendFiltered, (dataToRecieve)=>{
        callback(dataToRecieve)
    })
}





