var speakEasy = require("speakeasy");
var randomstring = require("randomstring");
var axios = require("axios");

async function generateSecret() {
  var secret = speakEasy.generateSecret({
    length: 30,
  }).base32;
  return secret;
}

async function generateOtp() {
  var secret = await generateSecret();
  var token = speakEasy.totp({
    secret: secret,
    encoding: "base32",
  });

  if (token)
    return {
      token,
      secret,
    };
  else return false;
}

async function validateOtp(token, secret) {
  console.log(token, secret);
  var verify = speakEasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 4,
  });
  if (verify == true) {
    return true;
  } else {
    return false;
  }
}

//2Factor Messaging System
async function sendOTP(phoneNumber, otp, templateName) {
  // var phonenumber = '9061268071',
  var apiKey = "0f003868-5f23-11eb-8153-0200cd936042";
  // var templateName = 'vendor'
  axios
    .get(
      `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/${otp}/${templateName}`
    )
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
}

module.exports.generateOtp = generateOtp;
module.exports.generateSecret = generateSecret;
module.exports.validateOtp = validateOtp;
module.exports.sendOTP = sendOTP;
