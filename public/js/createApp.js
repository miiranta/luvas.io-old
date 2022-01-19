    var block = 0
    
    //QUILL
    var Delta = Quill.import('delta');
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'header': [1, 2, 3, 4, 5, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                        // remove formatting button

        ['link', 'image', 'video']                   
    ];
    
    var quill = new Quill('#description', {
        theme: 'snow',
        placeholder: 'Create a description...',
        modules: {
            toolbar: toolbarOptions
        }
    });

    var change = new Delta();
    quill.on('text-change', function(delta) {
        change = change.compose(delta);
        change = new Delta();
        
        descriptionString = JSON.stringify(quill.getContents());
        descriptionSize = descriptionString.length;

        setTimeout(()=>{updateSocket()}, 100)
    })

    //Some tweaks
    $("#auth").prop("disabled", true);
    $("#auth").prop("checked", true);
    $("#public").on("change", function(){
        if(document.getElementById("public").checked){
            $("#auth").prop("disabled",false);
        }else{
            $("#auth").prop("disabled",true);
            $("#auth").prop("checked",true);
        }
    })
    
    //SOCKET
    var title = document.getElementById("title").value
    var descName = document.getElementById("name").value
    var url = document.getElementById("url").value
    var public = document.getElementById("public").checked
        
    var local = document.getElementById("local")
    var auth = document.getElementById("auth")
    var adminlevel = document.getElementById("adminlevel")

    var appData = {}

    var descriptionSize = 0;
    var descriptionString = "";

    $("#appcreateform").on("change keyup paste", function(){
        $("#submit").prop("disabled", true);
        updateSocket()
    })

    function updateSocket(){
        $("#submit").prop("disabled", true);

        title = document.getElementById("title").value
        descName = document.getElementById("name").value
        url = document.getElementById("url").value
        public = document.getElementById("public").checked
        
        local = document.getElementById("local")
        auth = document.getElementById("auth")
        adminlevel = document.getElementById("adminlevel")

        local = (local == null) ? false : local.checked;
        auth = (auth == null) ? false : auth.checked;
        adminlevel = (adminlevel == null) ? 0 : adminlevel.value;

        descriptionSizeJson = JSON.stringify({size: descriptionSize});
        appDataSocket = {title, description: descriptionSizeJson, name: descName, url, public, local, auth, adminlevel}

        descriptionReady = JSON.stringify({content: descriptionString})
        appData = {title, description: descriptionReady, name: descName, url, public, local, auth, adminlevel}

        if(block==0){
            block = 1

            socket.emit("appCr", appDataSocket, (data)=>{

                if(data){
                    $("#submit").prop("disabled",true);
                    block = 0
                    return $("#status").text(data);
                }

                $("#status").text("Ready to create");
                $("#submit").prop("disabled", false);
                $("#submit").attr("onclick","createApp()");
                block = 0
            })   
        }

    }
  

    //AJAX
    function createApp(){ 
        $("#submit").prop("disabled",true);

        $.ajax({
        url: '/app',
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



