const { json } = require("express");
const Message = require("../models/message");
const Group = require("../models/group");
const Contact = require("../models/contact");

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
      const authToken = req.httpRequest.headers["sec-websocket-protocol"];
      
      // console.log("here")
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
        const { content, reciver_id, content_type, communicationType } =
          JSON.parse(message.utf8Data);
        console.log(communicationType);
        console.log(content);
        console.log(content_type);
        console.log(reciver_id);
        console.log(message.utf8Data);
        if (communicationType === "unicast") {
          console.log("Calling Unicast Route ..");
          this.unicast(reciver_id, content_type, userId.id, content);
        } else {
          console.log("Calling Multicast...");
          this.multicast(reciver_id, content_type, userId.id, content);
        }

        // connections.forEach(connection => connection.send("So you want to say " + );
      });
    });
  }

  async unicast(reciver_id, m_type, sender_id, content) {
    // const contacts = await Contact.findOne({userId:userId.id})
    // let contactslist = contacts.contacts;
    // if(contactslist.indexOf(reciver_id)!=-1)
    // {
    //   contactslist.push(reciver_id)
    // }
    let message = null;
    let url = null;
    if (m_type === "text") {
      message = content;
    } else {
      url = content;
    }
    const message_entry = new Message({
      sender: sender_id,
      message_type: m_type,
      content: content,
      url: url,
      group_id: null,
      reciver_id: reciver_id,
    });
    const savedMessage = await message_entry.save();
    console.log(savedMessage);
    const receiverConnection = this.connections.get(reciver_id);

    //console.log(this.connections)
    console.log(reciver_id);
    //console.log(receiverConnection);
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

    const contacts = await Contact.findOne({ userId: userId.id });
    let contactslist = contacts.contacts;
    if (contactslist.indexOf(reciver_id) != -1) {
      contactslist.push(reciver_id);
    }
    const message_entry = new Message({
      sender: sender_id,
      message_type: m_type,
      content: content,
      url: url,
      group_id: null,
      reciver_id: group_id,
    });
    const savedMessage = await message_entry.save();
    const groupDetails = await Group.findOne({ id: group_id });
    const membersId = groupDetails.members;
    for (let member_id of membersId) {
      const receiverConnection = this.connections.get(member_id);
      if (receiverConnection) {
        console.log("Sending Message !!");
        receiverConnection.send(JSON.stringify(savedMessage.content));
      }
    }
  }
}
module.exports = WebSocketManager;

// websocket.on('request',(req)=>{
//     const connection = req.accept(null,req.origin)
//     // console.log(req.origin);
//     // console.log(req.headers);

//       console.log(`${userId.id} connected......`)
//       connections.set(userId.id,connection)
//   //    console.log(connections)

//       connection.on("close", () =>{
//         connections.delete(userId)
//       });
//       connection.on("message", (message) => {
//           // we have some message
//         console.log(userId.id);
//         const data = message.utf8Data;
//         const reciver_id = data.reciever
//         const content = data.message;

//       })
//   })
