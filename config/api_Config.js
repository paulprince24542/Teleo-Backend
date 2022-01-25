var Sequelize = require("sequelize");

if (process.env.DB_ENV == "development") {
    var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
} else if (process.env.DB_ENV == "production") {
    var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
} else {
    const sequelize = new Sequelize('teleo', 'teleo', '', {
        host: 'localhost',
        dialect: 'postgres'
    });
}