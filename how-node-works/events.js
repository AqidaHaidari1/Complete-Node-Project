import EventEmitter from "events";
import http from "http";
const myEmitter = new EventEmitter();

myEmitter.on("newSale", () => {
	console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
	console.log("Something new");
});
myEmitter.on("newSale", (stock) => {
	console.log(`You can find ${stock} new items!`);
});

myEmitter.emit("newSale", 10);

//

const server = http.createServer();

server.on("request", (req, res) => {
	console.log("Resquest recived!");
	res.end("Request recived!");
});
server.on("request", (req, res) => {
	console.log("Another request!");
});
server.close("close", () => {
	console.log("server colsed!");
});
server.listen(8000, (req, res) => {
	console.log("server is running on port 8000");
});
