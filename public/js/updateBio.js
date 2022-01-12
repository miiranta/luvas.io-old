    var block = 0
    $("#biobutton").prop("disabled", true);


    //SOCKET
    $("#biochangeform").on("change keyup paste", function(){
        $("#biobutton").prop("disabled", true);
        var bio = document.getElementById("bio").value

        if(block==0){
        block = 1
        socket.emit("bio", bio, (data)=>{

            if(data){
            $("#biobutton").prop("disabled",true);
            block = 0
            return $("#biostatus").text(data);
            }

            $("#biobutton").prop("disabled",false);
            $("#biobutton").attr("onclick","changeBio()");
            $("#biostatus").text("Ready to update.");
            block = 0

        })   
        }

    })

    //AJAX
    function changeBio(){ 

    $("#biobutton").prop("disabled", true);

    $.ajax({
    data: JSON.stringify({'bio' : bio.value}),
    contentType: 'application/json',
    method: 'PATCH',
    url: '/account/bio',
    success: function () {
        $("#biostatus").text("Success!");
    }
    }
    )}