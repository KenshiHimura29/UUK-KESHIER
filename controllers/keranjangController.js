const Produk = require("../models/produkModel");
const Penjualan = require("../models/penjualanModel");
const DetailPenjualan = require("../models/detailPenjualanModel");

const keranjangController = {
    // Menampilkan keranjang
    getKeranjang: (req, res) => {
        const keranjang = req.session.keranjang || [];
        res.render("keranjang", { keranjang });
    },

    // Menambahkan produk ke keranjang
    addToKeranjang: async (req, res) => {
    const produkId = req.params.id;
    const produk = await Produk.findById(produkId);
    const quantity = parseInt(req.body.quantity);  // Get the quantity from the modal form

    if (!produk) return res.redirect("/produk");

    if (!req.session.keranjang) req.session.keranjang = [];

    // Check if the product is already in the cart
    const existing = req.session.keranjang.find(item => item._id == produkId);

    if (existing) {
        // If the product is already in the cart, check if there's enough stock
        if (existing.jumlah + quantity <= produk.stok) {
            existing.jumlah += quantity;  // Add the specified quantity
        } else {
            return res.send("Stok tidak cukup");
        }
    } else {
        // If the product doesn't exist in the cart, check if there's enough stock
        if (produk.stok >= quantity) {
            req.session.keranjang.push({
                _id: produk._id,
                namaProduk: produk.namaProduk,
                harga: produk.harga,
                foto: produk.foto,
                jumlah: quantity
            });
        } else {
            return res.send("Stok tidak cukup");
        }
    }

    res.redirect("/keranjang");
},


    // Menghapus produk dari keranjang
    removeFromKeranjang: (req, res) => {
        const produkId = req.params.id;
        if (req.session.keranjang) {
            req.session.keranjang = req.session.keranjang.filter(item => item._id != produkId);
        }
        res.redirect("/keranjang");
    },

    // Melakukan checkout dan mengurangi stok produk
    checkoutKeranjang: async (req, res) => {
        try {
            const keranjang = req.session.keranjang || [];
            if (keranjang.length === 0) return res.redirect("/keranjang");

            // Hitung total biaya
            const totalBiaya = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);

            // Buat penjualan baru
            const penjualan = new Penjualan({
                penjualanID: Date.now().toString(),
                tanggalPenjualan: new Date(),
                totalBiaya: totalBiaya,
                pelangganID: req.session.user.id
            });
            await penjualan.save();

            // Simpan detail penjualan dan update stok produk
            for (const item of keranjang) {
                // Kurangi stok produk setelah dibeli
                const produk = await Produk.findById(item._id);
                if (!produk) {
                    return res.status(400).send("Produk tidak ditemukan");
                }

                // Cek jika stok mencukupi
                if (produk.stok >= item.jumlah) {
                    produk.stok -= item.jumlah;
                    await produk.save();

                    // Simpan detail penjualan
                    await new DetailPenjualan({
                        penjualanID: penjualan._id,
                        produkID: item._id,
                        jumlahProduk: item.jumlah,
                        subtotal: item.harga * item.jumlah
                    }).save();
                } else {
                    return res.status(400).send(`Stok tidak cukup untuk produk: ${produk.namaProduk}`);
                }
            }

            // Kosongkan keranjang setelah checkout
            req.session.keranjang = [];

            // Arahkan ke halaman transaksi
            res.redirect("/transaksi");
        } catch (error) {
            console.error("Checkout error:", error);
            res.status(500).send("Terjadi kesalahan saat checkout.");
        }
    }
};

module.exports = keranjangController;
