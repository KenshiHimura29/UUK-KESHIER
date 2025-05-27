const Penjualan = require("../models/penjualanModel");
const DetailPenjualan = require("../models/detailPenjualanModel");
const Produk = require("../models/produkModel");

const transaksiController = {
    beliProduk: async (req, res) => {
        try {
            const produk_id = req.params.id;
            const produk = await Produk.findById(produk_id);

            if (!produk || produk.stok < 1) {
                return res.status(400).send("Stok produk habis atau produk tidak ditemukan");
            }

            // Buat penjualan baru
            const penjualan = new Penjualan({
                penjualanID: Date.now().toString(),
                tanggalPenjualan: new Date(),
                totalBiaya: produk.harga,
                pelangganID: req.session.user.id // pastikan session user punya id pelanggan
            });
            await penjualan.save();

            // Buat detail penjualan
            const detail = new DetailPenjualan({
                penjualanID: penjualan._id,
                produkID: produk._id,
                jumlahProduk: 1,
                subtotal: produk.harga
            });
            await detail.save();

            // Update stok produk
            produk.stok -= 1;
            await produk.save();

            res.redirect('/transaksi/saya');
        } catch (error) {
            console.error('Error adding transaksi:', error);
            res.status(500).send("Internal Server Error");
        }
    },

    getDaftarTransaksi: async (req, res) => {
        try {
            let transaksi = [];
            if (req.session.user.role === "pelanggan") {
                // Ambil transaksi milik pelanggan ini saja
                const penjualanList = await Penjualan.find({ pelangganID: req.session.user.id }).sort({ tanggalPenjualan: -1 });
                for (const penjualan of penjualanList) {
                    const details = await DetailPenjualan.find({ penjualanID: penjualan._id }).populate('produkID');
                    details.forEach(detail => {
                        transaksi.push({
                            produk: detail.produkID
                                ? {
                                    namaProduk: detail.produkID.namaProduk,
                                    foto: detail.produkID.foto,
                                    kategori: detail.produkID.kategori
                                }
                                : null,
                            jumlah: detail.jumlahProduk,
                            total: detail.subtotal,
                            tanggal: penjualan.tanggalPenjualan,
                            status: "selesai",
                            pelanggan: penjualan.pelangganID
                        });
                    });
                }
                res.render('daftarTransaksiPelanggan', { transaksiList: transaksi });
            } else {
                // Admin & petugas: bisa lihat semua transaksi
                const penjualanList = await Penjualan.find().populate('pelangganID').sort({ tanggalPenjualan: -1 });
                for (const penjualan of penjualanList) {
                    const details = await DetailPenjualan.find({ penjualanID: penjualan._id }).populate('produkID');
                    details.forEach(detail => {
                        transaksi.push({
                            nama_produk: detail.produkID ? detail.produkID.namaProduk : '-',
                            jumlah: detail.jumlahProduk,
                            total: detail.subtotal,
                            tanggal: penjualan.tanggalPenjualan,
                            status: "selesai",
                            pelanggan: penjualan.pelangganID && penjualan.pelangganID.namaPelanggan ? penjualan.pelangganID.namaPelanggan : '-'
                        });
                    });
                }
                res.render('daftarTransaksi', {
                    user: req.session.user, // pastikan ini ada!
                    transaksi
                });
            }
        } catch (error) {
            console.error('Error fetching transaksi:', error);
            res.status(500).send("Internal Server Error");
        }
    }
};

module.exports = transaksiController;