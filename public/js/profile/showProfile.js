var bioDelta = JSON.parse($('#bioRaw').html());
var bioHtml = deltaToHTML(bioDelta);

$('#bio').html(bioHtml);
$('#bioRaw').empty();