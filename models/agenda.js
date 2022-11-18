const mongoose = require("mongoose");
const url = process.env.MONGOURL;

mongoose
  .connect(url)
  .then((result) => console.log("connected to mongoDB"))
  .catch((error) => console.log("error connecting to mongoDB", error.message));

const agendaSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
  },
  number: Number,
});

agendaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Users", agendaSchema);
