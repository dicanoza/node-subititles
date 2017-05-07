let fs = require('fs');
let request = require('request');
let path = require('path');
let hasha = require('hasha');


var extentions = [".avi", ".mkv", ".mp4", ".m4v", ".mov", ".mpg", ".wmv"];

module.exports = {

    calcHash: function (filepath, callback) {
        fs.open(filepath, 'r', function (err, fd) {
            if (err) {
                console.log(err)
                return;
            }
            fs.fstat(fd, function (err, stats) {
                if (err) {
                    console.log(err)
                    return;
                }
                let bufferSize = 64 * 1024,
                    chunkSize = 1024,
                    bytes = new Buffer(bufferSize),
                    bytes2 = new Buffer(bufferSize),
                    bytesRead = 0,
                    offset = stats.size - bufferSize;

                while (bytesRead < bufferSize) {
                    if ((bytesRead + chunkSize) > bufferSize) {
                        chunkSize = (bufferSize - bytesRead);
                    }
                    fs.readSync(fd, bytes, bytesRead, chunkSize, bytesRead);
                    fs.readSync(fd, bytes2, bytesRead, chunkSize, offset);
                    bytesRead += chunkSize;
                    offset += chunkSize;
                }

                let bytes3 = Buffer.concat([bytes, bytes2]);
                let hash = hasha(bytes3, { algorithm: 'md5' });

                fs.closeSync(fd);
                callback(hash, filepath);

            });
        });
    },
    getWriteSrt: function (hash, name) {
        let options = {
            url: "http://api.thesubdb.com/?action=download&language=pt&hash=" + hash,
            headers: {
                'User-Agent': "SubDB/1.0 (Pyrrot/0.1; http://github.com/jrhames/pyrrot-cli)"
            },
            encoding: 'latin1'
        }

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                name = name.substring(0, name.length - 4);
                //just logging the subttitles found
                console.log(name + body)
                fs.writeFileSync(name + ".srt", body);

            }
            //TODO something when do not find the the subtitle
        })

    },
    searchFiles: function (filepath) {
        fs.readdir(filepath, (err, files) => {
            if (err) return;
            files.forEach(file => {
                let fullname = path.join(filepath, file)
                fs.stat(fullname, (err, stats) => {
                    if (stats.isDirectory()) {
                        this.searchFiles(fullname)
                    } else {
                        let parse = path.parse(fullname)
                        if (extentions.indexOf(parse.ext) >= 0) {
                            let srt = path.join(parse.dir, parse.name)
                            srt += '.srt'
                            fs.exists(srt, exists => {
                                if (!exists) {
                                    this.calcHash(fullname, this.getWriteSrt)
                                }
                            })
                        }
                    }
                })
            })

        })
    }
}
