const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  sequelize.define('Character', {
    id: {
      type: DataTypes.BIGINT,
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
    },
    comics:{
      type: DataTypes.JSON,
      allowNull: true
    },
    series: {
      type: DataTypes.JSON
    },
    stories:{
      type: DataTypes.JSON
    }
  });

};
