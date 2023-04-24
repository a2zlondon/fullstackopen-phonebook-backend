const express = require('express')
const morgan = require('morgan')

const cors = require('cors')
const app = express()


app.use(cors())
app.use(express.json())

morgan.token('req-body', function (req, res) {
    const body = JSON.stringify(req.body)
    return body
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const ranId = Math.floor(Math.random() * 10000)
    if(persons.filter(person => person.id !== ranId))
        return ranId
}

app.post('/api/persons', (request, response) => {

    const body = request.body

    if ((!body.name)||(!body.number)) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info', (req, res) => {
    let serverDate = new Date();
    res.send(`<div>Phonebook has info for ${persons.length} people</div><div>${serverDate}</div>`)
})

app.get('/api/persons', (req, res) => {
    // console.log('%cindex.js line:71 MORGAN', 'color: #007acc;', req);
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.statusMessage = "person ID found";
        response.json(person)
    } else {
        response.statusMessage = "person ID not found";
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})