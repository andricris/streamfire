<p align="center">
  <a href="https://github.com/broman0x/streamfire">
    <img src="public/img/logo.png" alt="StreamFire Logo" width="200"/>
  </a>
</p>

<p align="center">
  <a href="https://github.com/broman0x/streamfire/stargazers"><img src="https://img.shields.io/github/stars/broman0x/streamfire?style=social" alt="GitHub Stars"></a>
  <a href="https://github.com/broman0x/streamfire/network"><img src="https://img.shields.io/github/forks/broman0x/streamfire?style=social" alt="GitHub Forks"></a>
  <a href="https://github.com/broman0x/streamfire/issues"><img src="https://img.shields.io/github/issues/broman0x/streamfire?color=red" alt="Issues"></a>
  <a href="https://github.com/broman0x/streamfire/pulls"><img src="https://img.shields.io/github/issues-pr/broman0x/streamfire?color=green" alt="Pull Requests"></a>
  <a href="https://github.com/broman0x/streamfire/blob/main/LICENSE"><img src="https://img.shields.io/github/license/broman0x/streamfire?color=blue" alt="License"></a>
  <br>
  <img src="https://img.shields.io/static/v1?label=Node.js&message=%3E%3D18&color=brightgreen&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/FFmpeg-Required-ff0000?logo=ffmpeg" alt="FFmpeg">
</p>

<h1 align="center">🔥StreamFire</h1>

<p align="center">
  <strong>Panel Live Streaming 24/7 Pribadi — Paling Ringan, Paling Stabil, Paling Murah!</strong>
</p>

<p align="center">
  <b>StreamFire</b> adalah panel kontrol live streaming <b>self-hosted</b> yang dirancang khusus agar kamu bisa streaming 24/7 tanpa harus nyalain PC/laptop terus. Cuma butuh VPS murah (Rp30.000/bulan pun cukup!), upload video MP4, atur loop, lalu stream ke YouTube, Twitch, Facebook, TikTok, atau RTMP manapun.
</p>

<details open>

## Fitur Unggulan

- Dasbor modern & responsif (HP & PC)
- Support resolusi 360p → 1080p 60FPS (preset siap pakai)
- Jalan lancar di VPS termurah (1 Core, 1 GB RAM!)
- Real-time monitoring CPU, RAM, Disk
- Auto-loop 24/7
- Menggunakan FFmpeg sistem → anti crash & memory leak
- Support multi-platform: YouTube, Twitch, Facebook, TikTok, Custom RTMP

## Quick Start (Cuma 3 Menit!)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install ffmpeg nodejs npm git curl -y
git clone https://github.com/broman0x/streamfire.git
cd streamfire
npm install
npm start
```

```bash
cp .env.example .env
nano .env
```
## Edit .env
```bash
PORT=7575
PUBLIC_IP=your_ip_atau_kosongin
```
## Dashboard
```bash
Dashboard: http://IP_VPS_KAMU:7575
```

## Deploy di Pterodactyl (NodeJS Egg)

Kalau deploy lewat panel Pterodactyl, gunakan konfigurasi berikut pada tab **Startup**:

- **Docker Image**: `ghcr.io/parkervcp/yolks:nodejs_20`
- **GIT REPO ADDRESS**: `https://github.com/broman0x/streamfire`
- **INSTALL BRANCH**: `main`
- **GIT USERNAME**: kosongkan jika repo public
- **GIT ACCESS TOKEN**: kosongkan jika repo public
- **COMMAND RUN**: `npm start`

Catatan kredensial git:

- Untuk repo **public** (seperti StreamFire), **GIT USERNAME** dan **GIT ACCESS TOKEN tidak perlu diisi**.
- Isi **GIT USERNAME + GIT ACCESS TOKEN (PAT)** hanya jika repo kamu **private**.

Pastikan dependency sistem berikut tersedia di node server / egg:

