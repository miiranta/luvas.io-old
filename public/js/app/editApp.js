var appUpData = {}
var appUpDescriptionString = {}

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

var quill = new Quill('#appUpDescription', {
    theme: 'snow',
    placeholder: 'Add a description...',
    modules: {
        toolbar: toolbarOptions
    }
});

quill.setContents(JSON.parse($('#appUpDescriptionRaw').html()));
$('#appUpDescriptionRaw').empty();

var change = new Delta();
quill.on('text-change', function(delta) {
    change = change.compose(delta);
    change = new Delta();
    
    appUpDescriptionString = quill.getContents();

    setTimeout(()=>{appUpUpdateSocket()}, 100)
})


//Some tweaks
function appUpUpdateButtons(){
    if($("#appUpPublic").is(':checked')){
        $("#appUpAuth").prop("disabled",false);
    }else{
        $("#appUpAuth").prop("disabled",true);
        $("#appUpAuth").prop("checked",true);
    }
}

$("#appUpSubmit").prop("disabled",true);
$("#appUpPublic").on("change", ()=>{ appUpUpdateButtons() })
appUpUpdateButtons()


//SOCKET
$("#appUppublic").on("change", ()=>{ appUpUpdateButtons() })
$("#appUpForm").on("change keyup paste", function(){
    $("#appUpSubmit").prop("disabled",true);
    appUpUpdateSocket()
})

function appUpUpdateSocket(){

    //Updating variables
    var title =         $("#appUpTitle").val()
    var url =           $("#appUpUrl").val()
    var public =        $("#appUpPublic").is(':checked')
    var local =         $("#appUpLocal").is(':checked')
    var auth =          $("#appUpAuth").is(':checked')
    var adminlevel =    $("#appUpAdminlevel").val()

    //Checking valid
    local =         (local == undefined)         ? false : $("#appUpLocal").is(':checked');
    auth =          (auth == undefined)          ? false : $("#appUpAuth").is(':checked');
    adminlevel =    (adminlevel == undefined)    ? 0     : $("#appUpAdminlevel").val();

    appUpData       = {title, description: appUpDescriptionString, url, public, local, auth, adminlevel}
    appUpDataSocket = {title, description: {size: JSON.stringify(appUpDescriptionString).length}, url, public, local, auth, adminlevel}

    if(block==0){
        block = 1

        conSocket("appUp", appUpDataSocket, (data)=>{

            if(data){
                $("#appUpSubmit").prop("disabled",true);
                block = 0
                return $("#appUpStatus").text(data);
            }

            $("#appUpStatus").text("Ready to update");
            $("#appUpSubmit").prop("disabled", false);
            $("#appUpSubmit").attr("onclick","editApp()");
            block = 0

        })   
    }

}

//AJAX
function editApp(){ 
    $("#appUpSubmit").prop("disabled", true);

    conRest('/edit/' + winLocal[2], 'POST', appUpData, ()=>{
        $("#appUpStatus").text("Success!");
    })
}
