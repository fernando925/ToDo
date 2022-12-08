const express = require('express')
const mongoose = require('mongoose')
const Task = require('./task.controller')
const app = express()
const { Auth, isAuthenticated } = require('./auth.controller')
const port = process.env.PORT || 3000

console.log(process.env.PORT)

mongoose.connect(process.env.SECRET_LINK)

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
