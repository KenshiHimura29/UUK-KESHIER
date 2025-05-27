const mongoose = require("mongoose");

const produkSchema = new mongoose.Schema({
  produkID: {
    type: String,
    required: true,
    unique: true
  },
  namaProduk: {
    type: String,
    required: true
  },
  kategori: {
    type: String,
    required: true
  },
  harga: {
    type: Number,
    required: true
  },
  stok: {
    type: Number,
    default: 0,
    required: true
  },
  foto: {
    type: String
  }
});

module.exports = mongoose.model("Produk", produkSchema);
