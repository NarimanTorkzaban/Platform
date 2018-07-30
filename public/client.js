var socket = io.connect('http://localhost:4000');
var file = document.getElementById('image');
var text = document.getElementById('pullback');
var btn = document.getElementById('send');
var output = document.getElementById('output');

//The following will listen if the connected client wants to submit an image
//If it is the case then sends it to the server as an arrayBuffer
file.addEventListener('change', function () {

    if (!file.files.length) {
        return;
    }
    var firstFile = file.files[0],
        reader = new FileReader();
    reader.onloadend = function () {

       socket.emit("image", {
          name: firstFile.name,
          data: reader.result
       });

    };
    reader.readAsArrayBuffer(firstFile);
});

//The following will listen if the connected client wants to pull an image
btn.addEventListener('click', function(){

    socket.emit('message', {
        data: text.value
    });
    console.log('Text sent. The image will be with you soon.');
});


//This is just for visualization, we can remove this
function encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

//This function will receive the image the client has sent a request for
socket.on('pulledImage', function(image){
    console.log(image.data);
    console.log('Picture received');

    //This is just for visualization, we can remove the following 5 lines
    var bytes = new Uint8Array(image.data);
    var img = document.createElement('img');
     img.setAttribute('src', 'data:image/png;base64,'+encode(bytes));
     img.setAttribute('height', '100px');
     document.body.appendChild(img);

});

socket.on('retry', function(message){
    console.log(message.data);

});
