import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import Persons from "./components/Persons.js";
import PersonForm from "./components/PersonForm";
import * as phonebook from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [resolve, setResolve] = useState(true);

  const initPersons = () => {
    phonebook.getAll().then((initPersons) => setPersons(initPersons));
  };

  useEffect(initPersons, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPersonObj = {
      name: newName,
      number: newNumber,
    };

    const personMatch = persons.find((person) => person.name === newName);

    if (personMatch) {
      if (
        window.confirm(
          `${personMatch.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        phonebook
          .changeNumber(personMatch.id, newPersonObj)
          .then({ initPersons });
      }
      return;
    }

    phonebook.addPerson(newPersonObj).then((newPerson) => {
      setPersons([...persons, newPerson]);
      setNotificationMsg(`Added ${newPersonObj.name}`);
      setResolve(true);
      setNewName("");
      setNewNumber("");

      setTimeout(() => setNotificationMsg(null), 5000);
    });
  };

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`))
      phonebook
        .removePerson(person.id)
        .then(initPersons)
        .catch((err) => {
          setNotificationMsg(
            `Information of ${person.name} has already been removed from the server`
          );
          setResolve(false);
          setTimeout(() => setNotificationMsg(null), 5000);
        });
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearchChange = (e) => {
    setNewSearch(e.target.value.toLowerCase());
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification msg={notificationMsg} resolve={resolve} />
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h1>Numbers</h1>
      <Persons
        persons={persons}
        newSearch={newSearch}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
