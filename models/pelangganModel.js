const mongoose = require("mongoose");

const pelangganSchema = new mongoose.Schema({
  pelangganID: {
    type: String,
    required: true,
    unique: true
  },
  namaPelanggan: {
    type: String,
    required: true
  },
  alamat: {
    type: String,
    required: true
  },
  nomorTelepon: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Pelanggan", pelangganSchema);
