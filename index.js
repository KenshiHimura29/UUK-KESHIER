const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const session = require('express-session');

require('dotenv').config();
const port = process.env.PORT;

const authRoutes = require('./routes/authRoutes');
const produkRoutes = require('./routes/produkRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const keranjangRoutes = require('./routes/keranjangRoutes');
const generateLaporanRoutes = require('./routes/generateLaporanRoutes'); // Tambahkan ini

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 1000 * 60 * 60 }
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use("/auth", authRoutes);
app.use("/produk", produkRoutes);
app.use("/transaksi", transaksiRoutes);
app.use('/keranjang', keranjangRoutes);
app.use('/generate', generateLaporanRoutes); // Tambahkan ini

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});