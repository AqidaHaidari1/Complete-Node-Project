import fs from "fs";
import http from "http";

const server = http.createServer();
server.on("request", (req, res) => {
	//solution 1
	// fs.readFile("test-file.txt", (err, data) => {
	// 	if (err) console.log(err);
	// 	res.end(data);
	// });

	//solution 2: streams
	// const readable = fs.createReadStream("test-file.txt");
	// readable.on("data", (chunk) => {
	// 	res.write(chunk);
	// });
	// readable.on("end", () => {
	// 	res.end();
	// });

	//solution 2: streams
	const readable = fs.createReadStream("test-file.txt");
	readable.pipe(res);
});
server.listen(8000, "localhost", () => {
	console.log("Listning to the server on port 8000");
});
