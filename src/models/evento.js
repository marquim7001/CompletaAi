const db = require('../config/db');

const Event = {
  getAll: (callback) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
      if (err) throw err;
      callback(results);
    });
  },

  create: (data, callback) => {
    const query = 'INSERT INTO events (name, date, location) VALUES (?, ?, ?)';
    db.query(query, [data.name, data.date, data.location], (err, result) => {
      if (err) throw err;
      callback(result);
    });
  }
};

module.exports = Event;
