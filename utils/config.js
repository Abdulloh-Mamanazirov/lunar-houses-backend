const { Pool } = require("pg");

const client = new Pool({
  user: "kavmfgfh",
  database: "kavmfgfh",
  port: 5432,
  password: "9LWRFhy2ieFso13_P65mwY4VRiW57ffX",
  host: "drona.db.elephantsql.com",
});
client.connect();

module.exports = client;
