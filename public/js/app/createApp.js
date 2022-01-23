    //Global vars
    var appCrData = {}
    var appCrDescriptionSize = 0;
    var appCrDescriptionString = "";
    
   //QUILL
    var quillToolbarOptions = [
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
    
    var quill = new Quill('#appCrDescription', {
        theme: 'snow',
        placeholder: 'Create a description...',
        modules: {
            toolbar: quillToolbarOptions
        }
    });

    var Delta = Quill.import('delta');
    var change = new Delta();
    quill.on('text-change', function(delta) {
        change = change.compose(delta);
        change = new Delta();

        appCrDescriptionString = quill.getContents();
        appCrDescriptionSize = appCrDescriptionString.length;

        setTimeout(()=>{appCrUpdateSocket()}, 100)
    })

    //Some tweaks
    $("#appCrAuth").prop("disabled", true);
    $("#appCrAuth").prop("checked", true);
    $("#appCrPublic").on("change", function(){
        if($("#appCrPublic").is(':checked')){
            $("#appCrAuth").prop("disabled",false);
        }else{
            $("#appCrAuth").prop("disabled",true);
            $("#appCrAuth").prop("checked",true);
        }
    })
    
    //SOCKET
    $("#appCrForm").on("change keyup paste", function(){
        $("#appCrSubmit").prop("disabled", true);
        appCrUpdateSocket()
    })

    function appCrUpdateSocket(){
        $("#appCrSubmit").prop("disabled", true);

        //Updating variables
        var title =         $("#appCrTitle").val()
        var descName =      $("#appCrName").val()
        var url =           $("#appCrUrl").val()
        var public =        $("#appCrPublic").is(':checked')
        var local =         $("#appCrLocal").is(':checked')
        var auth =          $("#appCrAuth").is(':checked')
        var adminlevel =    $("#appCrAdminlevel").val()

        //Checking valid
        local =         (local == undefined)         ? false : $("#appCrLocal").is(':checked');
        auth =          (auth == undefined)          ? false : $("#appCrAuth").is(':checked');
        adminlevel =    (adminlevel == undefined)    ? 0     : $("#appCrAdminlevel").val();

        //Setting for sockets
        descriptionSizeObject = {size: appCrDescriptionSize}
        appDataSocket =         {title, description: descriptionSizeObject, name: descName, url, public, local, auth, adminlevel}

        //Setting for REST
        descriptionReady =  {content: appCrDescriptionString}
        appCrData =           {title, description: descriptionReady, name: descName, url, public, local, auth, adminlevel}

        if(block==0){
            block = 1

            conSocket("appCr", appDataSocket, (data)=>{

                if(data){
                    $("#appCrSubmit").prop("disabled",true);
                    block = 0
                    return $("#appCrStatus").text(data);
                }

                $("#appCrStatus").text("Ready to create");
                $("#appCrSubmit").prop("disabled", false);
                $("#appCrSubmit").attr("onclick","createApp()");
                block = 0
            })   
        }

    }
  
    //AJAX
    function createApp(){ 
        $("#appCrSubmit").prop("disabled",true);

        conRest('/app', 'POST', appCrData, ()=>{
            $("#appCrStatus").text("Success!");
        })

    }



