//UPDATE PROFILE PICTURE   

    //Vars and Functions -------------------------

        //Vars
        var $uploadCrop;
        $("#picpreview").hide();
        var data = new FormData();
        var file;

        //Get expension
        function getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
        }

        //Get if file is image
        function isImage(filename) {
        var ext = getExtension(filename);
            switch (ext.toLowerCase()) {
                case 'jpg':
                case 'gif':
                case 'jpeg':
                case 'png':
                return true;
            }
            return false;
        }

    //-----------------------------------------------

    //Croppie and Read Data -------------------------

        //Set croppie properties
            $uploadCrop = $('#picshow').croppie({
            viewport: {
                width: 250,
                height: 250,
                type: 'square'
            },
            boundary: {
                width: 300,
                height: 300
            },
            //Update image blob
            update: function(res){
                $uploadCrop.croppie('result', {
                    type: 'blob',
                    format: 'png'
                }).then(function (res) {
                    file = res;
                });
            },
            enableExif: true,
            enableOrientation: true
            });

        //Read whats being uploaded
        function readFile(input) {
            if (input.files && input.files[0]) {

                //Is image?
                console.log(input.files[0])
                if(!isImage(input.files[0].name)){
                    $("#picerror").text("File must be an image");
                    $("#picpreview").hide();
                    $("#picselect").val(null);
                    return
                }
            
                //Bind croppie
                var reader = new FileReader();
                reader.onload = function (e) { $uploadCrop.croppie('bind', {url: e.target.result});}
                reader.readAsDataURL(input.files[0]);

                //Show div if upload is ok
                $("#picpreview").show();
                $("#Submit").prop("disabled",false);
                $("#picerror").text("")
            }
        }

        //Read if input changes
        $('#picselect').on('change', function () {
        readFile(this);
        });

    //------------------------------------------------

    //Buttons ----------------------------------------

        //Rotate-Left
        $('#Rotate-Left').on('click', function() {
            $uploadCrop.croppie('rotate', 90);
        });

        //Rotate Right
        $('#Rotate-Right').on('click', function() {
            $uploadCrop.croppie('rotate', -90);
        });

        //Hide on cancel
        $("#Cancel").click(function () {
            $("#picpreview").hide();
            $("#picselect").val(null);
        })

    //-------------------------------------------------
        
    //Send Data ---------------------------------------

        //AJAX
        $('#picupload').submit(function (event) {

        event.preventDefault();
        data.append('file', file, "upload.png");
        $("#Submit").prop("disabled",true);
        $("#picpreview").hide();
        
            $.ajax({
            type: "PATCH",
            url: "/account/picture",
            data,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function () {
                $("#picselect").val(null);
                $("#Submit").prop("disabled",false);
                location.reload();
            },
            error: function (event) {
                event.responseText = JSON.parse(event.responseText);
                    if(event.responseText.message !== undefined){
                    $("#picerror").text(event.responseText.message);
                    }
            }

            });
        });

    //------------------------------------------------
