# Analisa Singkat `public/js/script.js`

File ini adalah **script front-end utama** untuk dashboard StreamFire. Fungsinya menghubungkan UI dengan API backend dan Socket.IO supaya status streaming, log aktivitas, upload video, dan konfigurasi RTMP bisa berjalan realtime.

## Kegunaan Utama

1. **Realtime log & status via Socket.IO**
   - Menerima event `newLog`, `streamStatuses`, dan `streamStatus`.
   - Menampilkan log terbaru ke panel aktivitas.
   - Sinkronkan status kartu video (LIVE/OFFLINE) secara realtime.

2. **Monitoring resource server**
   - Tiap 3 detik request ke `/api/system/stats`.
   - Update indikator RAM, CPU, dan Disk di dashboard.

3. **Upload video dari UI**
   - Mengatur modal upload, drag/click pilih file, dan submit form.
   - Upload ke endpoint `/api/upload/local`.

4. **Manajemen tujuan RTMP**
   - Menyediakan preset RTMP (YouTube, Facebook, Twitch, custom).
   - Bisa tambah/hapus destination (multi-destination stream).
   - Otomatis gabungkan prefix server + stream key.

5. **Kontrol streaming**
   - Tombol Start/Stop stream per video card.
   - Start kirim data ke `/api/stream/start`, stop ke `/api/stream/stop`.
   - Validasi minimal 1 RTMP URL sebelum start.

6. **Hapus video**
   - Konfirmasi via SweetAlert.
   - Hapus ke `/api/video/:id`.

7. **Durasi live timer**
   - Menampilkan timer jam live berdasarkan `startTime` dari backend.

8. **Simpan konfigurasi stream**
   - Simpan resolution/fps/bitrate/loop/destination ke `/api/stream/config`.

## Cara Pakai (Simple)

1. Jalankan aplikasi StreamFire.
2. Buka dashboard di browser.
3. Tambahkan video lewat tombol **Add Video** (upload).
4. Di kartu video, tambahkan minimal 1 destination RTMP:
   - pilih platform (YouTube/Facebook/Twitch/Custom),
   - isi stream key atau URL.
5. Atur opsi stream (resolusi, fps, bitrate, loop).
6. Klik **Start Stream**.
7. Pantau:
   - status LIVE/OFFLINE,
   - timer durasi stream,
   - log aktivitas,
   - usage RAM/CPU/Disk.
8. Klik **Stop Stream** untuk menghentikan.
9. Klik **Save Config** jika ingin menyimpan setting sebagai default untuk video tersebut.

## Catatan

- Script ini bergantung pada elemen HTML tertentu (id/class) dan endpoint backend yang sesuai.
- Kalau ada elemen UI yang tidak muncul, biasanya karena id/class di view berubah tapi script belum ikut diupdate.
