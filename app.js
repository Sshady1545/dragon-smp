const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// --- GÜVENLİK KATMANLARI ---

// 1. Helmet: HTTP başlıklarını güvenli hale getirir
// Content Security Policy (CSP) ile dışarıdan zararlı script yüklenmesini engeller
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://cdnjs.cloudflare.com"], // FontAwesome için izin verdik
      "img-src": ["'self'", "data:", "https://api.mcsrvstat.us"],
    },
  },
}));

// 2. Rate Limiting: Kötü niyetli botlara karşı (15 dakikada maks 100 istek)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Çok fazla istek gönderdiniz, lütfen biraz bekleyin."
});
app.use(limiter);

// 3. Statik Dosyaları Sunma
// 'public' klasöründeki her şeyi dışarıya açar
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa rotası
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 Hata Sayfası (Opsiyonel)
app.use((req, res) => {
  res.status(404).send('Sayfa bulunamadı!');
});

app.listen(PORT, () => {
  console.log(`DragonSMP sunucusu güvenli modda http://localhost:${PORT} üzerinde çalışıyor.`);
});