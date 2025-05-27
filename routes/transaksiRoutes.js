const transaksiController = require("../controllers/transaksiController");
const express = require("express");
const router = express.Router();
const checkSession = require("../middleware/checkSession");

router.get("/beli/:id", checkSession, transaksiController.beliProduk);
router.get("/saya", checkSession, transaksiController.getDaftarTransaksi); // Tambahkan ini
router.get("/", checkSession, transaksiController.getDaftarTransaksi);

module.exports = router;