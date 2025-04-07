import fs from "fs";
import superagent from "superagent";

fs.readFile("./dog.txt", (err, data) => {
	superagent
		.get(`https://dog.ceo/api/breed/${data}/images/random`)
        .end((err, res) => {
            fs.writeFile('dog-img.txt', res.body.message, err => {
                console.log('file save!')
            })
        });
});
