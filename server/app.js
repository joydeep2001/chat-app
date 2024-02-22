const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");

const auth = require("./routes/auth");

const groupSchema = require("./models/group");
const user = require("./models/user");
const message = require("./models/message");
const chat = require('./routes/chat')
const multicast = require('./routes/multicast')
const unicast = require('./routes/unicast')


dotenv.config();
const cors = require("cors");
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
const connect = mongoose.connection;
connect.on("open", () => {
  console.log("conneted to Database");
});



app.use(express.json());
app.use(cookieparser());

let PORT = process.env.PORT || 3005;


app.use("/api/v1/auth", auth);
app.use('/api/v1/chat',chat);
app.use('/api/v1/multicast',multicast);
app.use('/api/v1/unicast',unicast);

app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`);
});