- `ffmpeg`
- `git`

### Nilai final siap isi (sesuai server kamu sekarang)

Isi kolom **Startup** seperti ini:

- **Docker Image**: `ghcr.io/parkervcp/yolks:nodejs_20`
- **GIT REPO ADDRESS**: `https://github.com/andricris/streamfire`
- **INSTALL BRANCH**: `main`
- **GIT USERNAME**: *(kosong)*
- **GIT ACCESS TOKEN**: *(kosong)*
- **COMMAND RUN**: `npm start`

Isi file `.env` (karena alokasi server kamu di port `4397`):

```env
PORT=4397
NODE_ENV=production
PUBLIC_IP=alfa.kinzprivat.biz.id
```

Setelah simpan `.env`, klik **Reinstall Server** sekali, lalu **Start**.

Setelah server berhasil install, buka file `.env` di panel Files dan isi minimal:

```env
PORT=PORT_ALOKASI_PANEL_KAMU
PUBLIC_IP=DOMAIN_ATAU_IP_PANEL_KAMU
NODE_ENV=production
```

Lalu restart server. Dashboard bisa diakses di:

```bash
http://IP_PUBLIC_VPS_KAMU:PORT_ALOKASI_PANEL
```

### Troubleshooting Pterodactyl

Jika saat start muncul error seperti:

```bash
npm ERR! enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/container/package.json'
```

Artinya source code belum ter-clone ke `/home/container`.

Langkah perbaikan:

1. Pastikan `GIT REPO ADDRESS` terisi benar: `https://github.com/broman0x/streamfire`
2. Pastikan `INSTALL BRANCH` diisi: `main`
3. Untuk repo public, biarkan `GIT USERNAME` dan `GIT ACCESS TOKEN` kosong
4. Klik **Reinstall** server dari panel Pterodactyl (bukan cuma Restart), agar proses clone jalan dari awal
5. Setelah reinstall selesai, cek tab **Files** harus ada `package.json` di folder root server
6. Start ulang server

Checklist validasi setting (sesuai screenshot):

- `GIT REPO ADDRESS` boleh pakai fork kamu sendiri (contoh `https://github.com/andricris/streamfire`) selama repo tersebut public dan branch `main` ada.
- `INSTALL BRANCH=main` sudah benar.
- `GIT USERNAME` dan `GIT ACCESS TOKEN` tetap dikosongkan untuk repo public.
- Port aplikasi **harus sama** dengan alokasi server di Pterodactyl (contoh alokasi kamu `4397`).
  - Jika pakai file `.env`, set `PORT=4397` (atau port alokasi aktif kamu).
  - Jangan pakai `PORT=7575` jika alokasi panel bukan 7575.
- Setelah ubah startup/repo, lakukan **Reinstall Server** dari tab Settings agar repo di-clone ulang.

Jika `package.json` masih tidak ada setelah reinstall, berarti egg/node kamu **tidak menjalankan install script clone repo** (ini cocok dengan log kamu yang langsung `npm start` lalu `ENOENT /home/container/package.json`).

Solusi cepat (pilih salah satu):

1. **Ganti egg** ke NodeJS egg yang punya install script `git clone`.
2. **Clone manual via SFTP/terminal** ke `/home/container` lalu pastikan file ini ada di root:
   - `package.json`
   - `app.js`
   - folder `src/` dan `public/`
3. Jalankan `npm install` sekali, lalu start ulang server.

Catatan penting:

- Mengubah file `.env.example` di GitHub **tidak otomatis** membuat `.env` di server Pterodactyl.
- Yang dipakai aplikasi adalah file **`/home/container/.env`** di tab **Files** panel server.
- Jadi tetap buat/edit `.env` langsung di panel Pterodactyl, bukan hanya di repo GitHub.

### Kalau tab Files cuma berisi folder `.npm`

