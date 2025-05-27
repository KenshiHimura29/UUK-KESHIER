const mongoose = require("mongoose");

const penjualanSchema = new mongoose.Schema({
  penjualanID: {
    type: String,
    required: true,
    unique: true
  },
  tanggalPenjualan: {
    type: Date,
    required: true
  },
  totalBiaya: {
    type: Number,
    required: true
  },
  pelangganID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pelanggan",
    required: true
  }
});

module.exports = mongoose.model("Penjualan", penjualanSchema);
