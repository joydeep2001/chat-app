const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

const http = require("http");

const auth = require("./routes/auth");
const WebSocketManager = require("./utility/WebSocketManager");

const groupSchema = require("./models/group");
const user = require("./models/user");
const group = require("./routes/group");
const message = require("./routes/message");
const contact = require("./routes/contact")


dotenv.config();
const cors = require("cors");

app.use(
  cors({
    origin: ["http://13.200.250.31", "http://13.200.250.31:3000", "http://52.66.202.2:3000:80", "http://localhost:3000", "http://127.0.0.1:5500", "http://192.168.0.105:3000"],
    credentials: true,
  })
);
app.use(cookieparser());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

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
app.use("/api/v1/contacts", contact);
app.use("/api/v1/group", group);
app.use("/api/v1/messages", message);
app.use(express.static(path.join(__dirname, 'build')));



server.listen(PORT, () => {
  console.log(`Server is Running ${PORT}`);
});
