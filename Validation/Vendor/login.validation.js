const Joi = require("joi");
var validator = require('validator');
const { body, validationResult } = require('express-validator');



const loginValidate = (data) => {
    const errors = {}
    var phonenumber = data.phonenumber;
    if (!phonenumber) {
        errors.msg = "Phonenumber is required"
        return errors.msg
    } else if (validator.isEmpty(phonenumber) == true) {
        errors.msg = "Phonenumber is empty"
        return errors.msg
    } else if (validator.isMobilePhone(phonenumber, 'en-IN') == false || validator.isLength(phonenumber, {
            min: 10,
            max: 10
        }) == false) {
        errors.msg = "Invalid Phonenumber and must be 10 digits"
        return errors.msg

    }
};

const verifySign = (data) => {
    const errors = {}
    var token = data.token;
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
};

module.exports.loginValidate = loginValidate
module.exports.verifySign = verifySign