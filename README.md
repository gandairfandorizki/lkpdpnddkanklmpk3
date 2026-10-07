# LKPD Smart Generator

Aplikasi web statis (`index.html`) + 1 fungsi serverless (`api/generate.js`) untuk membuat LKPD dengan AI.

## Deploy ke GitHub + Vercel
1. Buat repository baru di GitHub, lalu unggah **seluruh isi folder ini** (Add file → Upload files).
2. Buka vercel.com → Add New → Project → pilih repository tadi → Deploy (tanpa framework, build command kosong).
3. Project → Settings → Environment Variables, tambahkan:
   - `ANTHROPIC_API_KEY` = kunci dari console.anthropic.com
   - (opsional) `ANTHROPIC_MODEL` = nama model, default `claude-sonnet-4-6`
4. Deployments → Redeploy agar variabel terbaca. Selesai.

## Catatan
- Atur batas pengeluaran (spend limit) di console.anthropic.com: endpoint `/api/generate` bersifat publik.
- Jika deploy menolak `maxDuration` 300, ubah ke 60 di `vercel.json` dan kecilkan `max_tokens` di `api/generate.js`.
- Akun, LKPD, dan fitur kelas (kode tugas, pengumpulan, absensi) disimpan di `localStorage` browser, jadi **per perangkat**. Untuk berbagi antar perangkat, ganti `col()` di `claude-shim.js` dengan database (Upstash Redis / Vercel Postgres / Supabase).
- Download Word menghasilkan `.doc` berbasis HTML.
