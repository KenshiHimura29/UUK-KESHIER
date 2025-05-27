const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const Penjualan = require("../models/penjualanModel");
const DetailPenjualan = require("../models/detailPenjualanModel");
require("../models/pelangganModel");
const Handlebars = require("handlebars");

Handlebars.registerHelper("inc", function(value) {
    return parseInt(value) + 1;
});

const generateLaporanController = {
    getDaftarTransaksiPDF: async (req, res) => {
        try {
            let transaksi = [];
            let templatePath = "";
            
            // Ambil data transaksi sesuai dengan peran pengguna (pelanggan atau admin)
            if (req.session.user.role === "pelanggan") {
                // Fetch the customer's transactions
                const penjualanList = await Penjualan.find({ pelangganID: req.session.user.id }).sort({ tanggalPenjualan: -1 });
                for (const penjualan of penjualanList) {
                    const details = await DetailPenjualan.find({ penjualanID: penjualan._id }).populate('produkID');
                    details.forEach(detail => {
                        if (detail.produkID) {
                            transaksi.push({
                                nama_produk: detail.produkID.namaProduk,
                                jumlah: detail.jumlahProduk,
                                total: detail.subtotal,
                                tanggal: penjualan.tanggalPenjualan.toLocaleDateString('id-ID'),
                                status: "selesai"
                            });
                        }
                    });
                }

                // Use a different template for customer
                templatePath = path.join(__dirname, "../template/templateTransaksiPelangganPDF.html");
            } else {
                // Fetch all transactions for admin or petugas
                const penjualanList = await Penjualan.find().sort({ tanggalPenjualan: -1 }).populate('pelangganID', 'nama');
                for (const penjualan of penjualanList) {
                    const details = await DetailPenjualan.find({ penjualanID: penjualan._id }).populate('produkID');
                    details.forEach(detail => {
                        if (detail.produkID) {
                            transaksi.push({
                                nama_produk: detail.produkID.namaProduk,
                                jumlah: detail.jumlahProduk,
                                total: detail.subtotal,
                                tanggal: penjualan.tanggalPenjualan.toLocaleDateString('id-ID'),
                                status: "selesai",
                                pelanggan: penjualan.pelangganID?.nama || "-"
                            });
                        }
                    });
                }

                // Use a different template for admin
                templatePath = path.join(__dirname, "../template/templateTransaksiAdminPDF.html");
            }

            // Read the correct HTML template based on the role
            const html = fs.readFileSync(templatePath, "utf8");

            const document = {
                html: html,
                data: { transaksi },
                path: "./output/daftar_transaksi.pdf"
            };

            // Create the PDF
            await pdf.create(document);

            // Send the generated PDF to the client
            res.download("./output/daftar_transaksi.pdf", "daftar_transaksi.pdf", (err) => {
                if (err) {
                    console.error("Download error:", err);
                }
                // Optionally delete the generated file after download
                // fs.unlinkSync("./output/daftar_transaksi.pdf");
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
            res.status(500).send("Gagal membuat PDF");
        }
    }
};

module.exports = generateLaporanController;
