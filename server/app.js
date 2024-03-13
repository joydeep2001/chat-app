const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");


const http = require('http')

const auth = require("./routes/auth");
const WebSocketManager = require('./utility/WebSocketManager')

const groupSchema = require("./models/group");
const user = require("./models/user");
const message = require("./models/message");
const chat = require('./routes/chat')
const multicast = require('./routes/multicast')
const unicast = require('./routes/unicast')
const groupCreate = require('./routes/createGroup')




dotenv.config();
const cors = require("cors");

app.use(cors({ origin: ["http://localhost:3000","http://127.0.0.1:5500"], credentials: true }));
app.use(cookieparser());
app.use(express.json());

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
const connect = mongoose.connection;
connect.on("open", () => {
  console.log("conneted to Database");
});

const server  = http.createServer(app);

const websocketmanager = new WebSocketManager(server);



let PORT = process.env.PORT || 3005;


app.use("/api/v1/auth", auth);
app.use('/api/v1/chat',chat);
app.use('/api/v1/multicast',multicast);
app.use('/api/v1/unicast',unicast);
app.use('/api/v1/group-create',groupCreate);



server.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`);
});


