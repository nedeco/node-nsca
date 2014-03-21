var net = require('net');
var crc32 = require('buffer-crc32');
var HOST = 'localhost';
var PORT = 8667;


function Notifier(host, port) {
    this.host = host;
    this.port = port;
}


Notifier.prototype.send = function(hostName, serviceDesc, returnCode, pluginOutput) {

	var PACKET_VERSION = 3;
	var MSG_LENGTH = 720;


    var client = new net.Socket();

    client.connect(this.port, this.host, function() {
        console.log("Connected to :" + HOST + ":" + PORT);
    });

    client.on('data', function(data) {
        console.log('DATA' + data.length);
        var inBuffer = new Buffer(data);
        var  outBuffer = new Buffer(MSG_LENGTH);
        var timestamp = inBuffer.readInt32BE(128);
        //header//
        outBuffer.writeInt16BE(PACKET_VERSION,0); //packet version 
        outBuffer.fill("h", 2, 3); //filling
        outBuffer.writeUInt32BE(0,4); // initial 0 for CRC32 value
        outBuffer.writeUInt32BE(timestamp,8); //timestamp
        outBuffer.writeInt16BE(returnCode,12); //returncode

        outBuffer.write(hostName, 14, 77); // 64
        outBuffer.write(serviceDesc,78, 206); //128 
        //outBuffer.fill("s", 78, 205)
        outBuffer.write(pluginOutput, 206, 720);
        //outBuffer.fill("h", 206, 720); //filling
        console.log(crc32.unsigned(outBuffer));
        outBuffer.writeUInt32BE(crc32.unsigned(outBuffer),4);
        

 client.write(outBuffer, function(a) {
 	client.destroy();
 	console.log(client.bytesWritten);
 });



        console.log(inBuffer.readInt32BE(128));
        
    });

    client.on('close', function() {
        console.log('Connection closed');
    });

}

var n = new Notifier(HOST, PORT);
n.send("alex-vm", "demobuffer not working for me", 2, "100% outage");