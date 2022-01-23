    var bioSize = 0;
    var bioString = "";
    $("#bioButton").prop("disabled", true);

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

    var quill = new Quill('#bio', {
        theme: 'snow',
        placeholder: 'Create a bio...',
        modules: {
            toolbar: toolbarOptions
        }
    });

    quill.setContents(JSON.parse($('#bioRaw').html()));
    $('#bioRaw').empty();
    
    var change = new Delta();
    quill.on('text-change', function(delta) {
        change = change.compose(delta);
        change = new Delta();
        
        bioString = quill.getContents();
        bioSize = bioString.length;

        //SOCKET
        $("#bioButton").prop("disabled", true);
        
        var bio = {size: bioSize};

        if(block==0){
        block = 1
        conSocket("bio", bio, (data)=>{

            if(data){
            $("#bioButton").prop("disabled",true);
            block = 0
            return $("#bioStatus").text(data);
            }

            $("#bioButton").prop("disabled",false);
            $("#bioButton").attr("onclick","changeBio()");
            $("#bioStatus").text("Ready to update.");
            block = 0

        })   
        }

    });
    
    //AJAX
    function changeBio(){ 
        $("#bioButton").prop("disabled", true);

        conRest('/account/bio', 'PATCH', bioString, ()=>{
            $("#bioStatus").text("Success!");
        })
    }