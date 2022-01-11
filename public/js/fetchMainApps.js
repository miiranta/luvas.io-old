var page = 0

//SOCKET
function loadPage(){
    var search = "";
    var sort = 0;
    var local = false;
    var createdbyme = false;

    var searchData = {search, local, createdbyme, sort, page}

    socket.emit("search", searchData, (data)=>{
        $('#showzone').text(JSON.stringify(data));
    })
    
}

loadPage()