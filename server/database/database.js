const { Sequelize } = require("sequelize");
const connection = new Sequelize("sue", "root", "8067Ghtb@", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
