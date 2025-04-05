import { readFileSync, writeFileSync, readFile, writeFile } from 'fs';
import { createServer } from 'http'; 

import url from 'url';


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

const replaceTempplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}
const data = readFileSync('./starter/dev-data/data.json', 'utf-8');
const tempCard = readFileSync('./starter/templates/template-card.html', 'utf-8');
const tempProduct = readFileSync('./starter/templates/template-product.html', 'utf-8');
const tempOverview = readFileSync('./starter/templates/template-overview.html', 'utf-8');

const dataObj = JSON.parse(data)

const server = createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true)
    
    if (pathname === '/' || pathname === '/overview') {
        const cardsHtml = dataObj.map(el => replaceTempplate(tempCard, el)).join('')
        const overviewPage = tempOverview.replace('{%PRODUCTS_CARDS%}', cardsHtml)
        
        res.writeHead(202,{
            'COntent-type': 'text/html'
        })
        res.end(overviewPage)
    }
    else if (pathname === '/product') {
        res.writeHead(202,{
            'COntent-type': 'text/html'
        })
        const product = dataObj[query.id];
        const output = replaceTempplate(tempProduct, product)
        res.end(output);
    }
    else if (pathname === '/api') {
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
    
})

server.listen(3000, 'localhost', () => {
    console.log('Sever started at port 3000')
})