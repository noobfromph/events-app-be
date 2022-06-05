'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

let config =  {
  "username": process.env.DB_username,
  "password": process.env.DB_password,
  "database": process.env.DB_database,
  "host": process.env.DB_host,
  "dialect": "postgres",
  timezone: '+08:00'
};

let sequelize = new Sequelize(config);

// read the models dir
// filter the files that has .js extensions
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

//  import all files on that directory as db models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// connect to the db
sequelize
.authenticate()
  .then(() => {
    console.log('Connection to Postgres has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to Postgres database:', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
