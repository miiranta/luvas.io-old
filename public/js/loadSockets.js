    const socket = io()

    socket.on("error",(data)=>{
        console.log("Error: " + data)
    })

    socket.on("message",(data)=>{
        console.log(data)
    })
   



