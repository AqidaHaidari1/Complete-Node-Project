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

const data = readFileSync('./starter/dev-data/data.json', 'utf-8');

const server = createServer((req, res) => {
    const path = req.url;
    console.log(path)
    if (path === '/' || path === '/overview') {
        res.end('This is main page!')
    }
    else if (path === '/product') {
        res.end('This is the product page!')
    }
    else if (path === '/api') {
        res.writeHead('200', {
            'Content-type': 'application/json',
        })
        res.end(data);
    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h1>Page not found!</h1>')
    }
    res.end('Hello from Node Server!')
})

server.listen(3000, 'localhost', () => {
    console.log('Sever started at port 3000')
})