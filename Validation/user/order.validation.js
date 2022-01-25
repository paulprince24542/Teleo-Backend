var validator = require("validator")



const orderValidate = (data) => {
    console.log(data)
    const errors = {}
        // if (data.houseno) {
        //     errors.msghouse = "House No or Near LandMark is required"
        //     return errors
        // }
    if (!data.address) {
        errors.msgaddress = "Address is required"
        return errors
    }
    if (!data.paymentmode) {
        errors.msgpayment = "Payment Mode is required"
        return errors
    }
    if (!data.orderpickup) {
        errors.msgpickup = "Order Pickup is required"
        return errors
    }
}

module.exports.orderValidate = orderValidate