    var block = 0
    $("#nickbutton").prop("disabled",true);


    //SOCKET
    $("#nickchangeform").on("change keyup paste", function(){
        $("#nickbutton").prop("disabled",true);
        var inputNick = document.getElementById("nick")
        var nick = inputNick.value

        if(block==0){
        block = 1
        socket.emit("nick", nick, (data)=>{

            if(data){
            $("#nickbutton").prop("disabled",true);
            block = 0
            return $("#nickstatus").text(data);
            }

            $("#nickbutton").prop("disabled",false);
            $("#nickbutton").attr("onclick","changeNick('"+nick+"')");
            $("#nickstatus").text("Nick available");
            block = 0

        })   
        }

    })

    //AJAX
    function changeNick(nick){ 

    $("#nickbutton").prop("disabled",true);
    $('#nick').val(nick);

    $.ajax({
    data: JSON.stringify({nick}),
    contentType: 'application/json',
    method: 'PATCH',
    url: '/account/nick',
    success: function () {
        $("#nickstatus").text("Success!");
    }
    }
    )}

