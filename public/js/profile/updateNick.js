    $("#nickButton").prop("disabled",true);

    //SOCKET
    $("#nickChangeForm").on("change keyup paste", function(){
        $("#nickButton").prop("disabled",true);
        var inputNick = document.getElementById("nick")
        var nick = inputNick.value

        if(block==0){
        block = 1

        conSocket("nick", nick, (data)=>{

            if(data){
            $("#nickButton").prop("disabled",true);
            block = 0
            return $("#nickStatus").text(data);
            }

            $("#nickButton").prop("disabled",false);
            $("#nickButton").attr("onclick","changeNick('"+nick+"')");
            $("#nickStatus").text("Nick available");
            block = 0

        })   
        }

    })

    //AJAX
    function changeNick(nick){ 
        $("#nickButton").prop("disabled",true);
        $('#nick').val(nick);

        conRest('/account/nick', 'PATCH', {nick}, ()=>{
            $("#nickStatus").text("Success!");
            $("#updateredirect").attr("href", "/user/" + nick);
        })
    }

