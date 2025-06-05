const path = require('path')
const env = process.env.NODE_ENV || "development"

require('dotenv').config({ path: path.resolve(__dirname, `../${env}.env`) });

module.exports = {
    whitelisted_domains_and_methods: {
        origin: "http://localhost:5174"
        // methods: ["GET", "POST"],
    },
    database: {
        MONGO_URI: process.env.MONGO_URI
    }
}