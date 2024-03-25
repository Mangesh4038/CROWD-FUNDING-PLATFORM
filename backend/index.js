const express = require("express");
const app = express();
const connectDB = require("./db");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
require("dotenv").config();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

 app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use("/api/auth", require("./routes/authentication"));
app.use("/api/investor", require("./routes/investor"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend","public", "index.html"));
});


// Connecting to the database
connectDB();

  
// Initializing the application
app.listen(5000 || process.env.PORT, () => {
  console.log(`app listening on port ${5000 || process.env.PORT}`);
});
