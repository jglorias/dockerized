const { Pool } = require("pg");
const pool = new Pool({
  host: "db",
  port: 5432,
  user: "commsultcloud",
  password: "csag",
  database: "shipments",
});

module.exports = pool;
//Export to allow us to require this in server.js, which is the main.
