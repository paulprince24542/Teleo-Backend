var { Sequelize } = require("sequelize");

if (process.env.CURRENTENV == "production") {
    var sequelize = new Sequelize(
        process.env.DATABASE,
        process.env.DBUSERNAME,
        process.env.DBPASSWORD, {
            host: "/cloudsql/teleo-318315:us-central1:teleodb",
            dialect: "postgres",
        }
    );
} else if (process.env.CURRENTENV == "development") {} else {
    var sequelize = new Sequelize("teleo", "paul", "dedsec", {
        host: "localhost",
        dialect: "postgres",
        logging: false
    });
}

module.exports = sequelize;