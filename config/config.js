const dotenv = require('dotenv');
dotenv.config()
module.exports = {
    development: {
      username: process.env.userdb, // ← Usuario de la DB
      password: process.env.password, // ← Contraseña del usuario de la DB
      database: process.env.database, // ← Nombre de la DB previamente creada
      host: process.env.host,
      dialect: process.env.dialect,
    },
    test: {
      username: "root",
      password: null,
      database: "database_test",
      host: "127.0.0.1",
      dialect: "mysql",
    },
    production: {
      username: "root",
      password: null,
      database: "database_production",
      host: "127.0.0.1",
      dialect: "mysql",
    },
  };
  