const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config();
const Person = require('./models/person')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('req-body', function (req, res) {
    const body = JSON.stringify(req.body)
    return body
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/info', (request, response) => {
    let serverDate = new Date();
    Person.find({}).then(persons => {
        response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${serverDate}</div>`)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if ((!body.name)||(!body.number)) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        person.deleteOne().then(persons => { response.send(`deleted ${person.name}`); response.status(204).end() })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})