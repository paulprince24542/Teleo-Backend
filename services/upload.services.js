var AWS = require("aws-sdk");
const config = require("../config/config");

const s3Bucket = new AWS.S3({
    accessKeyId: config.AWS_accessKeyId,
    secretAccessKey: config.AWS_secretAccessKey,
    region: config.AWS_region,
});

module.exports.s3Bucket = s3Bucket