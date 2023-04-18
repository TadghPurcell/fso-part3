import Person from "./Person";

const Persons = ({ persons, newSearch, deletePerson }) => {
  const printFilteredPersons = persons
    .map((person) => {
      console.log(person);
      return [person.name, person.number];
    })
    .filter((person, _, array) => {
      console.log(array);
      return person[0].toLowerCase().includes(newSearch);
    })
    .map((person) => (
      <Person
        name={person[0]}
        number={person[1]}
        key={person[0]}
        handleClick={() => deletePerson(person)}
      />
    ));

  const printPersons = persons.map((person) => (
    <Person
      name={person.name}
      number={person.number}
      key={person.name}
      handleClick={() => deletePerson(person)}
    />
  ));

  return newSearch ? printFilteredPersons : printPersons;
};

export default Persons;
