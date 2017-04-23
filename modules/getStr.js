var CalcHash = require('./calcHash');
var request = require('request');


var GetWriteStr = function (hash, name) {
    name = name.substring(0, name.length - 4);
    console.log(name);
    var options = {
        url: "http://api.thesubdb.com/?action=download&language=pt&hash=" + hash,
        headers: {
            'User-Agent': "SubDB/1.0 (Pyrrot/0.1; http://github.com/jrhames/pyrrot-cli)"
        }
    }

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFileSync(name + ".str");

        } else {
            console.log(response.statusCode + response.body);
        }
    })

}

module.export = GetWriteStr;
