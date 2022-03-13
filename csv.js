const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class CSV {
  headers = [];
  csvWriter = null;

  constructor(headers) {
    this.csvWriter = createCsvWriter({
      path: 'out.csv',
      header: headers,
    });
    this.headers = headers;
  }

  async write(data) {
    if (data) {
      await this.csvWriter.writeRecords(data);
    }
  }

  read(path) {
    return new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', () => {
          reject(null);
        })
    });
  }
}

module.exports = CSV;
