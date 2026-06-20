/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: number;
  classLevel: string; // "Kelas 1" to "Kelas 10"
  title: string;
  theme: string;
  estimatedMinutes: number;
  objectives: string[];
  vocabulary: {
    jp: string;
    rom: string;
    translation: string;
    type: string;
    desc: string;
  }[];
  grammarPoints: {
    title: string;
    explanation: string;
    exJp: string;
    exRom: string;
    exId: string;
    commonMistakeJp?: string;
    commonMistakeId?: string;
    drillText?: string;
    drillSolution?: string;
  }[];
  sentencePatterns: {
    pattern: string;
    meaning: string;
  }[];
  exercises: {
    type: 'A' | 'B' | 'C';
    title: string;
    sentence: string;
    options: string[];
    correct: string;
    explanation: string;
  }[];
  dialogue: {
    speaker: string;
    textJp: string;
    textRom: string;
    textId: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
  cultureNote: string;
  reviewSummary: string[];
}

export const LESSONS_PART1: Lesson[] = [
  {
    id: 1,
    classLevel: "Kelas 1 (Awal)",
    title: "Bab 1: Perkenalan Diri di Tempat Kerja / LPK",
    theme: "Hari Pertama Masuk Magang / LPK Baru",
    estimatedMinutes: 45,
    objectives: [
      "Mampu memperkenalkan diri secara formal dengan lancar",
      "Memahami fungsi penanda topik partikel は (wa)",
      "Mampu membuat kalimat positif (です) dan menyangkal (じゃありません)"
    ],
    vocabulary: [
      { jp: "わたし", rom: "Watashi", translation: "Saya / Aku", type: "Kata Ganti", desc: "Sopan umum, wajib dikuasai untuk perkenalan resmi." },
      { jp: "がくせい", rom: "Gakusei", translation: "Siswa / Pelajar", type: "Kata Benda", desc: "Menggambarkan pelajar sekolah atau pembelajar." },
      { jp: "かいしゃいん", rom: "Kaishain", translation: "Karyawan Perusahaan", type: "Kata Benda", desc: "Menunjukkan pekerjaan formal pegawai kantor." },
      { jp: "けんしゅうせい", rom: "Kenshuusei", translation: "Peserta Magang", type: "Kata Benda", desc: "Sangat krusial untuk pekerja magang luar negeri." },
      { jp: "あのひと", rom: "Ano hito", translation: "Orang itu", type: "Kata Ganti", desc: "Dipakai menunjuk orang di kejauhan." }
    ],
    grammarPoints: [
      {
        title: "Pola: KB1 は KB2 です (A adalah B)",
        explanation: "Partikel は ditulis dengan katakter hiragana 'ha' tapi dilafalkan 'wa'. Partikel ini bertugas menandai subjek atau topik utama perbincangan. Kata です (desu) diletakkan di akhir kalimat kata benda untuk memberi tanda kesopanan (tidak diartikan secara harfiah, melainkan bertindak seperti kopula 'is/am/are').",
        exJp: "わたしはインドネシア人です。",
        exRom: "Watashi wa Indonesia-jin desu.",
        exId: "Saya adalah orang Indonesia.",
        commonMistakeJp: "わたし は がくせい。",
        commonMistakeId: "Salah karena tidak memakai 'です (desu)'. Kalimat menjadi tidak sopan jika bicara dengan orang yang baru dikenal atau atasan.",
        drillText: "Kembalikan struktur yang benar untuk 'Orang itu adalah karyawan perusahaan': [あのひと / は / かいしゃいん / です]",
        drillSolution: "あのひとはかいしゃいんです。"
      },
      {
        title: "Pola: KB1 は KB2 じゃありません (A bukanlah B)",
        explanation: "じゃありません (ja arimasen) adalah bentuk negatif atau penyangkalan dari です (desu). Dipakai untuk merelasikan penyangkalan suatu topik. Dalam ragam penulisan pidato resmi sering disubstitusi menjadi では ありません (dewa arimasen).",
        exJp: "あのひとは研修生じゃありません。",
        exRom: "Ano hito wa kenshuusei ja arimasen.",
        exId: "Orang itu bukanlah peserta magang.",
        commonMistakeJp: "わたし は 研修生 ない です。",
        commonMistakeId: "Salah kaprah mencampurkan kata sifat 'nai desu' ke penyangkalan kata benda harian.",
        drillText: "Buat kalimat penyangkalan untuk 'Saya bukan siswa': [わたし / は / がくせい / じゃありません]",
        drillSolution: "わたしはがくせいじゃありません。"
      }
    ],
    sentencePatterns: [
      { pattern: "わたしは研修生です。", meaning: "Saya adalah peserta magang." },
      { pattern: "サントスさんはがくせいじゃありません。", meaning: "Tuan Santos bukanlah seorang siswa." }
    ],
    exercises: [
      {
        type: "A",
        title: "Susun Kata",
        sentence: "わたし / は / 研修生 / です",
        options: ["わたしは研修生です", "研修生わたしはです", "です研修生はわたし"],
        correct: "わたしは研修生です",
        explanation: "Urutan bahasa jepang selalu Topik (わたし) + Partikel (は) + Predikat (研修生) + Penutup (です)."
      },
      {
        type: "B",
        title: "Pilih Partikel",
        sentence: "あのひと __ かいしゃいんです。",
        options: ["は (wa)", "の (no)", "が (ga)"],
        correct: "は (wa)",
        explanation: "Karena 'あのひと' adalah topik kalimat, pakai partikel は."
      },
      {
        type: "C",
        title: "Terjemahan",
        sentence: "Saya bukan orang Jepang.",
        options: ["わたしは日本人じゃありません。", "わたしは日本人です。", "わたしは日本人ですか。"],
        correct: "わたしは日本人じゃありません。",
        explanation: "Bentuk negatif penyangkalan adalahじゃありません."
      }
    ],
    dialogue: [
      { speaker: "ルカ", textJp: "はじめまして。ルカです。インドネシアから来ました。", textRom: "Hajimemashite. Ruka desu. Indonesia kara kimashite.", textId: "Perkenalkan. Saya Ruka. Datang dari Indonesia." },
      { speaker: "山田", textJp: "はじめまして、山田です。どうぞよろしく。", textRom: "Hajimemashite, Yamada desu. Douzo yoroshiku.", textId: "Perkenalkan, saya Yamada. Senang berkenalan dengan Anda." }
    ],
    quiz: [
      {
        question: "Bagaimanakah bunyi penyangkalan formal dari 'desu'?",
        options: ["ja arimasen", "arimasen deshita", "nai desu"],
        answer: "ja arimasen",
        explanation: "Bentuk negatif saat ini untuk kata benda adalah ja arimasen."
      }
    ],
    cultureNote: "Di Jepang, membungkuk (ojigi) saat mengucapkan 'Hajimemashite' sangatlah penting. Jangan pernah berjabat tangan secara mendadak tanpa aba-aba demi kesopanan.",
    reviewSummary: [
      "Menguasai 'wa' sebagai penanda topik kalimat.",
      "Menguasai status sopan 'desu' dan bantahan 'ja arimasen'."
    ]
  },
  {
    id: 2,
    classLevel: "Kelas 1 (Awal)",
    title: "Bab 2: Mengenal Benda & Fasilitas Kerja",
    theme: "Mengidentifikasi Peralatan LPK & Mess",
    estimatedMinutes: 40,
    objectives: [
      "Mampu menggunakan kata tunjuk benda kore, sore, are secara tepat",
      "Memahami fungsi partikel kepemilikan の (no)"
    ],
    vocabulary: [
      { jp: "これ", rom: "Kore", translation: "Ini", type: "Kata Benda", desc: "Kata tunjuk benda dekat pembicara." },
      { jp: "それ", rom: "Sore", translation: "Itu", type: "Kata Benda", desc: "Kata tunjuk benda dekat lawan bicara." },
      { jp: "あれ", rom: "Are", translation: "Itu jauh", type: "Kata Benda", desc: "Kata tunjuk benda jauh dari keduanya." },
      { jp: "ほん", rom: "Hon", translation: "Buku", type: "Kata Benda", desc: "Buku bacaan atau catatan kerja." },
      { jp: "じしょ", rom: "Jisho", translation: "Kamus", type: "Kata Benda", desc: "Untuk menerjemahkan kata bahasa Jepang." }
    ],
    grammarPoints: [
      {
        title: "Pola: これ / それ / あれ は KB です",
        explanation: "Grup kata ini adalah kata ganti penunjuk benda murni. Kore menunjukkan benda yang berada dekat di jangkauan tangan pembicara. Sore menunjukkan benda dekat lawan bicara. Are digunakan jika benda tersebut jauh dari jangkauan pandangan kedua pembicara.",
        exJp: "これは日本語の辞書です。",
        exRom: "Kore wa Nihongo no jisho desu.",
        exId: "Ini adalah kamus Bahasa Jepang.",
        commonMistakeJp: "この は 本 です。",
        commonMistakeId: "Salah karena 'kono' tidak boleh berdiri sendiri sebelum partikel, ia wajib menempel langsung di depan kata benda (misalnya: kono hon wa...).",
        drillText: "Terjemahkan 'Itu (jauh) adalah kamus': [あれ / は / じしょ / です]",
        drillSolution: "あれはじしょです。"
      },
      {
        title: "Pola: KB1 の KB2 (Hubungan Kepunyaan / Sifat)",
        explanation: "Partikel の (no) berfungsi menghubungkan dua kata benda. KB1 bertindak menerangkan atau memiliki KB2. Contoh: 'watashi no hon' berarti 'buku saya' (kepemilikan), sedangkan 'Nihongo no hon' artinya 'buku Bahasa Jepang' (kandungan isi/sifat).",
        exJp: "それはわたしの本です。",
        exRom: "Sore wa watashi no hon desu.",
        exId: "Itu adalah buku saya.",
        commonMistakeJp: "わたし 本 の です。",
        commonMistakeId: "Partikel 'no' harus di tengah KB1 dan KB2, bukan di belakang.",
        drillText: "Hubungkan 'buku milik Yamada-san':",
        drillSolution: "山田さんの本"
      }
    ],
    sentencePatterns: [
      { pattern: "これはシャープペンシルです。", meaning: "Ini adalah pensil mekanik." },
      { pattern: "それはだれの鍵ですか。", meaning: "Itu kunci milik siapa?" }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Apakah ini kunci Anda?",
        options: ["これはあなたの鍵ですか", "それあなとの鍵です", "あれあなたの鍵か"],
        correct: "これはあなたの鍵ですか",
        explanation: "Gunakan partikel tanya か di belakang kalimat tanya sopan."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "山本 __ 傘ですか。",
        options: ["の (no)", "は (wa)", "を (wo)"],
        correct: "の (no)",
        explanation: "Menyatakan kepemilikan payung milik Tuan Yamamoto."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Tunjuk benda yang dekat dengan lawan bicara:",
        options: ["それ (Sore)", "これ (Kore)", "あれ (Are)"],
        correct: "それ (Sore)",
        explanation: "Sore ditujukan untuk lokasi lawan bicara."
      }
    ],
    dialogue: [
      { speaker: "アディ", textJp: "これはルカさんのノートですか。", textRom: "Kore wa Ruka-san no nooto desu ka?", textId: "Apakah ini buku catatan milik Ruka?" },
      { speaker: "ルカ", textJp: "いいえ、それはサントスさんのです。", textRom: "Iie, sore wa Santosu-san no desu.", textId: "Bukan, itu milik Tuan Santos." }
    ],
    quiz: [
      {
        question: "Jika benda jauh dari kita dan lawan bicara, sebutan yang pas adalah?",
        options: ["Are", "Kore", "Sore"],
        answer: "Are",
        explanation: "Are menandakan jarak terjauh dari kedua pembicara."
      }
    ],
    cultureNote: "Kartu nama (Meishi) di Jepang diperlakukan sebagai perwakilan martabat seseorang. Terima selalu dengan kedua tangan dan baca perlahan untuk menghormatinya.",
    reviewSummary: [
      "Menguasai penunjuk benda Kore, Sore, Are.",
      "Menggunakan partikel 'no' untuk menyatakan kepemilikan."
    ]
  },
  {
    id: 3,
    classLevel: "Kelas 1 (Awal)",
    title: "Bab 3: Menemukan Lokasi & Bertanya Arah",
    theme: "Mencari Kamar Mandi, Ruang Kelas, & Belanja di Minimarket",
    estimatedMinutes: 45,
    objectives: [
      "Mampu menanyakan letak ruangan di kantor atau LPK",
      "Menanyakan harga barang belanjaan di kasir Jepang"
    ],
    vocabulary: [
      { jp: "ここ", rom: "Koko", translation: "Di sini", type: "Lokasi", desc: "Tempat si pembicara berada." },
      { jp: "そこ", rom: "Soko", translation: "Di situ", type: "Lokasi", desc: "Tempat lawan bicara berada." },
      { jp: "あそこ", rom: "Asoko", translation: "Di sana", type: "Lokasi", desc: "Tempat jauh dari pembicara dan lawan." },
      { jp: "お手洗い", rom: "Otearai", translation: "Toilet / Kamar Mandi", type: "Kata Benda", desc: "Ungkapan halus dan sopan untuk toilet." },
      { jp: "いくら", rom: "Ikura", translation: "Berapa harganya", type: "Kata Tanya", desc: "Bertanya harga nominal barang." }
    ],
    grammarPoints: [
      {
        title: "Pola: Tempat は Tempat-Tunjuk です",
        explanation: "Dipakai untuk mengidentifikasi keberadaan suatu lokasi fisik sekunder. Kata tunjuk tempat terdiri dari 'koko (sini)', 'soko (situ)', dan 'asoko (sana)'.",
        exJp: "事務所はあそこです。",
        exRom: "Jimusho wa asoko desu.",
        exId: "Kantor administrasi ada di sebelah sana.",
        commonMistakeJp: "食堂はそこ場所です。",
        commonMistakeId: "Kata 'soko' sudah otomatis berarti 'di situ', tidak perlu ditambahi kata bendanya lagi setelahnya.",
        drillText: "Susun kalimat 'Kamar mandi ada di sini': [お手洗い / は / ここ / です]",
        drillSolution: "お手洗いはここです。"
      },
      {
        title: "Pola: KB は いくらですか (Berapa harga barang ini?)",
        explanation: "Cara standard menanyakan nilai moneter di supermarket Jepang. Diakhiri desu ka.",
        exJp: "このカメラはいくらですか。",
        exRom: "Kono kamera wa ikura desu ka?",
        exId: "Kamera ini berapa harganya?",
        commonMistakeJp: "いくら は この本ですか。",
        commonMistakeId: "Kata tanya 'ikura' ditaruh mendahului predikat di ujung kalimat tanya, bukan di depan partikel 'wa'.",
        drillText: "Tanya harga dari 'kamus ini' (kono jisho):",
        drillSolution: "この辞書はいくらですか。"
      }
    ],
    sentencePatterns: [
      { pattern: "エレベーターはあそこです。", meaning: "Lift ada di sebelah sana." },
      { pattern: "これはどこの靴ですか。", meaning: "Ini sepatu buatan mana?" }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Di mana kantornya?",
        options: ["事務所はどこですか", "事務所はここですか", "事務所はいくらですか"],
        correct: "事務所はどこですか",
        explanation: "Gunakan kata tanya 'doko' untuk arah lokasi keberadaan."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "A: Toilet ada di mana? B: Di sana.",
        options: ["お手洗いはどこですか。あそこです。", "お手洗いはここですか。あそこです。", "お手洗いはあれですか。そこです。"],
        correct: "お手洗いはどこですか。あそこです。",
        explanation: "Tanya 'doko' dijawab dengan 'asoko' jika letaknya jauh."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Isi rumpang: Koko wa jimusho __ 。",
        options: ["です (desu)", "じゃない (janai)", "いいえ (iie)"],
        correct: "です (desu)",
        explanation: "Kopula desu di akhir kalimat penegasan positif harian."
      }
    ],
    dialogue: [
      { speaker: "サリ", textJp: "すみません、お手洗いはどこですか。", textRom: "Sumimasen, otearai wa doko desu ka?", textId: "Maaf, toilet ada di sebelah mana?" },
      { speaker: "山田", textJp: "お手洗いはあそこです。", textRom: "Otearai wa asoko desu.", textId: "Toilet ada di sebelah sana." }
    ],
    quiz: [
      {
        question: "Kata sopan lain untuk menunjukkan 'toilet' selain 'toire' adalah?",
        options: ["Otearai", "Jimusho", "Uketsuke"],
        answer: "Otearai",
        explanation: "Otearai (piring cuci tangan) bernuansa sopan halus."
      }
    ],
    cultureNote: "Vending machine (Jidouhanbaiki) ada di hampir setiap sudut jalan Jepang. Sediakan selalu uang koin 100 yen untuk melatih kemandirian jalan.",
    reviewSummary: [
      "Menunjuk tempat dengan Koko, Soko, Asoko.",
      "Menanyakan letak lokasi dengan kata tanya Doko."
    ]
  },
  {
    id: 4,
    classLevel: "Kelas 2 (Dasar)",
    title: "Bab 4: Jam Kerja, Lembur, & Hari Libur",
    theme: "Mengatur Waktu & Jadwal Kedatangan di Pabrik",
    estimatedMinutes: 50,
    objectives: [
      "Mampu melafalkan jam (ji) dan menit (fun/pun) bahasa Jepang",
      "Memahami fungsi partikel batas waktu kara dan made",
      "Menguasai konjugasi kata kerja bentuk lampau desu/mashita"
    ],
    vocabulary: [
      { jp: "いま", rom: "Ima", translation: "Sekarang", type: "Waktu", desc: "Waktu aktual saat ini." },
      { jp: "〜じ", rom: "〜Ji", translation: "Jam 〜", type: "Sufiks", desc: "Pelekat angka jam (misalnya: ichi-ji, ni-ji)." },
      { jp: "〜ふん / ぷん", rom: "〜Fun / Pun", translation: "Menit 〜", type: "Sufiks", desc: "Menunjukkan menit harian." },
      { jp: "おきます", rom: "Okimasu", translation: "Bangun (tidur)", type: "Kata Kerja", desc: "Aktivitas pagi hari pembangun disiplin." },
      { jp: "やすみます", rom: "Yasumimasu", translation: "Beristirahat / Libur", type: "Kata Kerja", desc: "Mengambil jeda dari pekerjaan." }
    ],
    grammarPoints: [
      {
        title: "Pola: Menghitung Jam & Menit",
        explanation: "Jam dihitung dengan angka + じ. Catat perkecualian lafal berikut: Jam 4 = Yoji (bukan Yonji), Jam 7 = Shichiji, Jam 9 = Kuji (bukan Kyuuji). Menit dirangkaikan dengan 'fun' atau 'pun' tergantung pada angka belakangnya.",
        exJp: "いまは４時２0分です。",
        exRom: "Ima wa yo-ji ni-juppun desu.",
        exId: "Sekarang jam 4 lewat 20 menit.",
        commonMistakeJp: "よんじ きゅうじ",
        commonMistakeId: "Menyebut jam 4 dan jam 9 dengan yon-ji / kyuu-ji. Seharusnya 'yo-ji' dan 'ku-ji'.",
        drillText: "Ucapkan pukul 1:30 (Setengah 2):",
        drillSolution: "一時半"
      },
      {
        title: "Pola: KB (Waktu) から KB (Waktu) まで",
        explanation: "Partikel から (kara) berarti 'dari / sejak', sedangkan まで (made) memiliki arti 'sampai / hingga'. Sangat sering digunakan untuk merincikan durasi jam kerja atau kegiatan olahraga.",
        exJp: "研修は朝９時から夕方５時までです。",
        exRom: "Kenshuu wa asa ku-ji kara yuugata go-ji made desu.",
        exId: "Pelatihan adalah dari jam 9 pagi sampai jam 5 sore.",
        commonMistakeJp: "９時 まで ５時 から",
        commonMistakeId: "Urutan terbalik antara awal (kara) dan akhir batas waktu (made).",
        drillText: "Tulis 'dari senin sampai jumat':",
        drillSolution: "月曜日から金曜日まで"
      }
    ],
    sentencePatterns: [
      { pattern: "私は毎朝６時に起きます。", meaning: "Saya bangun tidur jam 6 setiap pagi." },
      { pattern: "銀行は９時から３時までです。", meaning: "Bank buka dari jam 9 sampai jam 3." }
    ],
    exercises: [
      {
        type: "A",
        title: "Konjugasi",
        sentence: "Bentuk lampau dari 'Hatarakimasu' (Bekerja) adalah:",
        options: ["Hatarakimashita", "Hatarakimasen", "Hatarakimasen deshita"],
        correct: "Hatarakimashita",
        explanation: "Bentuk positif lampau kata kerja diakhiri kata '~mashita'."
      },
      {
        type: "B",
        title: "Angka",
        sentence: "Jam 9 malam bahasa jepangnya:",
        options: ["午後９時 (gogo ku-ji)", "午前９時 (gozen ku-ji)", "夜９じ (yoru kyuu-ji)"],
        correct: "午後９時 (gogo ku-ji)",
        explanation: "Gogo menyatakan PM (pagi-siang lewat / malam) ditambah ku-ji."
      },
      {
        type: "C",
        title: "Partikel",
        sentence: "Bekerja dari jam 8 __ jam 5.",
        options: ["から、まで (kara, made)", "まで、から (made, kara)", "に、へ (ni, he)"],
        correct: "から、まで (kara, made)",
        explanation: "Sesuai rumus: dari (kara) s.d (made)."
      }
    ],
    dialogue: [
      { speaker: "ルカ", textJp: "毎日、何時から何時まで働きますか。", textRom: "Mainichi, nan-ji kara nan-ji made hatarakimasu ka?", textId: "Setiap hari Anda bekerja dari jam berapa sampai jam berapa?" },
      { speaker: "指導員", textJp: "朝８時から夕方５時まで働きます。", textRom: "Asa hachi-ji kara yuugata go-ji made hatarakimasu.", textId: "Bekerja dari jam 8 pagi sampai jam 5 sore." }
    ],
    quiz: [
      {
        question: "Kalimat lampau negatif 'Saya tidak bekerja kemarin' yang paling pas adalah?",
        options: ["Kinoo hatarakimasen deshita", "Kinoo hatarakimashita", "Mainichi hatarakimasen"],
        answer: "Kinoo hatarakimasen deshita",
        explanation: "'~masen deshita' menunjukkan lampau negatif (kemarin)."
      }
    ],
    cultureNote: "Absen telat 1 detik pun dapat menurunkan indeks disiplin kenshuusei di pabrik. Selalu datang 10 menit lebih dini sebelum jam shift operasional.",
    reviewSummary: [
      "Menguasai sebutan jam dan menit.",
      "Menggunakan partikel Kara-Made untuk durasi.",
      "Menggunakan tenses kata kerja masa lampau."
    ]
  },
  {
    id: 5,
    classLevel: "Kelas 2 (Dasar)",
    title: "Bab 5: Moda Transportasi & Mudik",
    theme: "Berangkat Kerja & Konsultasi Arah Stasiun",
    estimatedMinutes: 40,
    objectives: [
      "Mampu menggunakan kata kerja pergerakan (iku, kuru, kaeru)",
      "Menjelaskan alat transportasi yang dipakai dengan partikel で (de)",
      "Menyatakan orang yang menemani dengan partikel と (to)"
    ],
    vocabulary: [
      { jp: "行きます", rom: "Ikimasu", translation: "Pergi", type: "Kata Kerja", desc: "Mengarah menjauhi posisi pembicara harian." },
      { jp: "来ます", rom: "Kimasu", translation: "Datang", type: "Kata Kerja", desc: "Mengarah mendekati posisi pembicara harian." },
      { jp: "帰ります", rom: "Kaerimasu", translation: "Pulang", type: "Kata Kerja", desc: "Kembali ke markas, asrama, atau negara asal." },
      { jp: "でんしゃ", rom: "Densha", translation: "Kereta Listrik", type: "Kata Benda", desc: "Alat pengangkut massal utama di Jepang." },
      { jp: "ともだち", rom: "Tomodachi", translation: "Teman", type: "Kata Benda", desc: "Rekan sejawat sebaya." }
    ],
    grammarPoints: [
      {
        title: "Pola: Tempat へ 行きます / 来ます / 帰ります",
        explanation: "Partikel へ ditulis dengan aksara hiragana 'he' tapi dibaca 'e'. Partikel ini bertugas menunjukkan arah tujuan gerakan fisik atau kepulangan seseorang ke tempat bermukim.",
        exJp: "わたしは日本へ来ました。",
        exRom: "Watashi wa Nihon e kimashita.",
        exId: "Saya telah datang ke Jepang.",
        commonMistakeJp: "学校 に 行きます。 (dengan salah paham ragam dasar)",
        commonMistakeId: "Meskipun partikel ni sering disamakan, untuk arah gerak fokus tujuannya sebaiknya didukung partikel 'へ (e)'.",
        drillText: "Katakan 'pergi ke pabrik (koujou)':",
        drillSolution: "工場へ行きます"
      },
      {
        title: "Pola: Kendaraan で 行きます (Pergi dengan naik moda...)",
        explanation: "Partikel で (de) menandakan sarana atau perantara transportasi yang menyertai pergerakan fisik subjek.",
        exJp: "自転車で工場へ行きます。",
        exRom: "Jitensha de koujou e ikimasu.",
        exId: "Pergi ke pabrik dengan naik sepeda.",
        commonMistakeJp: "歩き で 行きます。",
        commonMistakeId: "Jika berjalan kaki, sebutan aslinya adalah 'Aruite ikimasu' tanpa perlu menggunakan partikel 'de' lagi.",
        drillText: "Buat kalimat 'Pergi naik kereta':",
        drillSolution: "電車で行きます"
      }
    ],
    sentencePatterns: [
      { pattern: "私は電車で会社へ行きます。", meaning: "Saya pergi ke perusahaan dengan naik kereta listrik." },
      { pattern: "だれと日本へ来ましたか。", meaning: "Anda datang ke Jepang bersama dengan siapa?" }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Saya pulang ke asrama (ryou) bersama teman.",
        options: ["友達と寮へ帰ります", "友達は寮へ帰ります", "友達の寮へ帰ります"],
        correct: "友達と寮へ帰ります",
        explanation: "Hubungan 'bersama teman' ditandakan dengan partikel と (to)."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Aruite gakkou __ ikimasu.",
        options: ["へ (he)", "で (de)", "は (wa)"],
        correct: "へ (he)",
        explanation: "Arah pergerakan 'sekolah' ditandakan partikel へ."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti 'Kaerimasu'?",
        options: ["Pulang", "Jalan", "Membeli"],
        correct: "Pulang",
        explanation: "Kaerimasu artinya kembali ke tempat asal / rumah."
      }
    ],
    dialogue: [
      { speaker: "ルカ", textJp: "次の日曜日にどこへ行きますか。", textRom: "Tsugi no nichiyoubi ni doko e ikimasu ka?", textId: "Hari Minggu esok Anda mau pergi ke mana?" },
      { speaker: "サントス", textJp: "ともだちと東京へ行きます。", textRom: "Tomodachi to Tokyo e ikimasu.", textId: "Saya akan pergi ke Tokyo bersama teman." }
    ],
    quiz: [
      {
        question: "Ungkapan 'Berjalan kaki pergi' dalam tata bahasa jepang yang paling benar:",
        options: ["Aruite ikimasu", "Arukide ikimasu", "Arukini ikimasu"],
        answer: "Aruite ikimasu",
        explanation: "'Aruite' adalah bentuk adverbial khusus berjalan kaki."
      }
    ],
    cultureNote: "Di stasiun kota besar seperti Tokyo atau Osaka, dilarang berdiri di sebelah kanan eskalator demi mendahulukan orang lain yang sedang terburu-buru.",
    reviewSummary: [
      "Menguasai kata kerja berarah Iku, Kuru, Kaeru.",
      "Menggunakan partikel 'de' untuk menegaskan moda transportasi."
    ]
  },
  {
    id: 6,
    classLevel: "Kelas 2 (Dasar)",
    title: "Bab 6: Santap Siang & Aktivitas Harian",
    theme: "Bertemu Rekan Kerja di Ruang Makan",
    estimatedMinutes: 45,
    objectives: [
      "Mampu menerangkan objek makanan memakai partikel を (o/wo)",
      "Menyatakan lokasi aktivitas dengan partikel で (de)",
      "Mengajak makan bersama memakai ungkapan mashou / masen ka"
    ],
    vocabulary: [
      { jp: "たべます", rom: "Tabemasu", translation: "Makan", type: "Kata Kerja", desc: "Kegiatan mengunyah makanan." },
      { jp: "のみます", rom: "Nomimasu", translation: "Minum", type: "Kata Kerja", desc: "Kegiatan menelan cairan pendukung." },
      { jp: "みず", rom: "Mizu", translation: "Air Putih", type: "Kata Benda", desc: "Air tawar alami pelepas dahaga." },
      { jp: "ごはん", rom: "Gohan", translation: "Nasi / Makanan", type: "Kata Benda", desc: "Bahan pangan pokok kenshuusei." },
      { jp: "いっしょに", rom: "Issho ni", translation: "Bersama-sama", type: "Keterangan", desc: "Asosiasi kebersamaan aktivitas harian." }
    ],
    grammarPoints: [
      {
        title: "Pola: KB を Kata Kerja Transitif (Menggunakan Objek)",
        explanation: "Partikel を ditulis dengan karakter hiragana 'wo' tapi dilafalkan 'o'. Berfungsi menandai objek langsung (penderita) yang menerima tindakan aksi kata kerja aktif.",
        exJp: "朝ご飯を食べます。",
        exRom: "Asagohan o tabemasu.",
        exId: "Saya makan sarapan pagi.",
        commonMistakeJp: "お茶 が 飲みます。",
        commonMistakeId: "Memakai partikel ga untuk objek transitif biasa. Seharusnya 'wo' jika artinya aksi aktif meminum.",
        drillText: "Tulis 'membaca buku':",
        drillSolution: "本を読みます"
      },
      {
        title: "Pola: KB (Tempat) で KK (Aksi Kegiatan)",
        explanation: "Perbedaan tegas dari Bab 3: Partikel で (de) di sini menandakan tempat terjadinya suatu perbuatan aktif, bukan sekadar keberadaan statis diam.",
        exJp: "食堂でラーメンを食べました。",
        exRom: "Shokudou de raamen o tabemashita.",
        exId: "Saya telah makan ramen di kantin.",
        commonMistakeJp: "食堂 に 食べます。",
        commonMistakeId: "Salah memakai partikel ni untuk lokasi melakukan tindakan fungsional dinamis.",
        drillText: "Translate 'membeli di supermarket (suupaa)':",
        drillSolution: "スーパーで買います"
      }
    ],
    sentencePatterns: [
      { pattern: "お酒を飲みましたか。", meaning: "Apakah Anda tadi telah minum sake?" },
      { pattern: "ロビーで新聞を読みます。", meaning: "Membaca koran di lobi." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Mari minum teh bersama.",
        options: ["一緒に。お茶を飲みましょう。", "一緒に。お茶は飲みます。", "一緒に。お茶を飲みません。"],
        correct: "一緒に。お茶を飲みましょう。",
        explanation: "Ajakan meyakinkan diakhiri dengan bentuk'〜ましょう (mashou)'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Gakkou __ Nihongo o benkyou shimasu.",
        options: ["で (de)", "に (ni)", "へ (he)"],
        correct: "で (de)",
        explanation: "Tempat melakukan aktivitas belajar 'Nihongo' ditandai partikel で."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Pilih ajakan halus 'Maukah makan bersama?':",
        options: ["一緒に食べませんか", "一緒に食べました", "一緒に食べます"],
        correct: "一緒に食べませんか",
        explanation: "'〜ませんか (masen ka)' adalah ajakan halus memberi kesempatan lawan untuk menolak sopan."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "ロビーで一緒にコーヒーを飲みませんか。", textRom: "Robee de issho ni koohii o nomimasen ka?", textId: "Maukah minum kopi bersama di lobi?" },
      { speaker: "ルカ", textJp: "ええ、飲みましょう！", textRom: "Ee, nomishou!", textId: "Ya, mari kita minum!" }
    ],
    quiz: [
      {
        question: "Partikel manakah yang diletakkan untuk menandakan tempat kejadian aktivitas dinamis?",
        options: ["De", "Ni", "He"],
        answer: "De",
        explanation: "Partikel 'De' adalah penanda lokasi berlangsungnya perbuatan kata kerja aktif."
      }
    ],
    cultureNote: "Sebelum mulai menyantap hidangan, orang Jepang wajib mengucap 'Itadakimasu' sambil menangkupkan kedua belah tangan sebagai wujud terima kasih pada berkah alam.",
    reviewSummary: [
      "Menguasai partikel penanda objek 'wo'.",
      "Memahami perbedaan partikel tempat kejadian 'de' vs 'ni'."
    ]
  },
  {
    id: 7,
    classLevel: "Kelas 2 (Dasar)",
    title: "Bab 7: Bantuan Alat & Memberi Hadiah",
    theme: "Hubungan Antar Rekan di Asrama LPK",
    estimatedMinutes: 45,
    objectives: [
      "Menyatakan penggunaan alat kerja dengan partikel で",
      "Menyatakan pengiriman / penyerahan benda (Agemasu / Moraimasu)"
    ],
    vocabulary: [
      { jp: "はし", rom: "Hashi", translation: "Sumpit", type: "Kata Benda", desc: "Alat makan khas Asia Timur." },
      { jp: "あげます", rom: "Agemasu", translation: "Memberikan", type: "Kata Kerja", desc: "Aksi memberi sesuatu ke arah orang luar." },
      { jp: "もらいます", rom: "Moraimasu", translation: "Menerima", type: "Kata Kerja", desc: "Aksi menerima hadiah atau pertolongan dari orang." },
      { jp: "おくります", rom: "Okurimasu", translation: "Mengirim", type: "Kata Kerja", desc: "Mengirim parsel, paket cargo, pesanan." },
      { jp: "て", rom: "Te", translation: "Tangan / Jasa", type: "Kata Benda", desc: "Anggota tubuh utama pembuat karya." }
    ],
    grammarPoints: [
      {
        title: "Pola: Alat で Hasil KK dilakukan",
        explanation: "Partikel で (de) di sini mempertegas instrumen fisik atau sarana komunikasi yang dimanfaatkan demi meraih output.",
        exJp: "はしで日本料理を食べます。",
        exRom: "Hashi de Nihon ryouri o tabemasu.",
        exId: "Makan kuliner Jepang menggunakan sumpit.",
        commonMistakeJp: "日本語 に 手紙を書きます。",
        commonMistakeId: "Bahasa adalah alat komunikasi, maka wajib diringkas memakai partikel 'de' (Nihongo de tegami...).",
        drillText: "Sebut 'Menulis laporan dengan komputer':",
        drillSolution: "コンピューターでレポートを書きます"
      },
      {
        title: "Pola: Orang 1 は Orang 2 に Benda を あげます",
        explanation: "Menyerahkan kepunyaan (KB) kepada penerima manfaat (Orang 2) yang ditandai partikel に (ni).",
        exJp: "私はサリさんに花をあげました。",
        exRom: "Watashi wa Sari-san ni hana o agemashita.",
        exId: "Saya telah memberikan bunga kepada Sari.",
        commonMistakeJp: "私は 山田さん あげました。",
        commonMistakeId: "Lupa memasang partikel 'ni' setelah nama penerima.",
        drillText: "Tulis 'Memberi buku kepada guru (sensei)':",
        drillSolution: "先生に本をあげます"
      }
    ],
    sentencePatterns: [
      { pattern: "日本語でレポートを書きます。", meaning: "Menulis laporan dalam Bahasa Jepang." },
      { pattern: "私は木村さんに本をもらいました。", meaning: "Saya telah menerima buku dari Nyonya Kimura." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Menerima barang dari guru:",
        options: ["先生に辞書をもらいました", "先生は辞書をもらいました", "先生の辞書をあげました"],
        correct: "先生に辞書をもらいました",
        explanation: "Penerimaan 'Moraimasu' menautkan pemberi asal di belakang partikel 'ni' atau 'kara'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Hasami __ kami o kirimasu.",
        options: ["で (de)", "に (ni)", "を (wo)"],
        correct: "で (de)",
        explanation: "Gunting (hasami) merupakan alat pemotong, maka dipasangkan partikel で."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti 'Agemasu'?",
        options: ["Memberikan", "Menerima", "Meminjam"],
        correct: "Memberikan",
        explanation: "Agemasu adalah memberikan ke orang lain."
      }
    ],
    dialogue: [
      { speaker: "ルカ", textJp: "お誕生日に何をもらいましたか。", textRom: "Otanjoubi ni nani o moraimashita ka?", textId: "Apa yang sudah Anda terima di hari ulang tahun kemarin?" },
      { speaker: "サリ", textJp: "友達にきれいな時計をもらいました。", textRom: "Tomodachi ni kirei na tokei o moraimashita.", textId: "Saya menerima jam tangan indah dari teman." }
    ],
    quiz: [
      {
        question: "Jika menerima bantuan dari atasan di tempat kerja, akhiran sopan bernilai tinggi apa yang pas?",
        options: ["Moraimasita", "Agemasita", "Kuremasita"],
        answer: "Moraimasita",
        explanation: "'Moraimashita' dipakai sopan untuk aksi penerimaan."
      }
    ],
    cultureNote: "Saat memberikan hadiah, sebutkan kalimat penyertanya 'Tsumaranai mono desu ga...' (Ini barang sepele, tapi terimalah) demi merendah harian.",
    reviewSummary: [
      "Menguasai penunjuk alat 'de'.",
      "Memahami relasi memberi (Agemasu) vs menerima (Moraimasu)."
    ]
  },
  {
    id: 8,
    classLevel: "Kelas 2 (Dasar)",
    title: "Bab 8: Sifat Nyata di Mess & Tempat Kerja",
    theme: "Mendeskripsikan Fasilitas Kerja Baru",
    estimatedMinutes: 50,
    objectives: [
      "Membedakan Kata Sifat-i (i-Keiyoushi) dan Kata Sifat-na (na-Keiyoushi)",
      "Melatih bentuk konjugasi negatif kata sifat masa sekarang"
    ],
    vocabulary: [
      { jp: "おおい", rom: "Ooi", translation: "Banyak (jumlah)", type: "Kata Sifat-i", desc: "Kerapatan kuantitatif benda." },
      { jp: "おもしろい", rom: "Omoshiroi", translation: "Menarik / Lucu", type: "Kata Sifat-i", desc: "Sifat kognitif pemicu ketertarikan." },
      { jp: "しずか", rom: "Shizuka", translation: "Tenang / Sunyi", type: "Kata Sifat-na", desc: "Kondisi tanpa gaduh bising." },
      { jp: "べんり", rom: "Benri", translation: "Praktis / Berguna", type: "Kata Sifat-na", desc: "Membantu mengefisienkan kehidupan." },
      { jp: "たかい", rom: "Takai", translation: "Mahal / Tinggi", type: "Kata Sifat-i", desc: "Nilai nominal tinggi atau ukuran vertikal." }
    ],
    grammarPoints: [
      {
        title: "Pola: Golongan Kata Sifat -i (Hati-hati Akhiran)",
        explanation: "Kata sifat-i diakhiri langsung vokal 'i'. Jika dibantah, ganti akhiran 'i' menjadi 'kunai desu'. Contoh: takai (mahal) menjadi takakunai desu (tidak mahal). Pengecualian pada kata ii/yoi (bagus) berubah menjadi 'yokunai desu'.",
        exJp: "この部屋はあまり寒くないです。",
        exRom: "Kono heya wa amari samukunai desu.",
        exId: "Kamar ini tidak begitu dingin.",
        commonMistakeJp: "おもしろい じゃありません。",
        commonMistakeId: "Kata sifat-i dilarang ditautkan dengan ja arimasen. Yang benar adalah omoshirokunai desu.",
        drillText: "Ubah 'atsui' ke bentuk negatif:",
        drillSolution: "あつくない"
      },
      {
        title: "Pola: Golongan Kata Sifat -na",
        explanation: "Kata sifat-na memerlukan kata bantu 'na' jika menggandeng kata benda langsung. Bentuk negatifnya menggunakan 'ja arimasen' persis seperti kata benda biasa.",
        exJp: "ここの寮は静かじゃありません。",
        exRom: "Koko no ryou wa shizuka ja arimasen.",
        exId: "Asrama di sini tidaklah sepi.",
        commonMistakeJp: "静か なの 部屋",
        commonMistakeId: "Lupa atau salah mencampur 'no' ke kata sifat-na saat menerangkan benda, seharusnya memakai 'na' saja.",
        drillText: "Hubungkan 'Benri' dengan 'nomor telepon' (denwahangou):",
        drillSolution: "便利な電話番号"
      }
    ],
    sentencePatterns: [
      { pattern: "日本の食べ物は美味しいですが、高いです。", meaning: "Makanan Jepang enak, namun mahal harganya." },
      { pattern: "富士山は高い山です。", meaning: "Gunung Fuji adalah gunung yang tinggi." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Kamar ini bersih dan rapi (Kirei).",
        options: ["この部屋はきれいです", "この部屋はきれいくないです", "この部屋はきれいなです"],
        correct: "この部屋はきれいです",
        explanation: "Kirei adalah golongan kata sifat-na, maka langsung diakhiri desu."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Nihongo no benkyou wa __ desu.",
        options: ["おもしろい (omoshiroi)", "おもしろ (omoshiro)", "おもしろいな (omoshiroina)"],
        correct: "おもしろい (omoshiroi)",
        explanation: "Kata sifat-i langsung berdiri sebelum kata desu ketiadaan penyambung benda tambahan."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Negatif bebas dari 'Benri desu' (Praktis):",
        options: ["便利じゃありません", "便利くないです", "便利ではありませんでした"],
        correct: "便利じゃありません",
        explanation: "Kata sifat-na disangkal menggunakan ja arimasen."
      }
    ],
    dialogue: [
      { speaker: "ルカ", textJp: "新しい寮の生活はどうですか。", textRom: "Atarashii ryou no seikatsu wa dou desu ka?", textId: "Bagaimana kehidupan asrama barunya?" },
      { speaker: "サリ", textJp: "とてもにぎやかで、便利です。", textRom: "Totemo nigiyaka de, benri desu.", textId: "Sangat ramai, dan juga praktis." }
    ],
    quiz: [
      {
        question: "Manakah kata di bawah ini yang walau berakhiran vokal i tapi termasuk kata sifat-na?",
        options: ["Kirei", "Omoshiroi", "Samui"],
        answer: "Kirei",
        explanation: "Kirei dan yumei adalah kata sifat-na istimewa."
      }
    ],
    cultureNote: "Fasilitas umum di Jepang selalu terawat rapi demi prinsip 'Meiwaku o kakenai' (tidak menyusahkan atau mengotori hak orang lain).",
    reviewSummary: [
      "Menguasai konjugasi i-Keiyoushi (i menjadi kunai).",
      "Membedakan na-Keiyoushi dan pelekatan kata 'na'."
    ]
  },
  {
    id: 9,
    classLevel: "Kelas 3 (Terampil)",
    title: "Bab 9: Keahlian, Kesukaan & Hobimu",
    theme: "Membicarakan Evaluasi Kecakapan Kerja",
    estimatedMinutes: 45,
    objectives: [
      "Menggunakan partikel が (ga) untuk menyatakan hobi, paham, dan kecakapan",
      "Memahami perbedaan adverbia intensitas (yoku, daitai, sukoshi, amari)"
    ],
    vocabulary: [
      { jp: "わかります", rom: "Wakarimasu", translation: "Mengerti / Paham", type: "Kata Kerja", desc: "Memiliki pemahaman intelektual." },
      { jp: "すき", rom: "Suki", translation: "Suka (gemar)", type: "Kata Sifat-na", desc: "Ketertarikan positif pada benda/hal." },
      { jp: "じょうず", rom: "Jouzu", translation: "Pintar / Mahir", type: "Kata Sifat-na", desc: "Kemampuan hebat melakukan sesuatu." },
      { jp: "よく", rom: "Yoku", translation: "Dengan baik (sangat)", type: "Keterangan", desc: "Tingkatan pemahaman optimal." },
      { jp: "から", rom: "Kara", translation: "Karena (sebab)", type: "Kata Sambung", desc: "Penyambung klausul alasan kausalitas." }
    ],
    grammarPoints: [
      {
        title: "Pola: KB が 好きです / わかります / 下手です (Penggunaan Partikel Ga)",
        explanation: "Beberapa kata keadaan emosional/kemampuan seperti suki, kirai (benci), jouzu, dekimasu, dan wakarimasu mewajibkan partikel penanda objeknya berupa が (ga), bukan を (wo).",
        exJp: "わたしは日本語の会話がわかります。",
        exRom: "Watashi wa Nihongo no kaiwa ga wakarimasu.",
        exId: "Saya mengerti percakapan Bahasa Jepang.",
        commonMistakeJp: "りんご を 好きです。",
        commonMistakeId: "Kesalahan umum pemula meletakkan partikel 'wo' untuk kata gemar/suka 'suki'.",
        drillText: "Tulis 'Saya suka olahraga (supootsu)':",
        drillSolution: "私はスポーツが好きです"
      },
      {
        title: "Pola: Kalimat 1 から、Kalimat 2 (Sebab akibat)",
        explanation: "Kata から (kara) di tengah kalimat berfungsi layaknya kata hubung 'karena'. Digunakan di ujung kalimat alasan sebelum kalimat simpulan.",
        exJp: "時間がありませんから、タクシーで行きます。",
        exRom: "Jikan ga arimasen kara, takushii de ikimasu.",
        exId: "Karena tidak ada waktu, saya pergi naik taksi.",
        commonMistakeJp: "から 時間がありません",
        commonMistakeId: "Menaruh kata 'kara' di depan alasan layaknya struktur bahasa Indonesia, seharusnya di belakang klausa pendukung.",
        drillText: "Sambung 'karena sibuk (isogashii)' dengan 'tidak pergi':",
        drillSolution: "忙しいですから、行きません"
      }
    ],
    sentencePatterns: [
      { pattern: "サリさんは料理が上手です。", meaning: "Sari sangat mahir memasak hidangan." },
      { pattern: "英語が少しわかります。", meaning: "Saya paham sedikit Bahasa Inggris." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Saya tidak begitu mengerti Kanji.",
        options: ["漢字があまりわかりません", "漢字がよくわかります", "漢字は全然わかります"],
        correct: "漢字があまりわかりません",
        explanation: "Kata 'amari' (tidak begitu) wajib diikuti kata kerja bentuk negatif (Wakarimasen)."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Utamasan wa uta __ jouzu desu.",
        options: ["が (ga)", "を (wo)", "に (ni)"],
        correct: "が (ga)",
        explanation: "Sifat kemahiran/keahlian ditautkan dengan partikel 'ga'."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Arti dari 'Kara' jika terletak di akhir klausa sebab:",
        options: ["Karena", "Sejak", "Sebelum"],
        correct: "Karena",
        explanation: "Klausa + kara artinya karena / alasan pemicu."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "ルカさんは辛い料理が好きですか。", textRom: "Ruka-san wa karai ryouri ga suki desu ka?", textId: "Apakah Ruka menyukai kuliner yang pedas?" },
      { speaker: "ルカ", textJp: "いいえ、胃が弱いですから、あまり好きじゃありません。", textRom: "Iie, i ga yowai desu kara, amari suki ja arimasen.", textId: "Tidak, karena lambung saya lemah, saya tidak begitu menyukainya." }
    ],
    quiz: [
      {
        question: "Jika ingin menyatakan 'Secara total sama sekali tidak tahu', pasangan frasa apa yang tepat?",
        options: ["Zenzen wakarimasen", "Yoku wakarimasen", "Sukoshi wakarimasen"],
        answer: "Zenzen wakarimasen",
        explanation: "Zenzen (sama sekali tidak) wajib digandeng dengan negatif total."
      }
    ],
    cultureNote: "Memuji kemampuan seseorang di tempat kerja sangat dinilai baik. Walau demikian, tanggapi selalu dengan kalimat rendah hati 'Iie, mada mada desu' (Tidak, saya masih banyak belajar).",
    reviewSummary: [
      "Menguasai partikel 'ga' pengiring kognitif.",
      "Mengekspresikan klausul kausalitas sebab-akibat dengan 'kara'."
    ]
  },
  {
    id: 10,
    classLevel: "Kelas 3 (Terampil)",
    title: "Bab 10: Letak Barang & Keberadaan Orang",
    theme: "Menata Alat Kerja di Gudang Pabrik",
    estimatedMinutes: 45,
    objectives: [
      "Membedakan fungsi arimasu (benda mati) dan imasu (makhluk hidup)",
      "Menerangkan posisi dengan kosakata spasial (ue, sita, naka, tonari, dsb)"
    ],
    vocabulary: [
      { jp: "あります", rom: "Arimasu", translation: "Ada (benda mati)", type: "Kata Kerja", desc: "Keberadaan barang non-organis." },
      { jp: "います", rom: "Imasu", translation: "Ada (makhluk bernyawa)", type: "Kata Kerja", desc: "Keberadaan manusia, hewan, pekerja." },
      { jp: "うえ", rom: "Ue", translation: "Atas", type: "Posisi", desc: "Letak vertikal tinggi." },
      { jp: "なか", rom: "Naka", translation: "Dalam", type: "Posisi", desc: "Letak internal volume tertutup." },
      { jp: "となりの", rom: "Tonari no", translation: "Tepat di sebelah", type: "Posisi", desc: "Tetangga arah berdampingan serumpun." }
    ],
    grammarPoints: [
      {
        title: "Pola: KB (Tempat) に KB (Benda) が あります / います",
        explanation: "Partikel に (ni) berfungsi menandai lokasi diam tempat bernaung. Gunakan 'Arimasu' jika subjek adalah benda tidak hidup (meja, mesin, pensil). Gunakan 'Imasu' jika subjek adalah manusia atau binatang bernyawa.",
        exJp: "事務所に社長がいます。",
        exRom: "Jimusho ni shachou ga imasu.",
        exId: "Ada direktur utama di ruang kantor.",
        commonMistakeJp: "庭 に 犬 が あります。",
        commonMistakeId: "Anjing (Inu) adalah mahluk bernyawa, maka wajib memakai 'imasu' bukan 'arimasu'.",
        drillText: "Katakan 'Ada berkas laporan di atas meja':",
        drillSolution: "机の上にレポートがあります"
      },
      {
        title: "Pola: KB1 の Arah Posisi (Menjelaskan Letak Detil)",
        explanation: "Gabungkan kata benda dengan arah memakai partikel kepunyaan 'no'. Contoh: tsukue no ue (atas meja), hako no naka (dalam kotak).",
        exJp: "箱の中に古い鍵があります。",
        exRom: "Hako no naka ni furui kagi ga arimasu.",
        exId: "Ada kunci lama di dalam kotak.",
        commonMistakeJp: "机 下 に",
        commonMistakeId: "Lupa menyisipkan partikel 'no' di antara benda utama dan arah spasial.",
        drillText: "Ucapkan 'di samping asrama' (ryou no tonari):",
        drillSolution: "寮の隣"
      }
    ],
    sentencePatterns: [
      { pattern: "私の部屋にエアコンがあります。", meaning: "Ada AC di dalam kamar saya." },
      { pattern: "あそこにだれがいますか。", meaning: "Ada siapa di sebelah sana?" }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Ada kucing di bawah kursi.",
        options: ["いすの下に猫がいます", "いすの上に猫があります", "いすの下に猫があります"],
        correct: "いすの下に猫がいます",
        explanation: "Di bawah kursi (isu no shita) + kucing (makhluk hidup: imasu)."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Reizouko no naka __ mizu ga arimasu.",
        options: ["に (ni)", "で (de)", "は (wa)"],
        correct: "に (ni)",
        explanation: "Lokasi keberadaan benda statis wajib memakai partikel に."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Sebutkan mana yang memakai 'Arimasu':",
        options: ["Kipas angin (senpuuki)", "Anak anjing (inu)", "Guru Jepang"],
        correct: "Kipas angin (senpuuki)",
        explanation: "Kipas angin adalah benda mati."
      }
    ],
    dialogue: [
      { speaker: "ルカ", textJp: "すみません、ハサmiはどこにありますか。", textRom: "Sumimasen, hasami wa doko ni arimasu ka?", textId: "Maaf, gunting ada di sebelah mana?" },
      { speaker: "山田", textJp: "机の引き出しの中にありますよ。", textRom: "Tsukue no hikidashi no naka ni arimasu yo.", textId: "Ada di dalam laci meja lho." }
    ],
    quiz: [
      {
        question: "Partikel apa yang bertugas meletakkan subjek eksistensi di depan kata arimasu/imasu?",
        options: ["Ga", "Wo", "De"],
        answer: "Ga",
        explanation: "Subjek eksistensi ditandai partikel が (ga) sebelum kata kerja keberadaan."
      }
    ],
    cultureNote: "Di Jepang, setiap barang yang dipinjam harus dikembalikan persis ke lokasi asalnya sepresisi mungkin agar tidak mengganggu operasional rekan kerja tim.",
    reviewSummary: [
      "Menguasai pembagian Arimasu vs Imasu.",
      "Mengembangkan navigasi tata letak dengan penunjuk arah spasial 'no naka/ue/shita/tonari'."
    ]
  },
  {
    id: 11,
    classLevel: "Kelas 4 (Menengah)",
    title: "Bab 11: Menghitung Barang, Durasi Kerja & Gaji",
    theme: "Prosedur Penghitungan Paket Kargo",
    estimatedMinutes: 50,
    objectives: [
      "Mampu menggunakan kata bantu bilangan harian (hitotsu, futatsu / mai, dai)",
      "Menyatakan durasi waktu dan frekuensi kerja secara terukur"
    ],
    vocabulary: [
      { jp: "ひとつ", rom: "Hitotsu", translation: "Satu buah (umum)", type: "Counter", desc: "Cara menghitung benda bulat atau tak tentu." },
      { jp: "ふたつ", rom: "Futatsu", translation: "Dua buah (umum)", type: "Counter", desc: "Dua unit barang harian." },
      { jp: "〜まい", rom: "〜Mai", translation: "〜 lembar (tipis)", type: "Counter", desc: "Penghitung kertas, kaos, prangko." },
      { jp: "〜だい", rom: "〜Dai", translation: "〜 unit (mesin/kendaraan)", type: "Counter", desc: "Penghitung mobil, komputer, mesin pabrik." },
      { jp: "どのくらい", rom: "Dono kurai", translation: "Berapa lama / seberapa banyak", type: "Kata Tanya", desc: "Bertanya jangka masa waktu tempuh." }
    ],
    grammarPoints: [
      {
        title: "Pola: Kata Bantu Bilangan (Counter Words Jepang)",
        explanation: "Bahasa Jepang memiliki penggolong hitungan khusus. Kata bantu bilangan diletakkan setelah partikel pengiring benda murni langsung sebelum kata kerja. Contoh: Kertas (Kami) dipasangkan dengan '〜枚 (mai)', Komputer dipasangkan dengan '〜台 (dai)'.",
        exJp: "コピーを５枚してください。",
        exRom: "Kopii o go-mai shite kudasai.",
        exId: "Tolong fotokopi sebanyak 5 lembar.",
        commonMistakeJp: "５枚 コピー を します。",
        commonMistakeId: "Menumpuk angka di depan objek langsung benda mengabaikan aliran struktur pembilang setelah partikel.",
        drillText: "Katakan 'Membeli komputer 2 unit (dai)':",
        drillSolution: "パソコンを２台買います"
      },
      {
        title: "Pola: Durasi Waktu di rumpang kalimat (Tanpa partikel tambahan)",
        explanation: "Untuk menerangkan durasi atau rentang waktu aktivitas, jangka waktunya diletakkan langsung sebelum kata kerja tanpa partikel pengikat.",
        exJp: "私は日本に３年います。",
        exRom: "Watashi wa Nihon ni san-nen imasu.",
        exId: "Saya tinggal di Jepang selama 3 tahun.",
        commonMistakeJp: "三年に 働きます。 (Menyatakan durasi)",
        commonMistakeId: "Jika menyatakan 'lamanya waktu berjalan', dilarang menyelipkan partikel 'ni'. Partikel 'ni' diposisikan jika menunjuk titik waktu mutlak.",
        drillText: "Ucapkan 'belajar jam 2 jam':",
        drillSolution: "二時間勉強します"
      }
    ],
    sentencePatterns: [
      { pattern: "みかんを４つ買いました。", meaning: "Telah membeli buah jeruk sebanyak 4 buah." },
      { pattern: "一か月に２回映画を見ます。", meaning: "Melihat bioskop film sebanyak 2 kali dalam sebulan." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Tolong berikan saya 2 lembar tiket.",
        options: ["チケットを２枚ください", "チケットの２台ください", "チケットが２つください"],
        correct: "チケット waking_up を２枚ください",
        explanation: "Kecocokan lembaran tipis (kertas/tiket) diduplikasi dengan counter 'mai'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Kuni kara Nihon made dono kurai __ kakarimasu ka.",
        options: ["(tanpa partikel)", "に (ni)", "で (de)"],
        correct: "(tanpa partikel)",
        explanation: "'Dono kurai' (seberapa lama) langsung disandingkan dengan kata kerja 'kakarimasu'."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Golongan penghitung mesin adalah:",
        options: ["〜台 (dai)", "〜枚 (mai)", "〜人 (nin)"],
        correct: "〜台 (dai)",
        explanation: "'Dai' dipakai untuk mobil, PC, mesin sirkuit."
      }
    ],
    dialogue: [
      { speaker: "実習生", textJp: "一日何時間働きますか。", textRom: "Ichinichi nan-jikan hatarakimasu ka?", textId: "Berapa jam Anda bekerja dalam satu hari?" },
      { speaker: "班長", textJp: "８時間働きます。一時間休憩があります。", textRom: "Hachi-jikan hatarakimasu. Ichi-jikan kyuukei ga arimasu.", textId: "Bekerja selama 8 jam. Ada istirahat 1 jam." }
    ],
    quiz: [
      {
        question: "Pilihan paling pas untuk menanyakan 'Seberapa lama waktu perjalanan pesawat' adalah?",
        options: ["Dono kurai kakarimasu ka", "Ikura kakarimasu ka", "Nani kakarimasu ka"],
        answer: "Dono kurai kakarimasu ka",
        explanation: "Dono kurai bermakna bertanya durasi waktu tempuh."
      }
    ],
    cultureNote: "Cuti berbayar (Yuukyuu) di Jepang sangat dihargai, namun bicarakan selalu jauh-jauh hari dengan supervisor tim agar tidak pincang operasional.",
    reviewSummary: [
      "Menguasai sistem counter hitungan barang.",
      "Mengekspresikan total durasi perbuatan harian secara presisi."
    ]
  },
  {
    id: 12,
    classLevel: "Kelas 4 (Menengah)",
    title: "Bab 12: Memilih Suku Cadang & Cuaca Terbaik",
    theme: "Perbandingan Komparasi Kinerja Mesin & Cuaca",
    estimatedMinutes: 50,
    objectives: [
      "Mampu menggunakan konjugasi waktu lampau kata sifat (i & na)",
      "Membentuk konseptual perbandingan (A yori B no hou ga...)",
      "Menentukan preferensi terunggul dalam sekelompok benda"
    ],
    vocabulary: [
      { jp: "あつい", rom: "Atsui", translation: "Panas (suhu/cuaca)", type: "Kata Sifat-i", desc: "Keadaan iklim termometer tinggi." },
      { jp: "あめ", rom: "Ame", translation: "Hujan", type: "Kata Benda", desc: "Tetesan air langit." },
      { jp: "より", rom: "Yori", translation: "Daripada", type: "Partikel", desc: "Pembanding inferior acuan utama." },
      { jp: "のほうが", rom: "No hou ga", translation: "Lebih... (arah pilihan)", type: "Ungkapan", desc: "Subjek utama yang memiliki derajat lebih tinggi." },
      { jp: "いちばん", rom: "Ichiban", translation: "Nomor satu / paling", type: "Keterangan", desc: "Tingkatan puncak komparatif superlative." }
    ],
    grammarPoints: [
      {
        title: "Pola: Konjugasi Masa Lampau Kata Sifat (Keiyoushi)",
        explanation: "Konjugasi lampau sangat krusial: Kata sifat-i diganti akhiran 'i' menjadi 'katta desu'. Contoh: samui (dingin) -> samukatta desu (kemarin dingin). Kata sifat-na ditambah akhiran 'deshita'. Contoh: kirei desu -> kirei deshita.",
        exJp: "昨日の試験は難しかったです。",
        exRom: "Kinou no shiken wa muzukashikatta desu.",
        exId: "Ujian kemarin rasanya sangat sulit.",
        commonMistakeJp: "昨日は さむい でした。",
        commonMistakeId: "Membentuk lampau kata sifat-i dengan penambahan 'deshita'. Seharusnya 'samukatta desu'.",
        drillText: "Ubah 'omoshiroi' ke lampau positif:",
        drillSolution: "おもしろかった"
      },
      {
        title: "Pola: KB1 より KB2 のほうが Sifat です (A dibanding B, B lebih...)",
        explanation: "Pola perbandingan dasar. Menetapkan KB1 sebagai dasar acuan perbandingan daripada, dan memposisikan KB2 sebagai pihak yang lebih unggul sifatnya.",
        exJp: "日本語のほうが英語より簡単です。",
        exRom: "Nihongo no hou ga Eigo yori kantan desu.",
        exId: "Bahasa Jepang lebih mudah daripada Bahasa Inggris.",
        commonMistakeJp: "英語 より 日本語 です ほしい。",
        commonMistakeId: "Salah merangkai penyusunan urutan kata hou ga dan yori.",
        drillText: "Katakan 'Bus lebih murah dibanding Shinkansen yori':",
        drillSolution: "バスのほうが新幹線より安いです"
      }
    ],
    sentencePatterns: [
      { pattern: "昨日は天気がよかったです。", meaning: "Cuaca kemarin sangat bagus." },
      { pattern: "一年の中で日本が一番寒いです。", meaning: "Di dalam setahun Jepang paling dingin." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Cuaca kemarin tidak begitu bagus.",
        options: ["昨日の天気はあまりよくなかったです", "昨日の天気はあまりよくなかったでした", "昨日の天気はあまりよくないでした"],
        correct: "昨日の天気はあまりよくなかったです",
        explanation: "Negatif lampau 'ii' (bagus) bermetamorfosis menjadi 'yokunakatta desu'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Hikoouki to Shinkansen to dochira __ hayai desu ka.",
        options: ["が (ga)", "を (wo)", "に (ni)"],
        correct: "が (ga)",
        explanation: "Menanyakan pilihan antara dua instrumen menggunakan partikel 'ga'."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah padanan makna 'Ichiban'?",
        options: ["Paling / Nomor satu", "Mungkin", "Tidak sama sekali"],
        correct: "Paling / Nomor satu",
        explanation: "Ichiban merepresentasikan posisi superlatif terunggul harian."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "日本とインドネシアと、どちらが暑いですか。", textRom: "Nihon to Indonesia to, dochira ga atsui desu ka?", textId: "Antara Jepang dan Indonesia, mana yang lebih panas?" },
      { speaker: "ルカ", textJp: "インドネシアのほうがずっと暑いです。", textRom: "Indonesia no hou ga zutto atsui desu.", textId: "Indonesia jauh lebih panas." }
    ],
    quiz: [
      {
        question: "Jika ingin membentuk kalimat 'Di antara semua buah, apel paling saya sukai', mana kata penanda kelompok yang pas?",
        options: ["Kudamono no naka de", "Kudamono no kara", "Kudamono no to"],
        answer: "Kudamono no naka de",
        explanation: "Gunakan 'A no naka de' untuk menegaskan rumpun lingkup superlative."
      }
    ],
    cultureNote: "Empat musim di Jepang (S四季 - Shiki) memiliki pesona berbeda. Saat musim dingin, jangan lupa mengenakan penghangat tumpuk Kairo agar asmara belajar tidak pudar dingin.",
    reviewSummary: [
      "Menguasai tenses lampau i-Keiyoushi dan na-Keiyoushi.",
      "Mengajukan perbandingan dua unsur (dochira) atau superlatif (ichiban)."
    ]
  }
];
