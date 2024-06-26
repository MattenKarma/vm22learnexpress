const {Sequelize, QueryTypes, DataTypes} = require('sequelize');
const User = require('./User.js');
let sequelize = new Sequelize('sqlite:db.sqlite');
const Movie = sequelize.define('Movie',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

   name: {
       type: DataTypes.STRING,
       allowNull: false,
   },
   year: {
       type: DataTypes.INTEGER,
       allowNull: false,
   },
   description: {
       type: DataTypes.TEXT
   }
}, {tableName: 'movies', timestamps:false});

Movie.belongsTo(User,{foreignKey: 'user_id'});


module.exports = Movie;
