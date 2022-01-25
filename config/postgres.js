const Pool = require("pg").Pool;
const config = require("../config/config");
var connectionString = config.POSTGRESURI

if (process.env.CURRENTENV == "production") {
    var pool = new Pool({
        host: '/cloudsql/teleo-318315:us-central1:teleodb',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
} else if (process.env.CURRENTENV == "development") {
    var pool = new Pool({
        host: '/cloudsql/teleo-318315:us-central1:teleodb',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
} else {
    var pool = new Pool({
        connectionString
    });
}
pool.connect((err, d) => {
    if (err) {
        console.error(connectionString, config.POSTGRESURI)
    }
    console.log("Database Connected");
});

module.exports.pool = pool;