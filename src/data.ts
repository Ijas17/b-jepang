/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadmapPhase, VocabularyWord, ParticleQuestion, SentencePuzzle, AmbientTrack } from './types';

export const ROADMAP_DATA: RoadmapPhase[] = [
  {
    id: 0,
    title: "Fase 0: Orientasi & Struktur Dasar",
    subtitle: "Pintu Masuk Bahasa Jepang",
    target: "Paham cara belajar, tata bahasa umum, dan silsilah aksara.",
    description: "Mempelajari perbedaan Hiragana, Katakana, dan Kanji, serta karakteristik khas Bahasa Jepang seperti urutan kalimat (Subjek - Objek - Predikat) dan fungsi partikel.",
    themes: ["Ciri Khas Bahasa Jepang", "Aksara & Pengucapan", "Konsep Partikel", "Ungkapan Kelas Dasar"],
    grammarPoints: ["Struktur SOP (Subjek-Objek-Predikat)", "Predikat Kata Benda / Kerja", "Penghilangan komponen jika konteks sudah jelas"],
    lessonReferences: ["Materi Pengantar Umum"]
  },
  {
    id: 1,
    title: "Fase 1: Hiragana Total",
    subtitle: "Kunci Membaca Bunyi Asli",
    target: "Membaca semua karakter Hiragana secara lancar tanpa mengeja.",
    description: "Membasmi buta aksara Jepang dengan menguasai 46 huruf dasar, bunyi turunan (Dakuten & Handakuten), vokal panjang, bunyi kecil (Sokuon 'tsu' & Yoon 'ya/yu/yo').",
    themes: ["Vokal Dasar (あいうえお)", "Baris Konsonan K-S-T-N-H-M-Y-R-W", "Bunyi Sengau (ん)", "Dakuten (がざだば)", "Bunyi Kecap (っ)", "Yoon (きゃ、しゅ)"],
    grammarPoints: ["Suku kata & Mora", "Perbedaan panjang vokal yang mengubah arti", "Jeda mora bunyi kecil"],
    lessonReferences: ["Introduksi Aksara Utama"]
  },
  {
    id: 2,
    title: "Fase 2: Katakana Total & Kata Serapan",
    subtitle: "Bahasa Modern di Jepang",
    target: "Lancar membaca kosakata serapan asing (Gairaigo).",
    description: "Mempelajari Katakana dasar serta kombinasi bunyi modern seperti 'ti', 'fa', 'di' yang sering dipakai untuk transkripsi teknologi, nama asing, dan menu restoran.",
    themes: ["Aksara Katakana Lengkap", "Kombinasi Bunyi Modern", "Kosakata Serapan Sehari-hari (テレビ, コーヒー)", "Penulisan Nama Asing"],
    grammarPoints: ["Tanda vokal panjang (ー)", "Membaca menu asing praktis"],
    lessonReferences: ["Materi Aksara Katakana"]
  },
  {
    id: 3,
    title: "Fase 3: Kalimat Dasar Harian",
    subtitle: "Tata Bahasa Minna no Nihongo (Bab 1 - 6)",
    target: "Membangun kalimat dasar perkenalan, kepemilikan, jam, arah, dan kata kerja harian.",
    description: "Mulai berbicara dalam pola tata bahasa formal formal dengan menguji coba interaksi nyata seperti mengenalkan diri, bertanya harga, berbelanja di toserba, dan membuat janji temu harian.",
    themes: ["Pelajaran 1: Perkenalan Diri (〜は〜です)", "Pelajaran 2: Benda di Sekitar (これ/それ/あれ)", "Pelajaran 3: Arah & Lokasi (ここ/そこ)", "Pelajaran 4: Jam & Waktu", "Pelajaran 5: Transportasi & Hari Libur", "Pelajaran 6: Makanan & Undangan Bersama"],
    grammarPoints: [
      "X は Y です (X adalah Y)",
      "Kata Tanya (ですか, どこ, なん)",
      "Partikel Kepemilikan (の)",
      "Arah & Tempat (〜は tempat です)",
      "Kata Kerja Sopan (〜ます / 〜ません)",
      "Partikel Arah (へ) & Transportasi (で)",
      "Ajakan Halus (〜ませんか / 〜ましょう)"
    ],
    lessonReferences: ["Minna no Nihongo I: Pelajaran 1 - 6"]
  },
  {
    id: 4,
    title: "Fase 4: Tata Bahasa Inti & Konjugasi",
    subtitle: "Minna no Nihongo (Bab 7 - 12)",
    target: "Menguasai Kata Sifat, preferensi, memberi/menerima hadiah, dan perbandingan.",
    description: "Mulai memahami konjugasi waktu lampau, negatif kata sifat (い & な), mengekspresikan hobi, kemampuan dasar, dan menilai preferensi terbaik dalam perbandingan.",
    themes: ["Pelajaran 7: Alat, Bahasa, & Pemberian", "Pelajaran 8: Kata Sifat Kehidupan (い/な)", "Pelajaran 9: Hobi & Suka/Benci (が 好きです)", "Pelajaran 10: Letak Posisi Benda (あります/います)", "Pelajaran 11: Menghitung Barang (Counter)", "Pelajaran 12: Banding-Membandingkan (より, いちばん)"],
    grammarPoints: [
      "Pemberian: あげる / くれる / もらう (Bentuk SOP)",
      "Kata Sifat Positif & Negatif",
      "Suka / Paham (が 好きです / が わかります)",
      "Ada Benda & Makhluk Hidup (あります / います)",
      "Satuan Bilangan & Counter (Kata Bantu Bilangan)",
      "Perbandingan Terunggul (A の中で B が いちばん Sifat です)"
    ],
    lessonReferences: ["Minna no Nihongo I: Pelajaran 7 - 12"]
  },
  {
    id: 5,
    title: "Fase 5: Dunia Kata & Konteks Nyata",
    subtitle: "Kamus Ekspresi Praktis harian",
    target: "Menggunakan 1500 kosakata tematik dalam konteks yang lazim digunakan.",
    description: "Di fase ini fokus belajar tidak sekadar menghafal, tapi dialihkan ke penggunaan kosakata tematik seperti bagian tubuh, cuaca, belanja, transportasi, dan perasaaan nyata.",
    themes: ["Organ Tubuh & Sakit", "Suasana Rumah & Perlengkapan", "Jalur Transportasi Stasiun", "Menu Restoran & Pelayanan", "Cuaca & Fenomena Alam"],
    grammarPoints: [
      "Pemakaian Kata Keterangan Intensitas (とても, あまり, 全然)",
      "Pembedaan kata nominal & verba sesuai situasi",
      "Penggunaan kata sambung (から, が, そして)"
    ],
    lessonReferences: ["Kamus Tematik RukaaIjass"]
  },
  {
    id: 6,
    title: "Fase 6: Kanji Bertahap (300 Kanji Utama)",
    subtitle: "Lukisan Arti Bahasa Jepang",
    target: "Mengenali kanji harian secara bertahap tanpa menghafal kaku.",
    description: "Belajar kanji berdasarkan konsep Radikal (komponen pembentuk) didampingi cara baca onyomi dan kunyomi praktis untuk membaca plang jalan, menu makanan, dan chat digital.",
    themes: ["Kanji Angka & Waktu", "Kanji Manusia & Relasi", "Kanji Alam & Tempat Umum", "Kanji Tindakan (Melihat, Makan, Membaca)"],
    grammarPoints: [
      "Kombinasi dua kanji (Jukugo)",
      "Perubahan cara baca sesuai gabungan kalimat & furigana"
    ],
    lessonReferences: ["Kanji Lab: N5-N4 Essential"]
  },
  {
    id: 7,
    title: "Fase 7: Listening & Speaking Interaktif",
    subtitle: "Simulasi Roleplay Percakapan",
    target: "Terbiasa mendengar logat asli dan merespons lancar.",
    description: "Pelatihan interaktif mendengarkan dialog sehari-hari di konbini, stasiun, memesan makanan, hingga simulasi memecahkan masalah darurat dengan dialog bercabang.",
    themes: ["Belanja di Konbini (Tolong Ini)", "Bertanya Arah Jalan (Midoricho)", "Memesan Makanan & Reservasi", "Menelepon Teman & Mengajak Janjian"],
    grammarPoints: [
      "Bentuk Sopan vs Kasual",
      "Intonasi pertanyaan & respons cepat",
      "Gaya potong bicara natural Jepang"
    ],
    lessonReferences: ["Minna no Nihongo II: Percakapan Utama"]
  },
  {
    id: 8,
    title: "Fase 8: Kelancaran Menyeluruh",
    subtitle: "Lancar Berkomunikasi Tanpa Ragu",
    target: "Memelihara percakapan seimbang dan membaca teks otentik sederhana.",
    description: "Fase akhir di mana Anda merespons skenario tidak terduga, membaca poster, menu jepang asli, serta mengirim pesan chat kasual ke teman tanpa menerjemahkan di dalam kepala.",
    themes: ["Percakapan Multi-Langkah", "Membaca Menu & Poster Kyoto", "Menulis Pesan Harian LINE", "Ekspresi Akrab Alami"],
    grammarPoints: [
      "Anak kalimat menerangkan kata benda",
      "Pengkondisian bersyarat (たら, と, なら)",
      "Tata bahasa kasual harian total"
    ],
    lessonReferences: ["Checkpoints Kelancaran Akrab"]
  }
];

