const Joi = require("joi");
var validator = require('validator');
const { body, validationResult } = require('express-validator');



const loginValidate = (data) => {
    const errors = {}
    var phonenumber = data.phonenumber;
    if (!phonenumber) {
        errors.msgphone = "Phonenumber is required"
        return errors
    } else if (validator.isEmpty(phonenumber) == true) {
        errors.msgphone = "Phonenumber is empty"
        return errors
    } else if (validator.isMobilePhone(phonenumber, 'en-IN') == false || validator.isLength(phonenumber, {
            min: 10,
            max: 10
        }) == false) {
        errors.msgphone = "Invalid Phonenumber and must be 10 digits"
        return errors

    }
};

const verifySign = (data) => {
    const errors = {}
    var token = data.token;
    if (!token) {
        errors.msgtoken = "Token is required"
        return errors
    } else if (validator.isEmpty(token) == true) {
        errors.msgtoken = "Token is empty"
        return errors
    } else if (validator.isLength(token, {
            min: 6,
            max: 6
        }) == false) {
        errors.msgtoken = "Invalid OTP has 6 digits"
        return errors
    }
};

module.exports.loginValidate = loginValidate
module.exports.verifySign = verifySign