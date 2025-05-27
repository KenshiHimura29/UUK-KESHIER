const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const authController = {
    getRegister: (req, res) => {
        res.render('register');
    },

    getLogin: (req, res) => {
        res.render('login');
    },

    register: async (req, res) => {
        try {
        const { nama, alamat, telepon, username, password } = req.body;

        const existingUser = await User.findOne({ "akun.username": username });
        if (existingUser) {
            return res.status(400).send("Username sudah digunakan");
        }

        const existingTelepon = await User.findOne({ telepon: telepon }); // <-- perbaikan di sini
        if (existingTelepon) {
            return res.status(400).send("Nomor telepon sudah digunakan");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            nama,
            alamat,
            telepon,
            akun: {
            username,
            password: hashedPassword,
            role: "admin", // <-- default role pelanggan
            },
        });

        await newUser.save();
        res.redirect("/auth/login");
        } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan saat registrasi");
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ "akun.username": username });
            if (!user) {
                return res.status(400).send("Username atau password salah");
            }

            const isMatch = await bcrypt.compare(password, user.akun.password);
            if (!isMatch) {
                return res.status(400).send("Username atau password salah");
            }

            req.session.user = {
                id: user._id,
                username: user.akun.username,
                role: user.akun.role,
            };
            
            if (user.akun.role === "admin") {
                return res.redirect("/produk");
            } else if (user.akun.role === "petugas") {
                return res.redirect("/produk");
            } else if (user.akun.role === "pelanggan") {
                return res.redirect("/produk");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Terjadi kesalahan saat login");
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Terjadi kesalahan saat logout");
            }
            res.redirect("/auth/login");
        });
    },
}
module.exports = authController;