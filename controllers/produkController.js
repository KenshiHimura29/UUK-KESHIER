const Produk = require('../models/produkModel');
const path = require('path');
const fs = require('fs');

const produkController = {
    getDaftarProduk: async (req, res) => {
        try {
            const produkList = await Produk.find();
            res.render('daftarProduk', { produkList });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Error fetching products', error });
        }
    },
    getTambahProduk: (req, res) => {
        try {  
            res.render('formTambahProduk');
        } catch (error) {
            console.error('Error rendering add product page:', error);
            res.status(500).send("Error rendering add product page");
        }
    },
    tambahProduk: async (req, res) => {
        try {
            const { namaProduk, kategori, harga, stok } = req.body;
            const foto = req.file ? req.file.filename : null;

            const newProduk = new Produk({
                produkID: Date.now().toString(),
                namaProduk,
                kategori,
                harga,
                stok,
                foto
            });

            await newProduk.save();
            res.redirect('/produk');
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).send("Error adding product");
        }
    },

    getEditProduk: async (req, res) => {
        try {
            const produkID = req.params.id;
            const produk = await Produk.findById(produkID);
            res.render('formEditProduk', { produk });
        } catch (error) {
            console.error('Error fetching product for edit:', error);
            res.status(500).send("Error fetching product for edit");
        }
    },

    editProduk: async (req, res) => {
        try {
            const produkID = req.params.id;
            const { namaProduk, kategori, harga, stok } = req.body;
            const foto = req.file ? req.file.filename : null;

            const produk = await Produk.findById(produkID);
            if (!produk) {
                return res.status(404).send("Product not found");
            }

            // Jika ada file foto baru, hapus foto lama dan update foto
            if (foto) {
                if (produk.foto) {
                    const oldFotoPath = path.join(__dirname, '../public/img', produk.foto);
                    if (fs.existsSync(oldFotoPath)) {
                        fs.unlinkSync(oldFotoPath);
                    }
                }
                produk.foto = foto;
            }

            produk.namaProduk = namaProduk || produk.namaProduk;
            produk.kategori = kategori || produk.kategori;
            produk.harga = harga || produk.harga;
            produk.stok = stok || produk.stok;

            await produk.save();
            res.redirect('/produk');
        } catch (error) {
            console.error('Error editing product:', error);
            res.status(500).send("Error editing product");
        }   
    },

    deleteProduk: async (req, res) => {
        try {
            const produkID = req.params.id;
            const produk = await Produk.findById(produkID);

            if (!produk) {
                return res.status(404).send("Product not found");
            }

            if (produk.foto) {
                const fotoPath = path.join(__dirname, '../public/img', produk.foto);
                if (fs.existsSync(fotoPath)) {
                    fs.unlinkSync(fotoPath);
                }
            }

            await Produk.findByIdAndDelete(produkID);

            res.redirect('/produk');
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).send("Error deleting product");
        }
    },

    getDaftarProdukPelanggan: async (req, res) => {
        try {
            const produkList = await Produk.find();
            res.render('daftarProdukPelanggan', { produkList });
        } catch (error) {
            console.error('Error fetching products for customer:', error);
            res.status(500).json({ message: 'Error fetching products for customer', error });
        }
    },
};

module.exports = produkController;