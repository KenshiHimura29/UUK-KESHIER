const mongoose = require("mongoose");

const detailPenjualanSchema = new mongoose.Schema({
  penjualanID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Penjualan",
    required: true
  },
  produkID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produk",
    required: true
  },
  jumlahProduk: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("DetailPenjualan", detailPenjualanSchema);
