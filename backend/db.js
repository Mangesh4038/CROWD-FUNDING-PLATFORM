const { cookie } = require("express-validator");
const mongoose = require("mongoose");

require("dotenv").config();
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await Promise.race([
            mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // Other options...
            }),
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Connection timed out')), 10000); // Set timeout to 10 seconds
            })
        ]);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log('Mongodb database connection failed:', err.message);
    }
}

// {
//     "success": true,
//     "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVlMmZkMTQ5MThhZmFlMjE0MDQ1Njc0In0sImlhdCI6MTcwOTM3NDc0MH0.1QmQkOGLXaRw17lXvF8-oo55ePwsDOro9G7ie7kVDf8",
//     "emailCode": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVlMmZkMTQ5MThhZmFlMjE0MDQ1Njc0In0sImlhdCI6MTcwOTM3NDc0MCwiZXhwIjoxNzA5Mzc1OTQwfQ.jtIG84Ny9E_m0N546tS2xxI53bSR0NGHnl4OtbmO7IQ"
// }
module.exports = connectDB;
