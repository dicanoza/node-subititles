var request = require('request');
var fs = require('fs');
var hasha = require('hasha');

var readsize = 64 * 1024;


var file = fs.readFileSync('d:/torrent/Attack.on.Titan.1-25 [1080p.BRrip.x264.Dual-Audio][xRed]/[xRed].Attack.on.Titan.01.To.You,.in.2000.Year [1080p.BRrip.x264.Dual-Audio].mpg');
var bytes2 = file.slice(file.byteLength -(readsize),file.byteLength);
var bytes = file.slice(0, readsize);
var bytes3 = Buffer.concat([bytes, bytes2]);


var hash = hasha(bytes3, { algorithm: 'md5' });
console.log(hash);
console.log(hash === 'ffd8d4aa68033dc03d1c8ef373b9028c');
var options = {
    url: "http://api.thesubdb.com/?action=download&language=pt&hash=" + hash,
    headers: {
        'User-Agent': "SubDB/1.0 (Pyrrot/0.1; http://github.com/jrhames/pyrrot-cli)"
    }
}

request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        fs.writeFileSync("d:/torrent/Attack.on.Titan.1-25 [1080p.BRrip.x264.Dual-Audio][xRed]/[xRed].Attack.on.Titan.01.To.You,.in.2000.Year [1080p.BRrip.x264.Dual-Audio].str");
        
    } else {
        //console.log(error);
        console.log(response.statusCode + response.body);
        //console.log(body);
    }
})
