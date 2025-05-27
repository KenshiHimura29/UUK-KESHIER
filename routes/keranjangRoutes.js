const express = require("express");
const router = express.Router();
const checkSession = require("../middleware/checkSession");
const keranjangController = require("../controllers/keranjangController");

router.get("/", checkSession, keranjangController.getKeranjang);
router.post("/add/:id", checkSession, keranjangController.addToKeranjang);
router.post("/remove/:id", checkSession, keranjangController.removeFromKeranjang);
router.post("/checkout", checkSession, keranjangController.checkoutKeranjang);

module.exports = router;