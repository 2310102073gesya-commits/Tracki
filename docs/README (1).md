# 🌙 Tracki

> **Catat, Scan & Split Bareng** — Manajemen Keuangan Syariah untuk Gen Z Indonesia

[![Version](https://img.shields.io/badge/version-1.1.0--MVP%2B-pink?style=flat-square)](CHANGELOG.md)
[![Platform](https://img.shields.io/badge/platform-PWA%20Offline--First-blue?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)]()
[![Status](https://img.shields.io/badge/status-In%20Development-orange?style=flat-square)]()

---

**بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ**

Tracki adalah platform manajemen keuangan personal berbasis AI yang dirancang khusus untuk generasi muda Indonesia — mahasiswa, fresh graduate, dan young professional — dengan pendekatan yang estetik, intuitif, dan sesuai prinsip syariah Islam secara mendalam.

---

## Daftar Isi

- [UI/UX Preview](#uiux-preview)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Cara Menjalankan Lokal](#cara-menjalankan-lokal)
- [Struktur Project](#struktur-project)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Prinsip Syariah](#prinsip-syariah)
- [Target Pengguna](#target-pengguna)
- [Roadmap](#roadmap)
- [Kontribusi](#kontribusi)
- [Changelog](#changelog)
- [Lisensi](#lisensi)

---

## UI/UX Preview

> 🎨 Desain Tracki menggunakan palet **pink-blue gradient** yang khas — estetik Gen Z, bukan tampilan software akuntansi yang kaku.

| Screen | Deskripsi |
|--------|-----------|
| 📊 **Dashboard** | Stat cards, grafik tren harian, AI insight banner, dan widget sisa piutang |
| 📸 **Scan Struk** | Upload foto → preview hasil ekstraksi AI → edit & simpan dalam < 15 detik |
| 🤝 **Split Bill** | Buat sesi, pilih metode, generate pesan WA lengkap QRIS |
| 🌙 **Syariah** | Badge status halal/syubhat/haram, kalkulator zakat, tracker purifikasi |

```
🎨 Design System Tracki
─────────────────────────────────────────────────────
  Primary    #EC4899  ████  Hot Pink    — CTA, accent
  Secondary  #3B82F6  ████  Sky Blue   — pemasukan, link
  Lavender   #A78BFA  ████  Lavender   — saldo, hiburan
  Mint       #10B981  ████  Mint Green — halal, sukses
  Peach      #F97316  ████  Peach      — syubhat, perlu ditinjau
  Red        #F87171  ████  Red        — pengeluaran, haram
  Background #FDF5F8  ████  Soft Pink  — canvas utama
─────────────────────────────────────────────────────
  Heading : Playfair Display  (22–88px)
  Body    : Plus Jakarta Sans (12–16px)
```

> 📐 **Design file:** Figma mockup tersedia di link internal tim (minta akses ke maintainer).
> Belum tersedia screenshot? Jalankan app lokal atau baca `DEV_GUIDE.md` untuk panduan kontribusi desain.

---

## Fitur Utama

### 📊 Dashboard Keuangan Real-Time
Ringkasan kondisi keuangan pengguna secara real-time — total pemasukan, pengeluaran, sisa saldo, dan sesi split bill aktif. Dilengkapi grafik tren harian, breakdown kategori, dan AI Insight syariah yang diperbarui setiap hari. Tetap berfungsi saat offline — data terakhir ditampilkan dari cache lokal.

### 📸 Scan Struk AI (Gemini Vision)
Foto struk belanja → semua data terekstraksi otomatis dalam hitungan detik. Diproses melalui Gemini Vision AI via Edge Function untuk latensi minimal di Indonesia. Gambar struk **langsung dihapus** setelah diproses (ephemeral processing) — tidak pernah tersimpan di server.

- Format: JPG, PNG (maks. 10 MB)
- Target akurasi: ≥ 90% untuk struk standar (Indomaret, Alfamart, restoran)
- Timeout: 30 detik, fallback ke input manual

### 🤝 Split Bill Anti-Ribet
Tiga metode split, integrasi QRIS, AI nudge sopan, dan settlement tracking di dashboard.

| Metode | Cara Kerja |
|--------|------------|
| **Rata Sama** | Total tagihan dibagi sama rata ke semua peserta |
| **Per Item** | Setiap peserta bayar item yang mereka pesan saja |
| **Custom %** | Pembuat sesi menentukan persentase masing-masing |

Pesan tagihan WhatsApp di-generate otomatis lengkap dengan nomor rekening dan link/display QRIS. Kalau ada yang belum bayar, AI bisa buatkan pesan pengingat yang sopan dan tidak awkward.

### 🌙 Syariah 2.0 — Lapisan Kepatuhan Aktif
Syariah bukan sekadar fitur — melainkan lapisan yang menyertai setiap aktivitas keuangan.

- **Zakat Profesi Otomatis** — kalkulasi dan notifikasi zakat saat gaji masuk, nishab berbasis harga emas real-time
- **Smart Nishab Real-Time** — ambang batas selalu diperbarui dari API harga emas harian
- **Filter Syubhat (3 Level)** — tandai transaksi sebagai Halal / Syubhat / Haram
- **Purifikasi Harta** — pisahkan bunga bank dari saldo bersih, alokasikan ke pos sedekah
- **Tips Rezeki Barakah** — micro-content edukatif Islam yang kontekstual

### 📋 Laporan Bulanan + AI Insight Syariah
Laporan komprehensif dengan skor kesehatan keuangan islami (0–100), breakdown per kategori, tren 3 bulan, ringkasan split bill, daftar transaksi syubhat, dan analisis AI berbasis Gemini. Bisa di-export ke CSV dan PDF.

### ✏️ Input Transaksi Cepat
Pencatatan < 15 detik. 9 kategori dengan emoji. Mendukung mode offline — data disimpan lokal ke IndexedDB, sync otomatis saat koneksi pulih.

### 🎨 UI/UX Estetik (Gen Z Approved)
Desain menggunakan palet warna modern (`#EC4899` & `#3B82F6`) dengan tipografi **Playfair Display** dan **Plus Jakarta Sans** untuk memberikan kesan mewah namun tetap ramah pengguna. Tidak ada elemen UI yang terasa seperti software akuntansi — setiap layar dirancang agar terasa seperti consumer app yang ingin dibuka setiap hari.

---

## Tech Stack

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Frontend** | Next.js 14 (App Router) | Server Components, routing, UI |
| **Styling** | Tailwind CSS | Utility-first, desain responsif |
| **Offline** | Service Worker + IndexedDB | Offline-first, sync otomatis |
| **Database** | Supabase (PostgreSQL) | Penyimpanan data, auth, Row Level Security |
| **Auth** | Supabase Auth | Login via email / OAuth |
| **Edge Functions** | Vercel / Supabase Edge | Proses Gemini API dekat wilayah Indonesia |
| **AI Engine** | Gemini AI (Google) | Scan struk (Vision) + insight syariah |
| **Gold Price API** | Third-party gold API | Data harga emas real-time untuk nishab |
| **Charts** | Recharts | Grafik ringan dan responsif |
| **Deploy** | Vercel | CI/CD otomatis, edge network global |

---

## Cara Menjalankan Lokal

### Prerequisites

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) v18.17 atau lebih baru
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- Akun [Supabase](https://supabase.com/) (free tier cukup)
- Akun [Google AI Studio](https://aistudio.google.com/) untuk Gemini API Key
- Akun [Vercel](https://vercel.com/) (untuk deploy, opsional untuk lokal)

### Langkah Setup

**1. Clone repository**

```bash
git clone https://github.com/tracki-app/tracki.git
cd tracki
```

**2. Install dependencies**

```bash
npm install
# atau
yarn install
```

**3. Salin file environment**

```bash
cp .env.example .env.local
```

Isi semua variable di `.env.local` (lihat bagian [Environment Variables](#environment-variables)).

**4. Setup database Supabase**

Tersedia dua opsi — pilih sesuai kebutuhan:

**Opsi A — Supabase Cloud** (cocok untuk development biasa)

```bash
npx supabase db push
```

**Opsi B — Supabase Lokal via Docker** (disarankan untuk testing tanpa perlu koneksi cloud)

```bash
# Pastikan Docker sudah berjalan
supabase start          # Jalankan local database & auth

# Output setelah start:
# API URL:     http://localhost:54321
# DB URL:      postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL:  http://localhost:54323

# Jalankan migration ke local DB
supabase db push

# Saat selesai development
supabase stop
```

> 💡 Dengan Opsi B, ubah `NEXT_PUBLIC_SUPABASE_URL` di `.env.local` menjadi `http://localhost:54321` dan gunakan anon key yang muncul saat `supabase start`.

Lihat bagian [Database Setup](#database-setup) untuk detail skema tabel lengkap.

**5. Jalankan development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

**6. (Opsional) Jalankan sebagai PWA**

Untuk test fitur offline, build production dan serve lokal:

```bash
npm run build
npm run start
```

---

## Struktur Project

```
tracki/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route group: login, register
│   ├── (dashboard)/            # Route group: halaman utama
│   │   ├── page.tsx            # Dashboard
│   │   ├── input/              # Input transaksi
│   │   ├── scan/               # Scan struk AI
│   │   ├── split/              # Split bill
│   │   ├── laporan/            # Laporan bulanan
│   │   └── syariah/            # Modul syariah
│   └── api/                    # API Routes
│       ├── transactions/
│       ├── scan/               # Edge: Gemini Vision
│       ├── split-sessions/
│       ├── reports/
│       ├── ai/
│       ├── zakat/
│       └── purification/
├── components/                 # Reusable UI components
│   ├── ui/                     # Base components (button, card, dll.)
│   ├── dashboard/              # Komponen khusus dashboard
│   ├── split/                  # Komponen split bill
│   └── syariah/                # Komponen modul syariah
├── lib/                        # Utilities & helpers
│   ├── supabase/               # Supabase client & helpers
│   ├── gemini/                 # Gemini AI integration
│   ├── zakat/                  # Kalkulasi zakat
│   └── offline/                # IndexedDB & sync logic
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service Worker
├── supabase/
│   └── migrations/             # SQL migrations
├── .env.example
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## Environment Variables

Buat file `.env.local` dengan variable berikut:

```env
# ─── Supabase ───────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # Hanya untuk server-side

# ─── Gemini AI ──────────────────────────────────────────────
GEMINI_API_KEY=your-gemini-api-key                 # JANGAN masukkan ke client!

# ─── Gold Price API ──────────────────────────────────────────
GOLD_PRICE_API_KEY=your-gold-api-key
GOLD_PRICE_API_URL=https://api.gold-price-provider.com

# ─── App Config ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> ⚠️ **Penting:** `GEMINI_API_KEY` dan `SUPABASE_SERVICE_ROLE_KEY` **tidak boleh** diekspos ke client (tidak menggunakan prefix `NEXT_PUBLIC_`). Key ini hanya diakses dari server/edge function.

---

## Database Setup

### Skema Utama

Tracki menggunakan 4 tabel utama di Supabase (PostgreSQL):

**`transactions`** — semua transaksi keuangan pengguna

```sql
CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users NOT NULL,
  type            TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  amount          BIGINT NOT NULL,
  category        VARCHAR(50),
  description     TEXT,
  shariah_status  TEXT CHECK (shariah_status IN ('halal', 'syubhat', 'haram')) DEFAULT 'halal',
  is_interest     BOOLEAN DEFAULT false,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  source          TEXT CHECK (source IN ('manual', 'scan')) DEFAULT 'manual',
  synced_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**`split_sessions`** — sesi split bill

```sql
CREATE TABLE split_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users NOT NULL,
  title         VARCHAR(100) NOT NULL,
  total_amount  BIGINT NOT NULL,
  method        TEXT CHECK (method IN ('equal', 'per_item', 'custom')) NOT NULL,
  status        TEXT CHECK (status IN ('active', 'settled')) DEFAULT 'active',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**`split_members`** — anggota per sesi split

```sql
CREATE TABLE split_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID REFERENCES split_sessions NOT NULL,
  name        VARCHAR(100) NOT NULL,
  amount_due  BIGINT NOT NULL,
  is_paid     BOOLEAN DEFAULT false,
  paid_at     TIMESTAMPTZ
);
```

**`zakat_records`** — riwayat kalkulasi zakat profesi

```sql
CREATE TABLE zakat_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users NOT NULL,
  month           DATE NOT NULL,
  income          BIGINT NOT NULL,
  nishab_at_time  BIGINT NOT NULL,
  zakat_due       BIGINT NOT NULL,
  is_paid         BOOLEAN DEFAULT false
);
```

### Row Level Security (RLS)

Semua tabel harus mengaktifkan RLS agar data setiap pengguna terisolasi:

```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_records ENABLE ROW LEVEL SECURITY;

-- Contoh policy untuk transactions:
CREATE POLICY "Users can only access own transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id);
```

---

## Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│   Next.js 14  │  React Components  │  Tailwind CSS       │
│   Service Worker (Offline)  │  IndexedDB (Local Cache)   │
│   PWA Manifest & Install Prompt                          │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTPS / WebSocket
┌──────────────────────────▼───────────────────────────────┐
│                      SERVER LAYER                        │
│   Next.js API Routes  │  Middleware  │  Auth Guard       │
│   Rate Limiter  │  Input Validator                       │
└────────────┬─────────────────────────┬────────────────────┘
             │                         │
┌────────────▼──────────┐ ┌────────────▼─────────────────┐
│    DATABASE LAYER     │ │         EDGE LAYER            │
│  Supabase PostgreSQL  │ │  Vercel/Supabase Edge Fn      │
│  Row Level Security   │ │  → Gemini Vision API          │
│  Real-time Sub.       │ │  → Gold Price API             │
│  Audit Trail (immut.) │ │  [Gambar struk dihapus        │
└───────────────────────┘ │   setelah ekstraksi selesai]  │
                          └───────────────────────────────┘
```

### Alur Offline-First

```
Pengguna input transaksi (offline)
        │
        ▼
Simpan ke IndexedDB (lokal)
        │
        ▼
Service Worker deteksi koneksi pulih
        │
        ▼
Sync otomatis ke Supabase
        │
        ▼
Dashboard diperbarui via real-time subscription
```

---

## Prinsip Syariah

Tracki dibangun di atas komitmen bahwa teknologi finansial bisa — dan seharusnya — membantu umat Muslim mengelola rezeki dengan cara yang amanah.

| Pilar | Implementasi |
|-------|--------------|
| **Anti-Riba** | Tidak integrasi dengan layanan pinjaman berbunga; bunga bank konvensional difasilitasi untuk dipurifikasi |
| **Anti-Maysir** | Tidak ada fitur yang berkaitan dengan perjudian atau spekulasi |
| **Anti-Israf** | AI Insight mendeteksi pola pengeluaran berlebihan dan memberi saran |
| **Zakat** | Kalkulasi zakat profesi otomatis dengan nishab real-time berbasis harga emas |
| **Amanah Data** | Ephemeral processing, RLS ketat, hak hapus data penuh |

### Formula Zakat

```
# Zakat Profesi (per bulan)
Nishab = Harga 85 gram emas hari ini (API real-time)
Jika Pemasukan Bulanan ≥ Nishab:
  Zakat Profesi = 2,5% × Pemasukan Bulanan

# Zakat Mal (tahunan)
Haul = Saldo konsisten ≥ Nishab selama 12 bulan Hijriah
Zakat Mal = 2,5% × Total saldo yang memenuhi haul
```

> 🔍 **Bagaimana sistem membedakan keduanya?** Tracki secara cerdas mendeteksi **tipe pemasukan** yang diinput pengguna. Pemasukan berkategori `"Gaji"` atau `"Freelance"` akan langsung diperhitungkan sebagai Zakat Profesi (bulanan). Sedangkan Zakat Mal dihitung secara terpisah berbasis akumulasi saldo selama haul — sistem akan melacak apakah total harta konsisten melampaui nishab selama 12 bulan Hijriah. Pengguna tidak perlu memilih secara manual — sistem yang menentukan jenis zakat yang relevan berdasarkan konteks transaksi.

### Contoh Prompt AI: Scan Struk

Berikut adalah contoh prompt raw yang dikirim ke Gemini Vision saat pengguna scan struk, agar kamu paham cara AI bekerja dalam konteks Tracki:

```
Kamu adalah OCR engine yang mengekstraksi data dari foto struk belanja Indonesia.

Baca gambar struk yang diberikan dan kembalikan HANYA JSON dalam format ini:
{
  "store_name": "string",
  "store_address": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "items": [
    { "name": "string", "quantity": number, "price": number }
  ],
  "total": number
}

Aturan:
- Harga dalam satuan Rupiah (angka bulat, tanpa titik/koma)
- Jika field tidak bisa dibaca, isi dengan null
- Jangan tambahkan penjelasan apapun di luar JSON
```

> Prompt lengkap lainnya (AI Insight Syariah & AI Nudge Split Bill) tersedia di [`AI_SPEC.md`](./AI_SPEC.md).

---

## Target Pengguna

| Segmen | Usia | Pain Point |
|--------|------|------------|
| **Mahasiswa** | 18–25 th | Tidak tahu kemana uang jajan habis, konflik hutang teman |
| **Fresh Graduate** | 22–27 th | Pengeluaran tidak terkontrol, bingung soal zakat gaji |
| **Young Professional** | 25–35 th | Tidak ada waktu untuk pencatatan detail, bingung tangani bunga bank |
| **Muslim Sadar Syariah** | Semua usia | Tidak ada alat digital yang benar-benar membantu kepatuhan syariah |

---

## Roadmap

| Fase | Timeline | Fokus |
|------|----------|-------|
| **Fase 1 — Core Engine** | Minggu 1–4 | Setup project, auth, dashboard, input transaksi, scan struk |
| **Fase 2 — Shariah & Social** | Minggu 5–8 | Modul Syariah 2.0, purifikasi harta, split bill, laporan bulanan |
| **Fase 3 — Optimization** | Minggu 9–12 | Beta testing, performa PWA, bug fixing, export & polish |
| **Fase 4 — Launch** | Bulan 4+ | Soft launch, konten marketing, partnership lembaga zakat |

### Fitur Pipeline (Fase Berikutnya)

- [ ] Investasi mikro (reksa dana, saham syariah)
- [ ] Tabungan berbasis tujuan (goal-based saving)
- [ ] Perencanaan keuangan jangka panjang
- [ ] Integrasi perbankan (open banking)
- [ ] Fitur komunitas / leaderboard hemat
- [ ] **Smart Budgeting AI** — AI yang memprediksi kapan saldo akan habis berdasarkan tren harian
- [ ] **Halal Merchant Map** — integrasi peta untuk menemukan restoran bersertifikat Halal terdekat

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/transactions` | Ambil semua transaksi pengguna |
| `POST` | `/api/transactions` | Tambah transaksi baru |
| `PUT` | `/api/transactions/:id` | Edit transaksi |
| `DELETE` | `/api/transactions/:id` | Hapus transaksi |
| `POST` | `/api/scan` | Upload struk, kembalikan JSON hasil ekstraksi AI |
| `GET` | `/api/split-sessions` | Ambil semua sesi split bill |
| `POST` | `/api/split-sessions` | Buat sesi split baru |
| `PUT` | `/api/split-sessions/:id/members/:memberId` | Update status bayar anggota |
| `POST` | `/api/split-sessions/:id/nudge` | Generate pesan AI nudge |
| `GET` | `/api/reports/monthly` | Ambil data laporan bulanan |
| `GET` | `/api/ai/insight` | Ambil insight AI syariah terbaru |
| `GET` | `/api/zakat/calculate` | Hitung zakat berdasarkan pemasukan & nishab hari ini |
| `GET` | `/api/zakat/nishab` | Ambil nilai nishab terkini dari gold price API |
| `GET` | `/api/purification/summary` | Ringkasan dana purifikasi bulan ini |
| `PUT` | `/api/purification/:id/settle` | Tandai dana purifikasi sudah disalurkan |

Dokumentasi API lengkap tersedia di [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Kontribusi

Tracki adalah proyek yang berkembang. Kontribusi sangat diterima!

**Cara Berkontribusi:**

1. Fork repository ini
2. Buat branch baru: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: deskripsi singkat'`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buat Pull Request

**Konvensi Commit:**

```
feat:     fitur baru
fix:      perbaikan bug
docs:     perubahan dokumentasi
style:    perubahan formatting (bukan logic)
refactor: refactoring kode
test:     menambah atau memperbaiki test
chore:    perubahan konfigurasi / dependencies
```

Baca [`DEV_GUIDE.md`](./DEV_GUIDE.md) untuk standar kode, branching strategy, dan panduan testing lengkap.

---

## Changelog

### v1.1.0 — MVP+ *(Current)*

| Area | Perubahan |
|------|-----------|
| **Syariah** | Ditambah: filter Syubhat (3 level), purifikasi bunga bank, smart nishab real-time |
| **Zakat** | Upgrade dari pengingat pasif → kalkulasi zakat profesi otomatis saat gaji masuk |
| **Split Bill** | Ditambah: QRIS display, AI nudge, settlement tracking di dashboard |
| **Arsitektur** | Ditambah: Edge Function untuk Gemini API, offline-first PWA (Service Worker + IndexedDB) |
| **Privasi** | Ditambah: ephemeral image processing, audit trail immutable |
| **Database** | Ditambah: field `shariah_status`, `is_interest`, `synced_at`; tabel baru `zakat_records` |
| **AI Prompts** | Diperbarui: insight syariah lebih mendalam; ditambah prompt AI nudge split bill |
| **KPI** | Diperbarui: time-to-log < 15 detik, akurasi scan ≥ 90%, NPS > 60 |

### v1.0.0 — MVP

- Dashboard keuangan dasar
- Input transaksi manual
- Scan struk AI (Gemini Vision)
- Split bill (3 metode)
- Pengingat zakat dasar
- Laporan bulanan sederhana

---

## Dokumen Terkait

| Dokumen | Deskripsi |
|---------|-----------|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Arsitektur detail, skema database, data flow, API spec |
| [`DEV_GUIDE.md`](./DEV_GUIDE.md) | Coding standards, git workflow, testing strategy, deployment |
| [`SECURITY.md`](./SECURITY.md) | Kebijakan keamanan, incident response, backup & recovery |
| [`BUSINESS_RULES.md`](./BUSINESS_RULES.md) | Aturan bisnis, syariah rules, threshold transaksi, alur verifikasi |
| [`AI_SPEC.md`](./AI_SPEC.md) | Spesifikasi AI, prompt registry, OCR integration |
| [`COMPLIANCE.md`](./COMPLIANCE.md) | Kebijakan privasi, data retention, hak pengguna |

---

## Lisensi

Didistribusikan di bawah lisensi MIT. Lihat [`LICENSE`](./LICENSE) untuk informasi lengkap.

---

<div align="center">

**tracki** — Catat, Scan & Split Bareng

*Blueprint Syariah 2025 · v1.1.0 — MVP+*

*Semoga Tracki membawa keberkahan dan manfaat bagi semua. 🌙*

</div>