export const VOCABULARY_DATA: VocabularyWord[] = [
  // Pelajaran 1
  {
    id: "v1",
    word: "はじめまして",
    reading: "Hajimemashite",
    translation: "Perkenalkan (salam kenal mula-mula)",
    category: "Ungkapan",
    exampleJa: "はじめまして、私はルカです。",
    exampleId: "Perkenalkan, saya adalah Ruka.",
    partOfSpeech: "Ungkapan",
    label: "Pelajaran 1"
  },
  {
    id: "v2",
    word: "私",
    reading: "Watashi",
    translation: "Saya / Aku",
    category: "Kata Benda",
    exampleJa: "私はインドネシア人です。",
    exampleId: "Saya adalah orang Indonesia.",
    partOfSpeech: "Kata Benda",
    label: "Pelajaran 1"
  },
  {
    id: "v3",
    word: "どうぞ よろしく お願いします",
    reading: "Douzo yoroshiku onegaishimasu",
    translation: "Senang bertemu dengan Anda (mohon bantuannya)",
    category: "Ungkapan",
    exampleJa: "ルカです。どうぞよろしくおねがいします。",
    exampleId: "Saya Ruka. Senang bertemu dengan Anda.",
    partOfSpeech: "Ungkapan",
    label: "Pelajaran 1"
  },
  // Pelajaran 2
  {
    id: "v4",
    word: "これ",
    reading: "Kore",
    translation: "Ini (dekat pembicara)",
    category: "Kata Benda",
    exampleJa: "これは日本語の本です。",
    exampleId: "Ini adalah buku Bahasa Jepang.",
    partOfSpeech: "Kata Benda",
    label: "Pelajaran 2"
  },
  {
    id: "v5",
    word: "そうですか",
    reading: "Sou desu ka",
    translation: "Begitukah? / Oh, begitu...",
    category: "Ungkapan",
    exampleJa: "「これは私の時計です。」「そうですか。」",
    exampleId: "\"Ini adalah jam tangan saya.\" \"Begitukah?\"",
    partOfSpeech: "Ungkapan",
    label: "Pelajaran 2"
  },
  // Pelajaran 3
  {
    id: "v6",
    word: "ここ",
    reading: "Koko",
    translation: "Di sini (dekat pembicara)",
    category: "Kata Benda",
    exampleJa: "ここは教室です。",
    exampleId: "Di sini adalah ruang kelas.",
    partOfSpeech: "Kata Benda",
    label: "Pelajaran 3"
  },
  {
    id: "v7",
    word: "を ください",
    reading: "〜 o kudasai",
    translation: "Tolong berikan saya [benda] / Minta asupan [benda]",
    category: "Ungkapan",
    exampleJa: "このコーヒーをください。",
    exampleId: "Tolong berikan kopi yang ini.",
    partOfSpeech: "Ungkapan",
    label: "Pelajaran 3"
  },
  // Pelajaran 6
  {
    id: "v8",
    word: "一緒に",
    reading: "Issho ni",
    translation: "Bersama-sama",
    category: "Keterangan",
    exampleJa: "一緒に行きましょう。",
    exampleId: "Mari kita pergi bersama-sama.",
    partOfSpeech: "Keterangan",
    label: "Pelajaran 6"
  },
  {
    id: "v9",
    word: "食べます",
    reading: "Tabemasu",
    translation: "Makan",
    category: "Kata Kerja",
    exampleJa: "朝ご飯を食べます。",
    exampleId: "Saya makan sarapan pagi.",
    partOfSpeech: "Kata Kerja",
    label: "Pelajaran 6"
  }
];

