const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  sequelize.define('Serie', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(600),
      length:400,
      allowNull: true
    },
    thumbnail: { 
      type: DataTypes.STRING(600),
      allowNull: true
    }
  });

};
