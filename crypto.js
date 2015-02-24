//var MCrypt = require("mcrypt").MCrypt;
var DES3Encoder = require("./des3");
var XorEncoder = require("./xor");


function Crypter(enc, key, iv) {
  this.key = key;
  this.iv = iv;
  switch (enc) {
    case "xor":
      this.encryption = new XorEncoder();
      break;
    case "des3":
      this.encryption = new DES3Encoder();
      break;
    default:
      throw new Error("unsupported encryption mode!");
      //this.encryption = new MCrypt(enc, "cfb");
  }
}

Crypter.prototype.encode = function(msg) {
  this.encryption.validateKeySize(false);
  this.encryption.open(this.key, this.iv);
  return this.encryption.encrypt(msg);
};

module.exports = Crypter;
