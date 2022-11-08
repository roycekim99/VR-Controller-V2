const path = require("path");
const express = require("express");
// const { v4 } = require("uuid");

/** Make Bundled Server Handler*/
/** - Higher level class: responsible for starting and stopping server */

// =============================
const PORT = 3000;
const expressApp = express();
const httpServer = require("http").createServer(expressApp);
const io = require("socket.io")(httpServer);

let users = {}; // {uid: socket}

//#region SOCKET CALLS
io.on("connect", (socket) => {
  //DEBUG
  console.info("Message received from " + socket.id);

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
