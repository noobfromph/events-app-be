'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class event_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // association with users table
      this.belongsTo(models.users, {
        foreignKey: 'user_id'
      });

      // association with users events
      this.belongsTo(models.events, {
        foreignKey: 'event_id'
      });
    }
  }
  event_users.init({
    event_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'event_users',
  });
  return event_users;
};