const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('Comic', {
        id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        },
        name: { 
        type: DataTypes.STRING,
        allowNull: false,
        },
        difficulty: {
        type: DataTypes.INTEGER
        },
        duration: {
        type: DataTypes.INTEGER
        },
        season: {
        type: DataTypes.STRING
        }
    });

};