var block = 0
var page = 0

//SOCKET
function loadPage(){
    var search = document.getElementById("search").value
    var sort = document.getElementById("sort").value
    var local = document.getElementById("local").checked
    var createdbyme = document.getElementById("createdbyme").checked

    var searchData = {search, local, createdbyme, sort, page}

    if(block==0){
        block = 1

        socket.emit("search", searchData, (data)=>{

            $('#showzone').text(JSON.stringify(data));

            block = 0
        })
    
    }

}
$("#searchzone").on("change keyup", () => {
    page = 0;
    $("#page").text(page+1)
    loadPage()
}) 
    

//PAGE MANAGEMENT
$("#previous").on("click", function(){
    if(page-1 >= 0 && block == 0){
        page = page - 1;
        $("#page").text(page+1)
        loadPage()
    }
})

$("#next").on("click", function(){
    if(block == 0){
        page = page + 1;
        $("#page").text(page+1)
        loadPage()  
    }
})

//Initial
loadPage()