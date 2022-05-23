const path = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { mkdir, readdir, copyFile, writeFile } = require('fs/promises');

const createDistDir = async () => await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
const combineStyles = async () => {
  const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  const output = createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

  for (const file of files) {
    const isCssFile = path.extname(file.name) === '.css';
    
    if (file.isFile() && isCssFile) {
      const input = createReadStream(path.join(__dirname, 'styles', file.name));      

      input.on('data', (chunk) => output.write(chunk));
      input.on('error', (err) => {
        throw new Error(err.message);
      });
    }
  }
};
const copyAssets = async (pathFrom, pathTo) => {
  await mkdir(path.join(__dirname, pathTo), { recursive: true });

  const files = await readdir(path.join(__dirname, pathFrom), { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      copyFile(path.join(__dirname, pathFrom, file.name), path.join(__dirname, pathTo, file.name));
    } else {
      copyAssets(`${pathFrom}/${file.name}`, `${pathTo}/${file.name}`);
    }
  }
};
const createHtml = async () => {
  const templateReadStream = createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  // const htmlOutput = createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  let templateData = '';

  templateReadStream.on('data', (chunk) => templateData += chunk);
  templateReadStream.on('error', (err) => {
    throw new Error(err.message);
  });

  const components = await readdir(path.join(__dirname, 'components'), { withFileTypes: true });

  for (const component of components) {
    const isHtmlFile = path.extname(component.name) === '.html';

    if (isHtmlFile) {
      const componentInput = createReadStream(path.join(__dirname, 'components', component.name), 'utf-8');

      componentInput.on('data', (chunk) => {
        const componentName = path.basename(component.name, '.html');

        templateData = templateData.replace(`{{${componentName}}}`, chunk);

        writeFile(
          path.join(__dirname, 'project-dist', 'index.html'),
          templateData,
          (err) => {
            if (err) throw err;
          },
        );
      });
      componentInput.on('error', (err) => {
        throw new Error(err.message);
      });
    }
  }
};

(async function() {
  try {
    createDistDir();
    createHtml();
    combineStyles();
    copyAssets('assets', 'project-dist/assets');
  } catch (error) {
    console.error(error);
  }
})();
