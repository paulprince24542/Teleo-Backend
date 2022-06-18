var AWS = require("aws-sdk");
var config = require("./secretsConfig");

var s3Bucket = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    // signatureVersion: 'v4'
});

module.exports = s3Bucket
