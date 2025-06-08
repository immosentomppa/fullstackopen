import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons';
import PersonForm from './components/PersonForm'
import personsService from './services/persons'
import Notification from './components/Notification'

import './index.css'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personFilter, setPersonFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addNumber = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        personsService
          .update(existingPerson.id, personObject)
          .then(response => {
            personsService.getAll().then(freshPersons => setPersons(freshPersons))

            setNewNumber('')
            setNewName('')
            setNotificationMessage(
              `Added ${newName}`
            )
            setNotificationType('success')
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType(null)
            }, 5000)
          })
          .catch(error => {
            personsService.getAll().then(freshPersons => setPersons(freshPersons))
            setNewNumber('')
            setNewName('')
            setNotificationMessage(
              `Information of ${newName} has already been removed from server`
            )
            setNotificationType('error')
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType(null)
            }, 5000)
          })
      }
    } else {
      personsService
        .create(personObject)
          .then(response => {
            personsService.getAll().then(freshPersons => setPersons(freshPersons))
            setNewNumber('')
            setNewName('')
            setNotificationMessage(
              `Added ${newName}`
            )
            setNotificationType('success')
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType(null)
            }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handlePersonFilterChange = (event) => {
      setPersonFilter(event.target.value)
  }

  const handleDelete = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          alert(`Information of ${persons.find(person => person.id === id).name} has already been removed from server`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(personFilter.toLowerCase())
  )


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter 
        personFilter={personFilter}
        handlePersonFilterChange={handlePersonFilterChange}
      />
      <h3>Add a new</h3>
      <PersonForm 
        addNumber={addNumber}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        personsToShow={personsToShow}
        handleDelete={handleDelete}
        />
    </div>
  )
}

export default App