const db = require('../config/db');

class Event {
  static create(data, callback) {
    const sql = 'INSERT INTO events (name, date, location, id_usuario) VALUES (?, ?, ?, ?)';
    db.query(sql, [data.name, data.date, data.location, data.id_usuario], callback);
  }

  static getAll(callback) {
    const sql = 'SELECT * FROM events WHERE id_usuario = ?';
    db.query(sql, [data.id_usuario], callback);
  }

  static remove(id, callback) {
    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, [id], callback);
  }

  static update(id, data, callback) {
    const sql = 'UPDATE events SET name = ?, date = ?, location = ? WHERE id = ?';
    db.query(sql, [data.name, data.date, data.location, id], callback);
  }
}

module.exports = Event;