export const PARTICLE_QUESTIONS: ParticleQuestion[] = [
  {
    sentence: "私 __ インドネシア人です。",
    translation: "Saya adalah orang Indonesia.",
    options: ["は (wa)", "が (ga)", "を (wo)", "の (no)"],
    correctAnswer: "は (wa)",
    explanation: "Partikel 'は (wa)' dipakai untuk menandai topik utama dalam kalimat."
  },
  {
    sentence: "これは日本語 __ 本です。",
    translation: "Ini adalah buku Bahasa Jepang.",
    options: ["の (no)", "に (ni)", "で (de)", "は (wa)"],
    correctAnswer: "の (no)",
    explanation: "Partikel 'の (no)' menghubungkan kata benda asal/kepemilikan (Bahasa Jepang) untuk menerangkan kata benda berikutnya (buku)."
  },
  {
    sentence: "箸 __ 日本料理を食べます。",
    translation: "Makan hidangan Jepang menggunakan sumpit.",
    options: ["で (de)", "を (wo)", "に (ni)", "へ (he)"],
    correctAnswer: "で (de)",
    explanation: "Partikel 'で (de)' menandakan alat, sarana, atau metode yang digunakan untuk melakukan aktivitas."
  },
  {
    sentence: "水 __ 飲みます。",
    translation: "Minum air.",
    options: ["を (wo)", "が (ga)", "に (ni)", "で (de)"],
    correctAnswer: "を (wo)",
    explanation: "Partikel 'を (wo)' digunakan untuk menandai objek penderita dari kata kerja transitif (nomi-masu / minum)."
  }
];

