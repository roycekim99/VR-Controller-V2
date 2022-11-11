const path = require("path");
const express = require("express");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const os = require("os");

const getLocalExternalIP = () =>
  []
    .concat(...Object.values(os.networkInterfaces()))
    .filter((details) => details.family === "IPv4" && !details.internal)
    .pop().address;

// =============================
const LOCAL_IP = getLocalExternalIP();
const MULTICAST_ADDR = "239.255.255.250";
const PORT = 3000;
const expressApp = express();
const httpServer = require("http").createServer(expressApp);
const io = require("socket.io")(httpServer);

let users = {}; // {uid: socket}

//#region UDP SERVER
server.bind(PORT + 20, function () {
  server.setBroadcast(true);
  server.setMulticastTTL(128);
  server.addMembership(MULTICAST_ADDR);
});
setInterval(sendMyIP, 300);

function sendMyIP() {
  server.send(LOCAL_IP, PORT, MULTICAST_ADDR);
  console.log("Sent UPD multicast: ", LOCAL_IP);
}
//#endregion

//#region SOCKET CALLS
io.on("connect", (socket) => {
  let incomingIP = socket.request.connection.address().address;
  //DEBUG
  console.info("Message received from " + socket.id);
  console.info("Incoming IP: ", incomingIP);

  // ===[ SOCKET CALL FUNCTIONS]====
  socket.on("handshake", () => {
    console.info("Handshake received from: " + socket.id);
  });

  socket.on("class", (data) => {
    socket.emit("class", { date: new Date().getTime(), data: data });
  });

  socket.on("disconnect", () => {
    console.info("Disconnect received from: " + socket.id);
  });
});
//#endregion

//#region API CALLS

// Have Node serve the files for React app
expressApp.use(express.static(path.resolve(__dirname, "../build")));

// Handle GET requests to /api route
expressApp.get("/client_test", (req, res) => {
  res.json({ message: "Backend server reachable! You may continue." });
});

// TODO: START/STOP
expressApp.get("/start_video", (req, res) => {
  console.log("button has broadcasted start!");
  io.emit("start_video");

  res.send("Done");
});

expressApp.get("/stop_video", (req, res) => {
  console.log("button has broadcasted stop!");
  io.emit("stop_video");

  res.send("Done");
});

// All other GET requests not handled before will return our React app
expressApp.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});
//#endregion

// LISTEN
httpServer.listen(PORT, () => {
  console.log("listening on *:", PORT);
});
