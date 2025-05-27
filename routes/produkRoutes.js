const produkController = require('../controllers/produkController');
const express = require("express");
const router = express.Router();
const checkSession = require("../middleware/checkSession");
const uploadImage = require("../middleware/uploadImage");

router.get("/", checkSession, produkController.getDaftarProduk);

router.get("/pelanggan", checkSession, produkController.getDaftarProduk);

router.get("/tambah", checkSession, produkController.getTambahProduk);

router.get("/edit/:id", checkSession, produkController.getEditProduk);

router.post("/tambah", checkSession, uploadImage.single("foto"), produkController.tambahProduk);

router.post("/edit/:id", checkSession, uploadImage.single("foto"), produkController.editProduk);

router.post("/delete/:id", checkSession, produkController.deleteProduk); // perbaiki di sini

module.exports = router;