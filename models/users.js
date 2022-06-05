'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model { }

  users.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });

  return users;
};