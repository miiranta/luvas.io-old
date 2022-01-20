var block = 0
var commentContent = ""
var commentSize = 0
$("#postComment").prop("disabled", true);

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

var quill = new Quill('#editor', {
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
    
    commentContent = JSON.stringify(quill.getContents());
    commentSize = commentContent.length;

    //SOCKET verify comment
    var comment = {size: commentSize};
    $("#postComment").prop("disabled", true);

    if(block==0){
        block = 1

        socket.emit("commentVer", JSON.stringify(comment), (data)=>{
            
            if(data){
                block = 0
                $("#postComment").prop("disabled", true);
                return $("#statusComment").text(data);
            }

            $("#postComment").prop("disabled", false);
            $("#postComment").attr("onclick","postComment()");
            $("#statusComment").text("Ready to post.");
            block = 0

        }) 
    }
});

//AJAX
var winLocal = window.location.pathname.split("/");
function postComment(){ 
    $("#postComment").prop("disabled", true);

    $.ajax({
        data: commentContent,
        contentType: 'application/json',
        method: 'POST',
        url: '/post/comment/' + winLocal[2],
        success: function () {
            $("#statusComment").text("Success!");
        }
    })
}


