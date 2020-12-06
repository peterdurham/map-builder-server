const { Schema, model } = require("mongoose");

const MapScehma = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  locations: [{ name: String, locationtype: String, notes: String, lng: Number, lat: Number }],
  share: {
    type: Boolean,
    required: true,
  }
});

module.exports = model("maps", MapScehma);
