//QUILL
var Delta = Quill.import('delta');

var quill = new Quill('#bio', {
    readOnly: true,
    theme: 'snow',
    placeholder: 'There is no bio.',
    modules: {
        toolbar: false
    }
});

quill.setContents(JSON.parse($('#bioRaw').html()));
$('#bioRaw').empty();