//LOAD SOCKETS

    //Start
    const socket = io()

    //Websockets GET------------------------
    socket.on("error",(data)=>{
        console.log("Error: " + data)
    })

    socket.on("message",(data)=>{
        console.log(data)
    })
    //--------------------------------------

    //Websockets SEND------------------------



    //--------------------------------------



