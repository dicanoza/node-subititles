var fs = require('fs');
var hasha = require('hasha');

var CalcHash = function (filepath, callback) {
    fs.open(filepath, 'r', function (err, fd) {
        fs.fstat(fd, function (err, stats) {
            var bufferSize = 64 * 1024,
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

            var bytes3 = Buffer.concat([bytes, bytes2]);
            var hash = hasha(bytes3, { algorithm: 'md5' });

            fs.close(fd);
            callback(hash);

        });
    });
}
module.exports = CalcHash;
