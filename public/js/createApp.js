    var block = 0
    
    //Some tweaks
    $("#local").on("change", function(){
        if(document.getElementById("local").checked){
            $("#url").hide();
        }else{
            $("#url").show();
        }
    })

    $("#auth").prop("disabled",true);
    $("#auth").prop("checked",true);
    $("#public").on("change", function(){
        if(document.getElementById("public").checked){
            $("#auth").prop("disabled",false);
        }else{
            
            $("#auth").prop("disabled",true);
            $("#auth").prop("checked",true);
        }
    })
    

    //SOCKET
    $("#appcreateform").on("change keyup paste", function(){

        $("#submit").prop("disabled",true);

        var title = document.getElementById("title").value
        var description = document.getElementById("description").value
        var name = document.getElementById("name").value
        var url = document.getElementById("url").value
        var public = document.getElementById("public").checked
        
        var local = document.getElementById("local")
        var auth = document.getElementById("auth")
        var adminlevel = document.getElementById("adminlevel")

        var local = (local == null) ? false : local.checked;
        var auth = (auth == null) ? false : auth.checked;
        var adminlevel = (adminlevel == null) ? 0 : adminlevel.value;

        var appData = {title, description, name, url, public, local, auth, adminlevel}

        if(block==0){
            block = 1

            socket.emit("app", appData, (data)=>{

                if(data){

                    $("#submit").prop("disabled",true);
                    block = 0
                    return $("#status").text(data);
                }

                $("#status").text("Ready to create");
                $("#submit").prop("disabled",false);
                $("#submit").attr("onclick","createApp('"+JSON.stringify({appData})+"')");
                block = 0

            })   
        }

    })

    //AJAX
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



