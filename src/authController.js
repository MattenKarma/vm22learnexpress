const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/User.js');

router.get('/register',async (req, res) => {
res.render('auth/register.njk')
});

router.post('/register',async (req, res) => {
    let user = await User.findOne({
        were: {
            email: req.body.email
        }
    }); 
   if(req.body.password !== req.body.password_confirm || user){
    res.redirect('/register');
   } else{
     User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,12)
     });
     res.redirect('/');
   }
    });
    router.get('/login',async (req, res) => {
        res.render('auth/login.njk')
        });
        

    router.post('/login', async (req, res) =>{
        let user = await User.findOne({
            were: {
        
                email: req.body.email
            }
    });
    console.log(user, bcrypt.compareSync(req.body.password, user.password))
    if(!user || !bcrypt.compareSync(req.body.password, user.password)){
        res.redirect('/login');
    }else {
        req.session.user = user;
        req.session.save(function err(){
            console.log(req.session.user);
            res.redirect('/');
        });
       
    }
});
router.get('/logout', async (req, res) => {
    req.session.user = null,
    req.session.save(function err(){
        res.redirect('/');   
    });

});

module.exports = router;

