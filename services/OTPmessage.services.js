const speakEasy = require("speakeasy");
const axios = require("axios")
const config = require("../config/config")

function sentMessage(phonenumber, token, template) {
    console.log(phonenumber, token, template)
    console.log(`https://2factor.in/API/V1/${config.factor2}/SMS/${phonenumber}/${token}/${template}`)
    axios
        .post(
            `https://2factor.in/API/V1/${config.factor2}/SMS/${phonenumber}/${token}/${template}`
        )
        .then((res) => {
            console.log(res)
            console.log("SMS Sent");
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports.sentMessage = sentMessage