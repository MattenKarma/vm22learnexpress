const express = require('express');
const router = express.Router();
const fs = require('fs');
const {Sequelize, QueryTypes, DataTypes} = require('sequelize');
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

router.get('/',async (req, res) => {  
    let movies = await sequelize.query('SELECT * FROM movies;',{type: QueryTypes.SELECT});
    res.render('movies/index.njk', {movies: movies});
});

router.get('/add', (req, res) => {
    res.render('movies/add.njk');
});

router.post('/add', async(req, res) => {
    await Movie.create({
        name:req.body.movie,
        year: req.body.year,
        description: req.body.desctription                        
    });
    res.redirect('/movies/');
});

router.get('/view',async (req, res) => {
    let id = parseInt (req.query.id);
    let movie = Movie.findOne({
        where: {
            id:req.query.id
        }
    });
    res.render('movies/view.njk', {movie: movie});
});

router.get('/edit/:id', async (req, res) => {
    let movie = await Movie.findOne({
        where: {
            id:req.params.id
        }
    });
    res.render('movies/edit.njk', {movie: movie});
});

router.post('/edit/:id', async (req, res) => {
    await Movie.update({
        name:req.body.movie,
        year: req.body.year,
        description: req.body.desctription                        
    },{
        where: {
            id:req.params.id
        }
    });
    
    res.redirect('/movies/');
});

router.get('/delete/:id', async (req, res) => {
    await Movie.destroy({
        where: {
            id:req.params.id
        }
    });
    res.redirect('/movies/');
});
module.exports = router;
