require("dotenv").config();

module.exports = {
    env: process.env.NODE_ENV,
    vendorSecret: process.env.vendorSecret,
    userSecret: process.env.userSecret,
    adminSecret: process.env.adminSecret,
    AWS_accessKeyId: process.env.AWS_accessKeyId,
    AWS_secretAccessKey: process.env.AWS_secretAccessKey,
    AWS_region: process.env.AWS_region,
    factor2: process.env.factor2,
    POSTGRESURI: process.env.POSTGRESURI
};