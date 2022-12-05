const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render('home', { title: "Beranda", beranda_active: "active", about_active: "", pray_active: "", quran_active: "" });
});

app.get("/about", (req, res) => {
    res.render('about', { title: "Tentang Kami", beranda_active: "", about_active: "active", pray_active: "", quran_active: "" });
});

app.get("/pray", (req, res) => {
    res.render('pray', { title: "Waktu Sholat", beranda_active: "", about_active: "", pray_active: "active", quran_active: "" });
});

app.get("/quran", (req, res) => {
    res.render('quran', { title: "Baca Quran", beranda_active: "", about_active: "", pray_active: "", quran_active: "active" });
});

app.use((req, res) => {
    res.render('404', { title: "404" });
    res.status(404);
})

app.listen(process.env.PORT || port, () => { });