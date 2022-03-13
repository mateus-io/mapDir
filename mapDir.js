const path = require('path');
const fs = require('fs');
const CSV = require('./csv');

const CSVInstance = new CSV([
  {id: 'filename', title: 'Nome do arquivo'},
  {id: 'lastUpdate', title: 'Data da última revisão'},
  {id: 'path', title: 'Local do arquivo'},
]);

function isFile(item) {
  return item.includes('.');
}

async function getItemsIntoDir(...paths) {
  try {
    const directoryPath = path.join(__dirname, ...paths);
    const itemsIntoDir = fs.readdirSync(directoryPath);
    for (const item of itemsIntoDir) {
      if (isFile(item)) {
        const itemPath = path.join(__dirname, ...paths, item);
        const itemData = fs.statSync(itemPath);

        await CSVInstance.write([{
          filename: item,
          lastUpdate: (new Date(itemData.mtime)).toLocaleString(),
          path: paths.join('/') + '/' + item
        }]);
      } else {
        await getItemsIntoDir(...paths, item);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

getItemsIntoDir('archives');

