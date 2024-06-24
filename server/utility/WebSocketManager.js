const { json } = require("express");
const Message = require("../models/message");
const Group = require("../models/group");
const Contact = require("../models/contact");
const fs = require("fs");

const WebSocketServer = require("websocket").server;
const jwt = require("jsonwebtoken");
class WebSocketManager {
  websocket;
  connections;

  constructor(server) {
    const websocket = new WebSocketServer({ httpServer: server });
    this.websocket = websocket;
    this.connections = new Map();

    websocket.on("request", (req) => {
      const connection = req.accept(null, req.origin);
      const getAuthTokenFromCookie = (cookieStr = "") => {
        const cookies = cookieStr.split(";");
        console.log(cookies);
        if (cookies.length === 0) throw new Error("INVALID COOKIE");
        try {
          const [[authTokenKey, authTokenValue]] = cookies
            .map((cookie) => cookie.trim().split("="))
            .filter(([cookieName, value]) => cookieName === "auth-token");

          console.log(authTokenKey, authTokenValue);
          return authTokenValue;
        } catch (err) {
          throw err;
        }
      };

      const authToken = getAuthTokenFromCookie(req.httpRequest.headers.cookie);
      console.log(getAuthTokenFromCookie(req.httpRequest.headers.cookie));
      let userId;
      try {
        userId = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        console.log("The error is here!");
        console.log(authToken);
        console.log(err);

        return;
      }

      this.connections.set(userId.id, connection);
      console.log(`${userId.id}: connected`);

      connection.on("close", () => {
        console.log("Connection closed..");
        this.connections.delete(userId.id);
        console.log(this.connections.keys());
      });
      connection.on("message", (message) => {
        console.log(userId.id);
        //console.log("message");
        //console.log(message);
        const { content, receiver_id, content_type, communicationType, group_id, file_name } =
          JSON.parse(message.utf8Data);
        console.log(communicationType);
        //console.log(content);
        console.log(content_type);
        console.log(receiver_id);
        //console.log(message.utf8Data);
        let url = null;
        if(content_type === "media") {
          console.log(content);
          const dataArray = Object.values(content).map(charCode => charCode);
          const view = new Uint8Array(dataArray);
          console.log(dataArray);
          const buffer = Buffer.from(view);
          console.log(typeof content);
          const file_unique_name = Date.now() + file_name;
          fs.writeFile(`./uploads/${file_unique_name}`, buffer, (err) => {
            if (err) {
              console.error('Error writing file:', err);
            } else {
              console.log('File written successfully.');
            }
          });
          url = "http://52.66.202.2/uploads/" + file_unique_name;
          
        } 

        if (communicationType === "unicast") {
          console.log("Calling Unicast Route ..");
          this.unicast(receiver_id, content_type, userId.id, url ?? content);
        } else {
          console.log("Calling Multicast...");
          this.multicast(group_id, content_type, userId.id, url ?? content);
        }
      });
    });
  }

  async unicast(receiver_id, m_type, sender_id, content) {
    let message = null;
    let url = null;
    if (m_type === "text") {
      message = content;
    } else {
      url = content;
    }
    const message_entry = new Message({
      sender_id: sender_id,
      message_type: m_type,
      content: content,
      url: url,
      group_id: null,
      receiver_id: receiver_id,
    });
    const savedMessage = await message_entry.save();
    console.log(savedMessage);
    const receiverConnection = this.connections.get(receiver_id);
    console.log(receiver_id);
    console.log("Conn");
    if (receiverConnection) {
      console.log("Sending Message ...");
      receiverConnection.send(JSON.stringify(savedMessage));
    }
  }
  async multicast(group_id, m_type, sender_id, content) {
    let message = null;
    let url = null;
    if (m_type === "text") {
      message = content;
    } else {
      url = content;
    }

    // const contacts = await Contact.findOne({ userId: sender_id });
    // let contactslist = contacts.contacts;
    // if (contactslist.indexOf(receiver_id) != -1) {
    //   contactslist.push(receiver_id);
    // }
    const message_entry = new Message({
      sender_id: sender_id,
      message_type: m_type,
      content: content,
      url: url,
      group_id: group_id,
      receiver_id: null,
    });
    const savedMessage = await message_entry.save();
    const groupDetails = await Group.findOne({ name: group_id }); //this should be changed later. for now group name is considered as group id
    const membersId = groupDetails.members;
    for (let member_id of membersId) {
      const receiverConnection = this.connections.get(member_id);
      if (receiverConnection) {
        console.log("Sending Message !!");
        receiverConnection.send(JSON.stringify(savedMessage));
      }
    }
  }
}
module.exports = WebSocketManager;
