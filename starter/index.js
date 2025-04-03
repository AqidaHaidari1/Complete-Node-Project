import { readFileSync, writeFileSync, readFile, writeFile } from 'fs';
import { createServer } from 'http'; 


///////////////////////////////////FILE///////////////////////////

//Blocking, Synchonous way
// const fileContent = readFileSync('./starter/txt/start.txt', 'utf-8');
// console.log(fileContent);

// const newFileContent = `This is all we know about Avacado:\n ${fileContent}`;
// writeFileSync('./starter/txt/output1.txt', fileContent);
// console.log('File written');

// //None Bloking, Asynchronous way
// readFile('./starter/txt/start.txt', 'utf-8', (err, data) => {
//     writeFile('./starter/txt/output2.txt',  `New file content: ${data}`, 'utf-8', err => {
//         console.log('Done!');
//     })
// })

// console.log('Will read the FIle');

///////////////////////////////////SERVER///////////////////////////
const server = createServer((req, res) => {
    res.end('Hello from Node Server!')
})

server.listen(3000, 'localhost', () => {
    console.log('Sever started at port 3000')
})