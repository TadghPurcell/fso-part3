import axios from "axios";

const baseURL = "/api/persons";

const getAll = () => axios.get(baseURL).then((res) => res.data);

const addPerson = (newPersonObj) =>
  axios.post(baseURL, newPersonObj).then((res) => res.data);

const removePerson = (id) =>
  axios.delete(`${baseURL}/${id}`).then((res) => res.data);

const changeNumber = (id, newPersonObj) =>
  axios.put(`${baseURL}/${id}`, newPersonObj).then((res) => res.data);

export { addPerson, changeNumber, getAll, removePerson };
