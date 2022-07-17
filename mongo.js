const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://rin:${password}@cluster0.7y4ch.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });
    return person.save();
  })
  .then(() => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to the phonebook`
    );
    Person.find({}).then((results) => {
      results.forEach((person) => {
        console.log(person);
      });
      mongoose.connection.close();
    });
  });
// .then((result) => {
//   console.log("connected");

//   const person = new Person({
//     name: "Promises supremacy",
//     number: new Date(),
//   });

//   return person.save();
// })
// .then(() => {
//   console.log("person saved!");
//   return mongoose.connection.close();
// })
// .catch((err) => console.log(err));

// Person.find({}).then((res) => {
//   res.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });
