const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");
const groupSchema = require("./models/group");
const user = require("./models/user");
const message = require("./models/message");


dotenv.config();
const cors = require("cors");
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
const connect = mongoose.connection;
connect.on("open", () => {
  console.log("conneted to Database");
});

app.use(cookieparser());
app.use(express.json());

let PORT = process.env.PORT || 3005;


app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`);
  });

