var appInfDelta = JSON.parse($('#appInfoDescRaw').text())

$("#appInfoDesc").append(deltaToHTML(appInfDelta))
$("#appInfoDescRaw").empty()