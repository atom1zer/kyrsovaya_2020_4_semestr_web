
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const process = require('process')
const db = require('./queries')
const port = process.env.port || 8083
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(cors())
require('./routes')(app)
app.listen(port, () => {
    console.log(`Your port is ${port}`)
    db.createTables()
})

app.use('/src/js', express.static('js'));//
app.use('/src/js', express.static('css'));//


app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/log.html');
  });
  
  app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/reg.html');
  });

  app.post('/login', function(req, res) {
    users.findOne({ where: {login: req.body.login, password: req.body.password } }).then(users => {
      if(users) res.send("Найдено");
      else res.send("Не найдено");
    }).catch(error => {
      console.log(error);
    });
  });


