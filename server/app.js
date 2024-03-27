const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");

const http = require("http");

const auth = require("./routes/auth");
const WebSocketManager = require("./utility/WebSocketManager");

const groupSchema = require("./models/group");
const user = require("./models/user");
//const message = require("./models/message");
const chat = require("./routes/chat");
const multicast = require("./routes/multicast");
const unicast = require("./routes/unicast");
const groupCreate = require("./routes/createGroup");
const message = require("./routes/fetchMessage");
const contact = require("./routes/fetchContact");

dotenv.config();
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500", "http://192.168.0.105:3000"],
    credentials: true,
  })
);
app.use(cookieparser());
app.use(express.json());

try {
  mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
  const connect = mongoose.connection;
  connect.on("open", () => {
    console.log("conneted to Database");
  });
} catch (err) {
  console.log(err);
}
const server = http.createServer(app);

const websocketmanager = new WebSocketManager(server);

let PORT = process.env.PORT || 3005;

app.use("/api/v1/auth", auth);
app.use("/api/v1/chat", chat);
app.use("/api/v1/messages", message);
app.use("/api/v1/multicast", multicast);
app.use("/api/v1/unicast", unicast);
app.use("/api/v1/group-create", groupCreate);
app.use("/api/v1/contacts/", contact);

server.listen(PORT, () => {
  console.log(`Server is Running ${PORT}`);
});
