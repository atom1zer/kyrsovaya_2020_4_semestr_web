
const db = require('./queries')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
module.exports = (app) => {
    app.post('/register', AuthenticationControllerPolicy.register, db.createUser
    )
    app.get('/', (req, res) => {
        res.json({ info: 'application is running'})
    })
    app.get('/users', db.getUsers)
    app.get('/users/:id', db.getUserById)
    app.post('/users', db.createUser)
    app.put('/users/:id', db.updateUser)
    app.delete('/users/:id', db.deleteUser)
    app.post('/login', db.getUserByInput)
    app.post('/prime', db.Prime)
    app.get('/quiz/:id', db.getQuizById)
    app.get('/quiz', db.getQuizzes)
    app.post('/createquiz', db.createQuiz)
    app.get('/author/:id', db.getQuizByAuthor)
    app.post('/result', db.createResult)
    app.put('/quiz/:id', db.updateQuiz)
    app.delete('/quiz/:id', db.deleteQuiz)
    app.delete('/result/:id', db.deleteResults)
    app.get('/result/:id', db.getResById)
    app.get('/userRes/:id', db.getResByUser)
    app.get('/question/:id', db.getQuestionsById) //Добавил 1
    app.get('/answers/:id', db.getAnswersById) //Добавил 2
    app.get('/correct_answers/:id', db.getCorrectAnswersById)
    app.get('/statistics', db.createStat)


}
