require("dotenv").config();
const cryptojs = require("crypto-js");

const decrypt = (text) => {
  if (!text) {
    return false;
  } else {
    const bytesCipher = cryptojs.AES.decrypt(text.toString(), process.env.KEY);
    return bytesCipher.toString(cryptojs.enc.Utf8);
  }
};

const encrypt = (text) => {
  return cryptojs.AES.encrypt(text, process.env.KEY).toString();
};

// console.log(encrypt("123"));
// U2FsdGVkX19oib6pYnWfFxyXzF0GQ1FQnmaTpaQ4iEY=
// console.log(encrypt("12345678"));
// console.log(decrypt("U2FsdGVkX18qwbPAK2nkf0rczxGAmFdjaZiPiqFxrfA="));

module.exports = { decrypt, encrypt };
