//CREATE APP

    //Start state    
    var block = 0

    //SOCKET
    //Execute every time input updates
    $("#appcreateform").on("change keyup paste", function(){

        $("#submit").prop("disabled",true);

        //Set elements
        var title = document.getElementById("title").value
        var description = document.getElementById("description").value
        var name = document.getElementById("name").value
        var url = document.getElementById("url").value
        var public = document.getElementById("public").checked
        var local = document.getElementById("local").checked
        var auth = document.getElementById("auth").checked
        
        //Create object
        var appData = {title, description, name, url, public, local, auth}


        //Send
        if(block==0){
            block = 1

            socket.emit("app", appData, (data)=>{

                //Something is wrong > Show error
                if(data){

                    $("#submit").prop("disabled",true);
                    block = 0
                    return $("#status").text(data);
                }

                //Everything is right
                $("#status").text("Ready to create");
                $("#submit").prop("disabled",false);
                $("#submit").attr("onclick","createApp('"+JSON.stringify({appData})+"')");
                block = 0

            })   
        }

    })

    //AJAX
    //Change nick
    function createApp(appData){ 

    $("#submit").prop("disabled",true);

    $.ajax({
    data: appData,
    contentType: 'application/json',
    method: 'POST',
    url: '/app',
    success: function () {
        $("#status").text("Success!");
    }
    }
    )}



