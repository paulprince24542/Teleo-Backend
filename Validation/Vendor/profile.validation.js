const Joi = require("joi");
const validator = require("validator");

const profileValidation = (data) => {
    const errors = {}
    if (!data.ownername) {
        errors.msg = "ownername is required"
        return errors.msg
    } else if (validator.isEmpty(data.ownername) == true) {
        errors.msg = "ownername is empty"
        return errors.msg
    } else if (!data.altphonenumber) {
        errors.msg = "alternate phonenumber is required"
        return errors.msg
    } else if (validator.isMobilePhone(data.altphonenumber, 'en-IN') == false || validator.isLength(data.altphonenumber, {
            min: 10,
            max: 10
        }) == false) {
        errors.msg = "Invalid Phonenumber and must be 10 digits"
        return errors.msg
    } else if (!data.email) {
        errors.msg = "email is required"
        return errors.msg
    } else if (validator.isEmail(data.email) == false) {
        errors.msg = "Invalid Email"
        return errors.msg
    } else if (!data.address) {
        errors.msg = "address is required"
        return errors.msg
    } else if (!data.city) {
        errors.msg = "city is required"
        return errors.msg
    } else if (!data.state) {
        errors.msg = "state is required"
        return errors.msg
    } else if (!data.postalcode) {
        errors.msg = "postalcode is required"
        return errors.msg
    } else if (validator.isLength(data.postalcode, { min: 6, max: 6 }) == false) {
        errors.msg = "Invalid Postalcode"
        return errors.msg
    } else if (!data.country) {
        errors.msg = "country is required"
        return errors.msg
    }
}

const profileimage = (data) => {
    const schema = Joi.object({
        latitude: Joi.string().required(),
        longitude: Joi.string().required()

    })
    return schema.validate(data)
}


const startProfile = (data) => {
    const errors = {}
    var storename = data.storename;
    var storetype = data.storetype;
    if (!storename) {
        errors.msg = "storename is required"
        return errors.msg
    } else if (validator.isEmpty(storename) == true) {
        errors.msg = "storename is empty"
        return errors.msg
    } else if (!storetype) {
        errors.msg = "storetype is required"
        return errors.msg
    } else if (validator.isEmpty(storetype) == true) {
        errors.msg = "storetype is empty"
        return errors.msg
    }
}

const locationProfile = (data) => {
    const errors = {}

    var latitude = data.latitude;
    var longitude = data.longitude;
    if (!latitude) {
        errors.msg = "latitude is required"
        return errors.msg
    } else if (validator.isEmpty(latitude) == true) {
        errors.msg = "latitude is empty"
        return errors.msg
    } else if (!longitude) {
        errors.msg = "longitude is required"
        return errors.msg
    } else if (validator.isEmpty(longitude) == true) {
        errors.msg = "longitude is empty"
        return errors.msg
    } else if (!data.address) {
        errors.msg = "address is required"
        return errors.msg
    } else if (!data.streetname) {
        errors.msg = "streetname is required"
        return errors.msg
    } else if (!data.landmark) {
        errors.msg = "landmark is required"
        return errors.msg
    }
}

const license = (data) => {
    const errors = {}
    if (!data.gstnumber) {
        errors.msg = "gstnumber is required"
        return errors.msg
    } else if (validator.isLength(data.gstnumber, { min: 15, max: 15 }) == false) {
        errors.msg = "Invlalid GST Number"
        return errors.msg
    } else if (data.fssai) {
        if (validator.isLength(data.fssai, { min: 14, max: 14 }) == false) {
            errors.msg = "Invalid Fssai"
            return errors.msg
        }
    }
}

module.exports.profileValidation = profileValidation
module.exports.profileimage = profileimage
module.exports.startProfile = startProfile
module.exports.locationProfile = locationProfile
module.exports.license = license