export const SENTENCE_PUZZLES: SentencePuzzle[] = [
  {
    scrambledWords: ["です", "は", "日本語", "これ"],
    correctOrder: ["これ", "は", "日本語", "です"],
    meaning: "Ini adalah Bahasa Jepang.",
    hintJa: "これは日本語です。"
  },
  {
    scrambledWords: ["行きます", "へ", "学校", "私", "は"],
    correctOrder: ["私", "は", "学校", "へ", "行きます"],
    meaning: "Saya pergi ke sekolah.",
    hintJa: "私は学校へ行きます。"
  },
  {
    scrambledWords: ["食べましょう", "を", "ラーメン", "一緒に"],
    correctOrder: ["一緒に", "ラーメン", "を", "食べましょう"],
    meaning: "Mari makan ramen bersama-sama.",
    hintJa: "一緒にラーメンを食べましょう。"
  }
];

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: "t1",
    title: "Quiet Kyoto Sunset",
    mood: "Soft Japanese Lofi",
    sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "t2",
    title: "Midnight Shinjuku Beats",
    mood: "Calm Focus Lofi",
    sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "t3",
    title: "Nara Forest Rain",
    mood: "Nature Ambient + Piano",
    sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

export const UNGKAPAN_KELAS_SALAM = [
  { jp: "始めましょう (Hajimemashou)", id: "Mari kita mulai lekuk belajar.", cat: "Ungkapan Kelas" },
  { jp: "終わりましょう (Owarimashou)", id: "Mari akhiri pelajaran ini.", cat: "Ungkapan Kelas" },
  { jp: "わかりますか (Wakarimasu ka)", id: "Apakah Anda sudah mengerti?", cat: "Ungkapan Kelas" },
  { jp: "もう一度お願いします (Mou ichido onegai shimasu)", id: "Tolong sekali lagi.", cat: "Ungkapan Kelas" },
  { jp: "おはようございます (Ohayou gozaimasu)", id: "Selamat pagi (Sopan).", cat: "Salam Sehari-hari" },
  { jp: "こんにちは (Konnichiwa)", id: "Selamat siang / sore.", cat: "Salam Sehari-hari" },
  { jp: "こんばんは (Konnbanwa)", id: "Selamat malam.", cat: "Salam Sehari-hari" },
  { jp: "お休みなさい (Oyasuminasai)", id: "Selamat tidur (Sopan).", cat: "Salam Sehari-hari" },
  { jp: "ありがとうございます (Arigatou gozaimasu)", id: "Terima kasih banyak.", cat: "Salam Sehari-hari" },
  { jp: "すみません (Sumimasen)", id: "Maaf / Permisi.", cat: "Salam Sehari-hari" }
];
