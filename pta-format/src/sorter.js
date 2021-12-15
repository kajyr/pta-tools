const through = require("through2");

const sorter = function (a, b) {
  return a - b;
};

module.exports = function () {
  let lastDate = new Date(1900, 0, 1);
  const memory = {};

  function transform(item, enc, cb) {
    // if item does not have date, let's use the previous one
    const date = item.date || lastDate;

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (!memory[year]) {
      memory[year] = {};
    }

    if (!memory[year][month]) {
      memory[year][month] = {};
    }

    if (!memory[year][month][day]) {
      memory[year][month][day] = [];
    }

    memory[year][month][day].push(item);

    lastDate = date;
    cb();
  }

  function flush(cb) {
    const years = Object.keys(memory).sort(sorter);

    for (const year of years) {
      const months = Object.keys(memory[year]).sort(sorter);

      for (const month of months) {
        const days = Object.keys(memory[year][month]).sort(sorter);

        for (const day of days) {
          const items = memory[year][month][day];

          for (const item of items) {
            this.push(item);
          }
        }
      }
    }
    cb();
  }

  return through.obj(transform, flush);
};
