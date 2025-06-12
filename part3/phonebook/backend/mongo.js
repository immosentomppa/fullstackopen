const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]
const phoneNumber = process.argv[4]

const url = `mongodb+srv://fullstackopen:${password}@phonebook-cluster.kvnfmc1.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook-cluster`

mongoose.set('strictQuery',false)

mongoose.connect(url)


const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (name && phoneNumber) {
  const person = new Person({
    name: name,
    number: phoneNumber
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(persons => {
      console.log(`${persons.name} ${persons.number}`)
    })
    mongoose.connection.close()
  })
}