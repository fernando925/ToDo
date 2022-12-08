const express = require('express')
const mongoose = require('mongoose')
const Task = require('./task.controller')
const app = express()
const { Auth, isAuthenticated } = require('./auth.controller')
const port = process.env.PORT || 3000

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kqg0zsw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)

app.use(express.json())


app.get('/tasks', isAuthenticated, Task.list)
app.post('/tasks', isAuthenticated,Task.create)
app.put('/tasks/:id', isAuthenticated, Task.update)
app.patch('/tasks/:id', isAuthenticated, Task.update)
app.delete('/tasks/:id', isAuthenticated, Task.destroy)

app.post('/login',Auth.login)
app.post('/register',Auth.register)


app.use(express.static('app'))

app.use(express.static(`${__dirname}/public`))

app.get('/', (req,res)=>{
	res.sendFile(`${__dirname}/public/index.html`)
})

app.get('*', (req,res)=>{
	res.status(404).send('esta pagina no existe')
})

app.listen(port, () => {
	console.log('Arrancando la appppp')
})
