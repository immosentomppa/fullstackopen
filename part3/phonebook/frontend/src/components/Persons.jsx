const Persons = ({personsToShow, handleDelete}) => {
    return (
    <div>
        {personsToShow.map((person) => (
          <div key={person.name}>{person.name} {person.number} <button type="button" onClick={() => handleDelete(person.id)}>delete</button></div>
        ))}
    </div>
    )
}

export default Persons