const fs = require("fs");

const file = './db.json';
let data = [];

module.exports = {
    init() {
      try {
          const fileContents = fs.readFileSync(file);
          data = JSON.parse(fileContents);
      } catch (e) {
          data = [];
          console.log(e)
      }
    },
    save() {
        fs.writeFileSync(file, JSON.stringify(data))
    },
    getItems() {
        return data.slice(-30);
    },
    addItem(item) {
        data.push(item)
        this.save()
    },
    getLasts(date) {
        return data.filter(message => message.datetime > date);
    },
};