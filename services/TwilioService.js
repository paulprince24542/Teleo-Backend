const accountSid = 'AC5d5de772a1ab17aae2d71ee46feb6eeb';
const authToken = '8f7d6af2c1e8d35bf43d04ca05ec3a6f';
const client = require('twilio')(accountSid, authToken);

function sendMessage(phonenumber, otp) {
    client.messages
        .create({
            body: `${otp} is your teleo verification code. Enjoy :-)`,
            messagingServiceSid: 'MGd063d9551e4e1f7a014a7ecbcb0e890a',
            to: `+91${phonenumber}`
        })
        .then(message => {
            console.log("Message Send", message)
        })
        .done();
}

module.exports.sendMessage = sendMessage