const generateLaporanController = require("../controllers/generateLaporanController");
const express = require("express");
const router = express.Router();
const checkSession = require("../middleware/checkSession");

// Jika ingin hanya admin & petugas, bisa tambahkan middleware checkRole
// const checkRole = require("../middleware/checkRole");
// router.get("/pdf", checkSession, checkRole(["admin", "petugas"]), generateLaporanController.getDaftarTransaksiPDF);

router.get("/pdf", checkSession, generateLaporanController.getDaftarTransaksiPDF);

module.exports = router;