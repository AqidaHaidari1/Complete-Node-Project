const fs = require('fs');

//Blocking, Synchonous way
const fileContent = fs.readFileSync('./starter/txt/start.txt', 'utf-8');
console.log(fileContent);

const newFileContent = `This is all we know about Avacado:\n ${fileContent}`;
fs.writeFileSync('./starter/txt/output1.txt', fileContent);
console.log('File written');

//None Bloking, Asynchronous way
fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data) => {
    fs.writeFile('./starter/txt/output2.txt',  `New file content: ${data}`, 'utf-8', err => {
        console.log('Done!');
    })
})

console.log('Will read the FIle');