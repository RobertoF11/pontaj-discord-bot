const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pontaj.db');

db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS pontaj(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    type TEXT,
    time TEXT,
    date TEXT
  )`);
});

module.exports = {
  clockIn(user, time) {
    db.run(`INSERT INTO pontaj(user,type,time,date) VALUES(?,?,?,DATE('now'))`, [user,'in',time]);
  },
  clockOut(user, time) {
    db.run(`INSERT INTO pontaj(user,type,time,date) VALUES(?,?,?,DATE('now'))`, [user,'out',time]);
  },
  getStatus(user) {
    return "Status functional (demo)";
  },
  getHistory(user) {
    return "Istoric generat (demo)";
  }
};