Kalau di `/home/container` hanya ada folder `.npm` (seperti screenshot kamu), itu berarti **source code belum ada sama sekali**.

- Bukan berarti semua script harus ditempel di kolom **Startup Command**.
- **Startup Command cukup `npm start`** (dan variabel startup bawaan egg).
- Yang harus diisi adalah **file project** di `/home/container`.

Yang perlu ada minimal di `/home/container`:

- `package.json`
- `app.js`
- folder `src/`
- folder `public/`
- file `.env`

Cara isi file project:

1. Paling mudah: klik **Reinstall Server** (jika egg mendukung auto-clone repo).
2. Kalau setelah reinstall tetap kosong: upload ZIP repo dari GitHub ke tab Files lalu extract di root `/home/container`.
3. Alternatif: upload via SFTP ke root `/home/container`.
4. Setelah file masuk, jalankan `npm install` lalu start ulang.

### Jika console sudah menampilkan `StreamFire Running!`

Kalau log sudah seperti ini:

- `> streamfire@1.0.0 start`
- `> node app.js`
- `StreamFire Running!`

berarti aplikasi **sudah berhasil jalan**.

Lanjutkan langkah berikut:

1. Buka URL publik dari log, contoh: `http://alfa.kinzprivat.biz.id:4397`.
2. Login/setup akun admin pertama.
3. Upload video MP4, set stream key RTMP, lalu test start stream.
4. (Opsional tapi disarankan) pasang reverse proxy + HTTPS agar akses lebih aman/stabil.

### Isi kolom RTMP harus apa?

Di form tujuan stream, ada 2 cara pengisian:

1. **Pilih platform (YouTube/Facebook/Twitch)**
   - Kolom input cukup isi **Stream Key** saja.
   - Prefix server akan ditambahkan otomatis oleh aplikasi.
2. **Pilih `Custom`**
   - Kolom input wajib isi **URL RTMP lengkap** (server + key).
   - Contoh format: `rtmp://server/live/STREAM_KEY`.

Contoh cepat:

- **YouTube**
  - Pilih: `YouTube`
  - Isi kolom: `abcd-1234-efgh-5678` (stream key)
- **Facebook**
  - Pilih: `Facebook`
  - Isi kolom: stream key dari Live Producer
- **Twitch**
  - Pilih: `Twitch`
  - Isi kolom: `live_XXXXXXXXXXXXXXXXXXXX`
- **Custom RTMP**
  - Pilih: `Custom`
  - Isi kolom penuh, misal: `rtmp://live.tiktok.com/live/STREAM_KEY`

Catatan:
- Jangan isi URL + key dobel saat pakai preset platform.
- Kalau ragu, pakai `Custom` lalu tempel URL RTMP lengkap dari platform tujuan.

Catatan warning di log:

- `npm WARN old lockfile` dan `8 high severity vulnerabilities` **tidak membuat server gagal start**.
- Itu bisa dibereskan nanti saat maintenance dengan audit dependency terjadwal.

## Reverse Proxy (Nginx + HTTPS Gratis) – Rekomendasi!
Kalau mau pakai domain + HTTPS gratis:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
sudo certbot --nginx -d streamfire.kamu.com
```

## Donasi & Support
Proyek ini 100% gratis & open source. Kalau kamu suka & terbantu, boleh traktir kopi biar gua semangat update terus ☕
## Donate 
- https://sociabuzz.com/broman/tribe

## USDT/BNB (BEP20) 
```bash
0x1566b42493fa3faa98a7644dae9bd3c94cf671a5
```

## Kontribusi
Ingin berkontribusi? Silakan!
1. Fork repositori ini.
2. Buat branch baru untuk fitur/fix kamu.
3. Commit perubahan kamu.
4. Push ke branch tersebut.
5. Buat Pull Request.

Jika menemukan bug atau punya ide fitur baru, jangan ragu untuk membuat **Issue** baru!

## © Lisensi
Licensed MIT License 
