var validator = require("validator");

var validateLogin = (data) => {
    console.log(data)
  const errors = {};
  var phonenumber = data.phone;
  console.log(phonenumber)
  if (!phonenumber) {
    errors.msg = "Phonenumber is required";
    return errors.msg;
  } else if (validator.isEmpty(phonenumber) == true) {
    errors.msg = "Phonenumber is empty";
    return errors.msg;
  } else if (
    validator.isMobilePhone(phonenumber, "en-IN") == false ||
    validator.isLength(phonenumber, {
      min: 10,
      max: 10,
    }) == false
  ) {
    errors.msg = "Invalid Phonenumber and must be 10 digits";
    return errors.msg;
  }
};


const verifySign = (data) => {
    const errors = {}
    var token = data.token;
    var secret = data.secret;
    if (!token) {
        errors.msg = "Token is required"
        return errors.msg
    } else if (validator.isEmpty(token) == true) {
        errors.msg = "Token is empty"
        return errors.msg
    } else if (validator.isLength(token, {
            min: 6,
            max: 6
        }) == false) {
        errors.msg = "Invalid OTP has 6 digits"
        return errors.msg
    }
    if (!secret) {
        errors.msg = "Secret is required"
        return errors.msg
    } else if (validator.isEmpty(token) == true) {
        errors.msg = "Secret is empty"
        return errors.msg
    }
};


module.exports.validateLogin = validateLogin;
module.exports.verifySign = verifySign;