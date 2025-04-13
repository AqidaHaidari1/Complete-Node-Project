import fs from "fs";

export const readCsvFile = (req, res) => {
	fs.readFile("./sample_users.csv", "utf-8", (err, csvContent) => {
		const lines = csvContent.trim().split("\n");

		const headers = lines[0].split(",");
		console.log(headers);
		const data = lines.slice(1).map((line) => {
			const values = line.split(",");
			const obj = {};
			headers.forEach((header, index) => {
				obj[header.trim()] = values[index].trim();
			});
			return obj;
		});
		if (err) {
			console.error(err);
			return res.status(400).json({ status: "fail" });
		}
		res.status(200).json(data);
	});
};
