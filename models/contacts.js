// const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const handleMongooseError = require("../utils/handleMongooseError");
const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.post("save", handleMongooseError);

const Contacts = model("contacts", schema);

module.exports = Contacts;
