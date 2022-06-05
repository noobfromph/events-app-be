'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.event_users, {
        foreignKey: 'event_id'
      })
    }
  }
  events.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    venue: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'events',
  });
  return events;
};