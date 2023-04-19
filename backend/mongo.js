// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;

// const password = process.argv[2];

// const url = `mongodb+srv://fullstack:${password}@cluster0.q2nitlj.mongodb.net/phonebook?retryWrites=true&w=majority`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// const personSchema = new Schema({
//   name: String,
//   number: String,
// });

// const Person = model("Person", personSchema);

// const person = new Person({
//   name: process.argv[3],
//   number: process.argv[4],
// });

// if (process.argv.length > 3) {
//   person.save().then((res) => {
//     console.log(`added ${res.name} number ${res.number} to phonebook`);
//     mongoose.connection.close();
//   });
// }

// if (process.argv.length === 3) {
//   Person.find({}).then((res) => {
//     console.log("phonebook:");
//     res.forEach((person) => {
//       console.log(`${person.name} ${person.number}`);
//     });
//     mongoose.connection.close();
//   });
// }
