const sanitizer         = require('sanitizer');
const createDOMPurify   = require('dompurify');
const { JSDOM }         = require('jsdom');

const window            = new JSDOM('').window;
const domp              = createDOMPurify(window);

function sanitizeInput(input1){
    var input2 = sanitizer.sanitize(input1);
    var output = domp.sanitize(input2);
    return output;
}

function sanitizeObject(input1){
    for (key of Object.keys(input1)) {
        input1[key] = sanitizeInput(input1[key]);
    }
    return input1;
}

module.exports = {sanitizeInput, sanitizeObject}