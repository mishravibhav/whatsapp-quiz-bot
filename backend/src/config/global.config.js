const path = require('path')
const env = process.env.NODE_ENV || "development"

require('dotenv').config({ path: path.resolve(__dirname, `../${env}.env`) });

module.exports = {
    whitelisted_domains: {
        origin: [
            "http://localhost:5000",
            "https://whatsapp-quiz-bot-frontend.vercel.app"
          ]},
    database: {
        MONGO_URI: process.env.MONGO_URI
    },
    port:process.env.PORT
}