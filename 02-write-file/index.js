const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = process;

const rl = readline.createInterface({ input, output });

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  'Hello World\n',
  (err) => {
    if (err) throw err;

    output.write('File was created.\n');
  },
);

rl.on('line', (data) => {
  if (data === 'exit') {
    rl.close();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text.txt'),
      `${data}\n`,
      (err) => {
        if (err) throw err;
  
        output.write('Text was added.\n');
      }
    );
  }
});

output.write('Hi! Enter the text.\n');

rl.on('close', () => output.write('Good bye!'));
