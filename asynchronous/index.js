import fs from "fs";
import superagent from "superagent";

//callback hell
// fs.readFile("./dog.txt", (err, data) => {
// 	superagent
// 		.get(`https://dog.ceo/api/breed/${data}/images/random`)
//         .end((err, res) => {
//             fs.writeFile('dog-img.txt', res.body.message, err => {
//                 console.log('file save!')
//             })
//         });
// });

//callback hell to promiss
const readFilePro = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err, data) => {
			if (err) reject("couldn't find the file");
			resolve(data);
		});
	});
};

const writeFilePro = (file, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, (err) => {
			if (err) reject("was not successful!");
			console.log("write was successful!");
		});
	});
};

/*
readFilePro("./dog.txt")
	.then((res) => {
		return superagent.get(`https://dog.ceo/api/breed/${res}/images/random`);
	})
	.then((res) => {
		writeFilePro("dog-img.txt", res.body.message);
	})
	.then(() => {
		console.log("file saved successfuly!");
	})
	.catch((err) => {
		console.log(err.message);
	});
*/

const getDogpic = async () => {
	try {
		const data = await readFilePro("./dog.txt");
		const res1 = superagent.get(
			`https://dog.ceo/api/breed/${data}/images/random`
		);
		const res2 = superagent.get(
			`https://dog.ceo/api/breed/${data}/images/random`
		);
		const res3 = superagent.get(
			`https://dog.ceo/api/breed/${data}/images/random`
		);
		const all = await Promise.all([res1, res2, res3]);
		const images = all.map((el) => {
			return el.body.message;
        });
        console.log(images)
		await writeFilePro("dog-img.txt", images.join("\n"));
	} catch (err) {
		console.log(err);
	}
};

getDogpic();
