const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const fullname = process.argv[3]
const fullnumber = process.argv[4]

const url = `mongodb+srv://fullstackopen:${password}@fullstackopen-phonebook.jyrvi41.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personSchema)

if (!fullname && !fullnumber) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: fullname,
    number: fullnumber,
  })
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
