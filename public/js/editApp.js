var block = 0
var appData = {}


//Some tweaks
function refreshBnt(){
    if(document.getElementById("public").checked){
        $("#auth").prop("disabled",false);
    }else{
        $("#auth").prop("disabled",true);
        $("#auth").prop("checked",true);
    }
}

$("#submit").prop("disabled",true);
$("#public").on("change", ()=>{refreshBnt()})
refreshBnt()


//SOCKET
$("#appcreateform").on("change keyup paste", function(){

    $("#submit").prop("disabled",true);

    var title = document.getElementById("title").value
    var description = document.getElementById("description").value
    var url = document.getElementById("url").value
    var public = document.getElementById("public").checked
    
    var local = document.getElementById("local")
    var auth = document.getElementById("auth")
    var adminlevel = document.getElementById("adminlevel")

    var local = (local == null) ? false : local.checked;
    var auth = (auth == null) ? false : auth.checked;
    var adminlevel = (adminlevel == null) ? 0 : adminlevel.value;

    appData = {title, description, url, public, local, auth, adminlevel}

    if(block==0){
        block = 1

        socket.emit("appUp", appData, (data)=>{

            if(data){
                $("#submit").prop("disabled",true);
                block = 0
                return $("#status").text(data);
            }

            $("#status").text("Ready to update");
            $("#submit").prop("disabled", false);
            $("#submit").attr("onclick","editApp()");
            block = 0

        })   
    }

})

//AJAX
var winLocal = window.location.pathname.split("/");
function editApp(){ 
    $("#submit").prop("disabled", true);

    $.ajax({
    url: '/edit/' + winLocal[2],
    type: 'POST',
    data: JSON.stringify(appData),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: false,
    success: function () {
        $("#status").text("Success!");
    }
});

}