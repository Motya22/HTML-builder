const path = require('path');
const { stat } = require('fs');
const { readdir } = require('fs/promises');

(async function() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of files)
      stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        if (err) {
          throw new Error(err.message);
        } else if (stats.isFile()) {
          console.log(`${path.basename(file.name, path.extname(file.name))} - ${path.extname(file.name).slice(1)} - ${stats.size / 1024}kb`);
        }
      });
  } catch (err) {
    console.error(err);
  }
})();
