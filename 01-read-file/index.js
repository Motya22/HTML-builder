const path = require('path');
const fs = require('fs');

const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

input.on('data', (chunk) => console.log(chunk));
input.on('error', (err) => console.log('Error', err.message));
