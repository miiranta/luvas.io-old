var comContent = ""
var comSize = 0
$("#comPostComment").prop("disabled", true);

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

    ['link']
                       
  ];

var quill = new Quill('#comEditor', {
    theme: 'snow',
    placeholder: 'Make a comment...',
    modules: {
        toolbar: toolbarOptions
    }
});

var change = new Delta();
quill.on('text-change', function(delta) {
    change = change.compose(delta);
    change = new Delta();
    
    comContent = quill.getContents();
    comSize = comContent.length;

    //SOCKET verify comment
    var comment = {size: comSize};
    $("#comPostComment").prop("disabled", true);

    if(block==0){
        block = 1

        conSocket("commentVer", comment, (data)=>{
            
            if(data){
                block = 0
                $("#comPostComment").prop("disabled", true);
                return $("#comStatusComment").text(data);
            }

            $("#comPostComment").prop("disabled", false);
            $("#comPostComment").attr("onclick","postComment()");
            $("#comStatusComment").text("Ready to post.");
            block = 0

        }) 
    }
});

//AJAX
function postComment(){ 
    comPage = 0;
    $("#comPage").text(comPage+1);
    getComments();
    comUpdateButtons();

    $("#comPostComment").prop("disabled", true);

    conRest('/post/comment/' + winLocal[2], 'POST', comContent, function(){
        $("#comStatusComment").text("Success!");
    })
    
}


