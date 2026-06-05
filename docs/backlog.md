# Product Backlog: Tracki MVP

Berdasarkan dokumen `Tracki_Blueprint_Syariah_2025.docx` dan spesifikasi teknis dari `developer_reference.md`, berikut adalah daftar Product Backlog terstruktur untuk pengembangan MVP Tracki.

## Epic 1: Setup & Infrastruktur
- [ ] **Task 1.1:** Inisialisasi proyek Next.js (Web PWA) dengan TypeScript.
- [ ] **Task 1.2:** Setup Supabase lokal & remote (PostgreSQL).
- [ ] **Task 1.3:** Setup environment variables (Supabase, Gemini API, Upstash Redis).
- [ ] **Task 1.4:** Konfigurasi PWA Manifest & Service Worker untuk kapabilitas A2HS (Add to Home Screen).

## Epic 2: Autentikasi & Otorisasi
- [ ] **Task 2.1:** Implementasi Supabase Auth (Register, Login, Logout) menggunakan HTTP-only cookies.
- [ ] **Task 2.2:** Setup Middleware Auth Guard di Next.js untuk rute privat.
- [ ] **Task 2.3:** Integrasi sistem Consent untuk fitur AI (Scan, Insight, Nudge) di database.
- [ ] **Task 2.4:** Penerapan Row Level Security (RLS) secara ketat di semua tabel Supabase.

## Epic 3: Pencatatan Keuangan (Core & Offline-First)
- [ ] **Task 3.1:** Pembuatan schema database tabel `transactions`.
- [ ] **Task 3.2:** Implementasi antarmuka pencatatan transaksi manual.
- [ ] **Task 3.3:** Setup IndexedDB untuk strategi penyimpanan Offline-First di browser/mobile.
- [ ] **Task 3.4:** Sinkronisasi background otomatis dari IndexedDB ke Supabase dengan Conflict Resolution.

## Epic 4: Scan Struk AI (Fitur AI-01)
- [ ] **Task 4.1:** Pembuatan UI unggah/kamera struk dengan validasi format (JPG/PNG/WEBP) dan ukuran (Maks 5MB).
- [ ] **Task 4.2:** Pre-processing gambar di frontend (Resize max 1200px, Compress 85%) untuk efisiensi token.
- [ ] **Task 4.3:** Pembuatan Edge Function `POST /api/scan` & integrasi Gemini Flash Vision.
- [ ] **Task 4.4:** Parse hasil OCR (JSON), grace-degradation, dan penanganan `PARTIAL_SUCCESS`.
- [ ] **Task 4.5:** Konfigurasi Rate Limiting via Upstash Redis (10 scan/hari per pengguna).

## Epic 5: Split Bill & AI Nudge (Fitur AI-03)
- [ ] **Task 5.1:** Pembuatan schema `split_sessions` & `split_members`.
- [ ] **Task 5.2:** UI/UX perhitungan split bill dan pengelolaan status pembayaran.
- [ ] **Task 5.3:** Edge Function `POST /api/split-sessions/:id/nudge` untuk generate pesan pengingat sopan.
- [ ] **Task 5.4:** Pengaturan Prompt (`PROMPT_NUDGE_V1`) dan tone berdasarkan hubungan.
- [ ] **Task 5.5:** Implementasi Caching & Rate Limiting (20 nudge/hari).

## Epic 6: AI Insight Syariah (Fitur AI-02)
- [ ] **Task 6.1:** Pengembangan UI Dashboard/Insight keuangan bulanan.
- [ ] **Task 6.2:** Trigger otomatis insight syariah jika ada ≥ 5 transaksi baru.
- [ ] **Task 6.3:** Integrasi Gemini Pro untuk Insight (hanya mengirim data agregat transaksi).
- [ ] **Task 6.4:** Algoritma threshold Syubhat, Halal, Haram, dan render Teks Disclaimer standar.
- [ ] **Task 6.5:** Sistem penyimpanan cache di kolom `ai_insight_cache` untuk optimasi biaya.

## Epic 7: Zakat & Pelaporan
- [ ] **Task 7.1:** Pembuatan schema `zakat_records`.
- [ ] **Task 7.2:** Sistem Kalkulator Zakat Profesi otomatis (Hitung Nisab & Haul).
- [ ] **Task 7.3:** UI rekomendasi purifikasi untuk transaksi berstatus Haram/Riba (seperti bunga bank).
- [ ] **Task 7.4:** Endpoint laporan keuangan bulanan (`GET /api/reports/monthly`).

## Epic 8: Privasi, Keamanan & Compliance
- [ ] **Task 8.1:** Perlindungan PII (Menghapus/scrubbing field `notes` sebelum dikirim ke AI).
- [ ] **Task 8.2:** Sanitasi input pengguna untuk mencegah AI Prompt Injection.
- [ ] **Task 8.3:** Implementasi Ephemeral Processing (Gambar struk dihapus segera dari memory/tidak disimpan di DB).
- [ ] **Task 8.4:** Audit Log & Sistem Manual Correction (Feedback Loop) untuk evaluasi akurasi prompt AI.
