const express = require('express');
const nunjucks = require('nunjucks')
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const {Movie, User} = require('./models/index.js');
const fileUpload = require('express-fileupload')
app.use(fileUpload())

app.use(cookieParser());

app.use(express.static('public'));

const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.use(session({
  store: new FileStore(),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(express.urlencoded({
  extended:true
}));


const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.use((req, res, next) =>{
env.addGlobal('user', req.session.user);
env.addGlobal('errors', req.session.errors);
req.session.errors = null;
req.session.save();
next();
});

app.get('/', async (req, res) => {
  let pageCount = 8
  let page = parseInt(req.query.page ?? 1);
  let offset = (page-1) * pageCount
  const movies = await Movie.findAll({limit: pageCount, offset: offset});
  let count = await Movie.count();
  let pages= Math.ceil(count/pageCount);
  let elements = [];
  for(let i = 1; i<3; i++){
    elements[i] = i;
  }
  if(page>2){
  elements.push('...');
  }
  if(page< page-2){
    elements.push('...')
  };

  for(let i = page-2; i<=page+2 && i<=pages && i>0; i++){
    elements[i]= i;
  }
  elements.push('...');
  for(let i = pages-2; i<=pages; i++){
    elements[i]= i;
  }
  elements = elements.filter(e => e);
  console.log(elements)
  res.render('index.njk', {movies, elements, page, pages});
  //console.log('somebody visited');
});

app.get('/page2', (req, res) => {
    res.render ('page2.njk');
});

app.get('/form', (req, res) => {
  console.log(req.query);
  res.render ('form.njk', req.query);
});


app.get('/circle', (req, res) => {
  console.log(req.query);
  res.render ('circle.njk', req.query);
});

app.post('/circle', (req, res) => {
  let area = Math.PI * req.body.radius * req.body.radius;
  let diameter = 2 * Math.PI * req.body.radius;
  let volume = 4/3 * Math.PI * req.body.radius * req.body.radius * req.body.radius;
  res.render('circleAnswer.njk',{r: req.body.radius, a: area, d: diameter, v: volume });
});

const movieController = require('./src/movieController.js')
app.use('/movies', movieController)

app.get('/cookie',(req, res) =>{
  res.cookie('mycookie','cool cookie', {maxAge: 1000*60*60*24*30});
  if(!req.session.secretValie){

  }
    res.send(req.cookies);
    req.session.secretValue = 'shhhh'
});

const authController = require('./src/authController.js');
app.use(authController);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});