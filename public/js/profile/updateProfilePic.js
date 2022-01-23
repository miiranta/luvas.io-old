        var $uploadCrop;
        $("#picPreview").hide();
        var picData = new FormData();
        var picFile;

        function getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
        }

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

    //Croppie and Read Data -------------------------

            $uploadCrop = $('#picShow').croppie({
            viewport: {
                width: 250,
                height: 250,
                type: 'square'
            },
            boundary: {
                width: 300,
                height: 300
            },
            update: function(res){
                $uploadCrop.croppie('result', {
                    type: 'blob',
                    format: 'png'
                }).then(function (res) {
                    picFile = res;
                });
            },
            enableExif: true,
            enableOrientation: true
            });

        function readFile(input) {
            if (input.files && input.files[0]) {

                if(!isImage(input.files[0].name)){
                    $("#picError").text("File must be an image");
                    $("#picPreview").hide();
                    $("#picSelect").val(null);
                    return
                }
            
                var reader = new FileReader();
                reader.onload = function (e) { $uploadCrop.croppie('bind', {url: e.target.result});}
                reader.readAsDataURL(input.files[0]);

                $("#picPreview").show();
                $("#picSubmit").prop("disabled",false);
                $("#picError").text("")
            }
        }

        $('#picSelect').on('change', function () {
        readFile(this);
        });

    //Buttons ----------------------------------------

        $('#picRotateLeft').on('click', function() {
            $uploadCrop.croppie('rotate', 90);
        });

        $('#picRotateRight').on('click', function() {
            $uploadCrop.croppie('rotate', -90);
        });

        $("#picCancel").click(function () {
            $("#picPreview").hide();
            $("#picSelect").val(null);
        })
        
    //Send Data ---------------------------------------

        $('#picUpload').submit(function (event) {

        event.preventDefault();
        picData.append('file', picFile, "upload.png");
        $("#picSubmit").prop("disabled",true);
        $("#picPreview").hide();
        
            //Keep it like that, it's form data, not json!
            $.ajax({
            type: "PATCH",
            url: "/account/picture",
            data: picData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function () {
                $("#picSelect").val(null);
                $("#picSubmit").prop("disabled",false);
                location.reload();
            },
            error: function (event) {
                event.responseText = JSON.parse(event.responseText);
                    if(event.responseText.message !== undefined){
                    $("#picError").text(event.responseText.message);
                    }
            }

            });
        });

    //------------------------------------------------
