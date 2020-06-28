const Pool = require('pg').Pool
const jwt = require('jsonwebtoken')
const config = require('./config/config')
const { response } = require('express')
const { reset } = require('nodemon')
function jwtSignUser (user) {

return jwt.sign(user, config.authentication.jwtSecret, {
expiresIn: 604800
})
}
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'my_project',
password: '',
port: 5432
})
const createTables = () => {
const queryText =
`CREATE SEQUENCE IF not EXISTS users_id_seq START 1;
CREATE TABLE IF NOT EXISTS
users(
id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
email varchar COLLATE pg_catalog."default" NOT NULL,
password varchar COLLATE pg_catalog."default" NOT NULL,
login text COLLATE pg_catalog."default",
"IsAdmin" boolean,
statistics integer DEFAULT 0 ,
CONSTRAINT users_pkey PRIMARY KEY (id),
CONSTRAINT constraintname UNIQUE (login)
,
CONSTRAINT users_email_key UNIQUE (email)

);
CREATE SEQUENCE IF NOT EXISTS quizzes_QuizId_seq START 1;
CREATE TABLE IF NOT EXISTS 
quizzes(
quiz_id bigint NOT NULL DEFAULT nextval('quizzes_QuizId_seq'::regclass),
quizname text COLLATE pg_catalog."default" NOT NULL,
author_id integer,
author_name text,
questions text COLLATE pg_catalog."default" NOT NULL,
incorrect_answers text[] COLLATE pg_catalog."default",
correct_answers text COLLATE pg_catalog."default",
CONSTRAINT quizzes1_pkey PRIMARY KEY (quiz_id),
CONSTRAINT qq FOREIGN KEY (author_name)
REFERENCES public.users (login) MATCH SIMPLE,
CONSTRAINT kk FOREIGN KEY (author_id)
REFERENCES public.users (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
NOT VALID
);
CREATE SEQUENCE IF NOT EXISTS results_resultId_seq START 1;
CREATE TABLE IF NOT EXISTS
results(
resultId bigint NOT NULL DEFAULT nextval('results_resultId_seq'::regclass),
user_id bigint,
quiz_id integer,
correctcount integer,
correct text COLLATE pg_catalog."default",
CONSTRAINT results1_pkey PRIMARY KEY (resultId),
CONSTRAINT quiz FOREIGN KEY (quiz_id)
REFERENCES public.quizzes (quiz_id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
NOT VALID,
CONSTRAINT usertakingtest FOREIGN KEY (user_id)
REFERENCES public.users (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
NOT VALID
)`

pool.query(queryText)
.then((res) => {
console.log(res)
})
.catch((err) => {
console.log(err)
})
}
const getUsers = (req, res) => {
pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
if (error) {
throw error
}
res.status(200).json(results.rows)
})
}
const getQuizzes = (req, res) => {
pool.query('SELECT * FROM quizzes', (error, results) => {
if (error) {
  
throw error
}

let quiz = (results.rows)
  res.send({
  status: true,
  quiz:quiz
  }
  
  )
})
}
const getQuizById = (req, res) => {
const id = req.params.id
pool.query(`SELECT * FROM quizzes WHERE quiz_id = $1`, [id], (error, results) => {
if(error) {
throw error
}
return res.status(200).json(results.rows[0])
})
}
const getQuizByAuthor = (req, res) => {
const id = req.params.id
pool.query(`SELECT * FROM quizzes WHERE author_id = $1`, [id], (error, results) => {
if(error) {
throw error
}
return res.status(200).json(results.rows)
})
}
const createQuiz = (req, res) => {
const {quizname, author_id, author_name,questions, incorrect_answers, correct_answers} = req.body
pool.query('INSERT INTO quizzes (quizname, author_id,author_name,questions, incorrect_answers, correct_answers) VALUES ($1, $2, $3, $4, $5, $6)',
[quizname, author_id,author_name, questions, incorrect_answers, correct_answers], (error, results) => {
if(error) {
res.status(400).send({
error:error
})
}
else {
  var a = results.rows
  
res.send({status: a[0]+" "})
}
})
}
const createResult = (req, res) => {
const {userID, quizID, correctCount, correct} = req.body

 pool.query("SELECT user_id = $1 FROM results WHERE quiz_id = $2", [userID, quizID], (error, results) => {//Ban
 if(error){
   res.status(500).send({
     error: 'Server error'
   })
 }
 if(results.rows[0]){
  console.log("ЕСТЬ ЗАПИСЬ!!!!!!!!!");
  res.send({
    BAN: false
    // status: false
  })

 }
 else{
  console.log("НЕТ ЗАПИСИ!!!!!!!!!");
  pool.query('INSERT INTO results (user_id, quiz_id, correctCount, correct) VALUES ($1, $2, $3, $4)', [userID, quizID, correctCount, correct], (error, results) => {
    if(error) {
    res.status(400).send({
    error: error
    })
    }
    else {
      
      var resul, tru;
      resul = pool.query("SELECT correct FROM results WHERE quiz_id = $1", [quizID]);
      resul.then((response) => {
  
        
        var m = response.rows[0].correct;
  
        tru =  pool.query("SELECT correct_answers FROM quizzes WHERE quiz_id = $1", [quizID]);
        tru.then((response) => {
          
  
          var d = response.rows[0].correct_answers;
          if (m == d) {
            var b = results.rows
            console.log(m);
        res.send({status: true, t: m+" Вы ответили правильно на вопрос!!!"})
        console.log(resul.correct + "\n" + tru.correct_answers);
  
            pool.query("UPDATE users SET statistics = statistics + 1 WHERE id = $1", [userID]);
            if(error) {
              res.status(400).send({
              error: error
              })
              }
            
          }
          else{
            
            console.log(b);
        res.send({BAN: true, f: m+" Неправильный ответ!!!"})
          }
        
     });     
   });
  
      }
    })
  }
  //}
  /*}*/
});
  }
  const getUserById = (req, res) => {
  const id = parseInt(req.params.id)
  pool.query(`SELECT * FROM users WHERE id = $1`, [id], (error, results) => {
  if (error) {
  throw error
  }
  res.send(results.rows[0])
  })
  }
  const getResByUser = (req, res) => {
  const id = parseInt(req.params.id)
  pool.query('SELECT * FROM results WHERE user_id = $1', [id], (error, results) => {
  if (error) {
  throw error
  }
  res.send(results.rows)
  })
  }
  const getResById = (req, res) => {
  const id = parseInt(req.params.id)
  pool.query(`SELECT * FROM results WHERE quiz_id = $1`, [id], (error, results) => {
  if (error) {
  throw error
  }
  res.send(results.rows)
  })
  }
  const getUserByInput = (req, res) => {
  const {email, password} = req.body
  pool.query(`SELECT id FROM users WHERE email = $1 and password = $2`, [email, password], (error, results) => {
  if (error) {
  res.status(500).send({
  error: 'Server error'
  })
  }
  if (!results.rows[0]) {
  return res.status(400).send({
  status: false, //добавил статус авторизации(неуспешной)
  error: 'Incorrect input'
  })
  }
  else {
  pool.query(`SELECT * FROM users WHERE id = $1`, [results.rows[0].id], (error, results) => {
  const resJson = results.rows[0]
  let data = {user:resJson, token:jwtSignUser(resJson)} //переделал форму
  res.send({
  status: true, //добавил статус для авторизации(успешной)
  data:data
  
  })
  })
  }
  })
  }
  const createUser = (req, res) => {
  const {email,login, password} = req.body
  pool.query('INSERT INTO users (email, login, password) VALUES ($1, $2, $3)', [email, login, password], (error, results) => {
  if(error) {
  res.status(400).send({
  status: false,
  //error: error//'This email or login already exists'
  
  })
  }
  else {
  res.status(201).send(`User added with ID: ${results.rows[0]}`)
  }
  })
  }
  const updateQuiz = (req, res) => { 
  const id = parseInt(req.params.id)
  const { quizname, questions, incorrect_answers, correct_answers } = req.body
  
  pool.query(
    'UPDATE quizzes SET quizname = $1, questions = $2, incorrect_answers = $3, correct_answers = $4 WHERE quiz_id = $5',
  [quizname, questions, incorrect_answers, correct_answers, id],
  (error, results) => {
  if (error) {
  throw error
  }
  res.status(200).send(`User modified with ID: ${id} ${results.rows}`)
  }
  )
  }
  const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { email, password } = request.body
  
  pool.query(
  'UPDATE users SET email = $1, password = $2 WHERE id = $3',
  [email, password, id],
  (error, results) => {
  if (error) {
  throw error
  }
  response.status(200).send(`User modified with ID: ${id} ${results.rows}`)
  }
  )
  }
  const deleteResults = (request, response) => {
  const id = parseInt(request.params.id)
  console.log(id)
  pool.query('DELETE FROM results WHERE quiz_id = $1', [id], (error, results) => {
  if (error) {
  throw error
  }
  response.status(200).send(`Result deleted with ID: ${id} ${results.rows}`)
  })
  }
  const deleteQuiz = (request, response) => {
  const id = parseInt(request.params.id)
  console.log(id)
  pool.query('DELETE FROM quizzes WHERE quiz_id = $1', [id], (error, results) => {
  if (error) {
  throw error
  }
  response.status(200).send(`Quiz deleted with ID: ${id} ${results.rows}`)
  })
  }
  const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)
  
  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
  if (error) {
  throw error
  }
  response.status(200).send(`User deleted with ID: ${id} ${results.rows}`)
  })
  }

  const getQuestionsById = (req, res) => { //Для получения вопроса для определенного теста из базы
    const id = req.params.id
    pool.query(`SELECT questions FROM quizzes WHERE quiz_id = $1`, [id], (error, results) => {
    if(error) {
    throw error
    }
    return res.status(200).json(results.rows)
    })
    }

    const getAnswersById = (req, res) => { //Для получения вариантов ответов из базы
      const id = req.params.id
      pool.query(`SELECT incorrect_answers FROM quizzes WHERE quiz_id = $1`, [id], (error, results) => {
      if(error) {
      throw error
      }
      return res.status(200).json(results.rows)
      })
      }

      const getCorrectAnswersById = (req, res) => { //Для получения правильного ответа из базы
        const id = req.params.id
        pool.query(`SELECT correct_answers FROM quizzes WHERE quiz_id = $1`, [id], (error, results) => {
        if(error) {
        throw error
        }
        return res.status(200).json(results.rows)
        })
        }

        const createStat = (req, res) => {
          pool.query("SELECT login,statistics FROM users ORDER BY statistics DESC LIMIT 5 ", (error, results) => {

            if(error) {
              res.status(400).send({
              error: error
              })
              }

              let stat = (results.rows)
              console.log(stat)
              res.send({
                
                stat:stat
                
                }
                
                )
          })
        }

  const Prime = (req, res) => {
  const input = req.body.text
  var output = 'Prime numbers: '
  let i, j
  var count = 0
  for (i = 2; i <= parseInt(input); i++) {
  var prime = true
  var root = Math.sqrt(i)
  for (j = 1; j <= root; j++) {
  if (i % j === 0) {
  count++
  if (count > 1) {
  prime = false
  }
  }
  }
  count = 0
  if (prime) {
  output = output + '\t' + i
  }
  }
  res.status(200).send(`${output}`)
  }
  module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByInput,
Prime,
createTables,
getQuizById,
getQuizzes,
createQuiz,
getQuizByAuthor,
createResult,
updateQuiz,
deleteQuiz,
deleteResults,
getResById,
getResByUser,
getQuestionsById,
getAnswersById,
getCorrectAnswersById,
createStat
}
//const Promise = require('bluebird')
//id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass) PRIMARY KEY,
// email character varying(30) COLLATE pg_catalog."default" NOT NULL UNIQUE,
// login character varying(30) COLLATE pg_catalog."default" NOT NULL UNIQUE,
// password character varying(15) COLLATE pg_catalog."default" NOT NULL
//const bcrypt = Promise.promisifyAll(reqire('bcrypt-nodejs'))