const cluster = require("cluster");

if (cluster.isMaster) {
  require("./main");
  cluster.fork();
} else {
  require("./build-server/server");
}
