/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyWord {
  id: string;
  jp: string;
  rom: string;
  translation: string;
  type: string;
  desc: string;
  jlpt: 'N5' | 'N4';
  bab: number;
}

/**
 * Japanese-Indonesian Vocabulary Database for JLPT N5 and N4.
 * Spans Chapters (Bab) 1 through 25, including Noun, Verb, Adjective, Adverb, Particle, and Expression categories.
 */
export const VOCABULARY_DATABASE: VocabularyWord[] = [
  // --- BAB 1 (JLPT N5): Perkenalan Diri ---
  { id: "v1_1", jp: "わたし", rom: "Watashi", translation: "Saya / Aku", type: "Kata Ganti", desc: "Sopan umum, wajib dikuasai untuk perkenalan resmi.", jlpt: "N5", bab: 1 },
  { id: "v1_2", jp: "がくせい", rom: "Gakusei", translation: "Siswa / Pelajar", type: "Kata Benda", desc: "Menggambarkan pelajar sekolah atau pembelajar.", jlpt: "N5", bab: 1 },
  { id: "v1_3", jp: "かいしゃいん", rom: "Kaishain", translation: "Karyawan Perusahaan", type: "Kata Benda", desc: "Menunjukkan pekerjaan formal pegawai kantor.", jlpt: "N5", bab: 1 },
  { id: "v1_4", jp: "けんしゅうせい", rom: "Kenshuusei", translation: "Peserta Magang", type: "Kata Benda", desc: "Sangat krusial untuk pekerja magang luar negeri.", jlpt: "N5", bab: 1 },
  { id: "v1_5", jp: "あのひと", rom: "Ano hito", translation: "Orang itu", type: "Kata Ganti", desc: "Dipakai menunjuk orang di kejauhan.", jlpt: "N5", bab: 1 },
  { id: "v1_6", jp: "せんせい", rom: "Sensei", translation: "Guru / Dosen", type: "Kata Benda", desc: "Instruktur, guru, praktisi profesi.", jlpt: "N5", bab: 1 },
  { id: "v1_7", jp: "きょうじゅ", rom: "Kyouju", translation: "Profesor", type: "Kata Benda", desc: "Gelar untuk pengajar universitas tingkat profesor.", jlpt: "N5", bab: 1 },
  { id: "v1_8", jp: "ぎんこういん", rom: "Ginkouin", translation: "Pegawai Bank", type: "Kata Benda", desc: "Karyawan yang bekerja di bank.", jlpt: "N5", bab: 1 },
  { id: "v1_9", jp: "いしゃ", rom: "Isha", translation: "Dokter", type: "Kata Benda", desc: "Praktisi medis profesional.", jlpt: "N5", bab: 1 },
  { id: "v1_10", jp: "エンジニア", rom: "Enjinia", translation: "Insinyur / Engineer", type: "Kata Benda", desc: "Teknisi atau insinyur terampil.", jlpt: "N5", bab: 1 },

  // --- BAB 2 (JLPT N5): Benda Sekitar ---
  { id: "v2_1", jp: "これ", rom: "Kore", translation: "Ini (dekat pembicara)", type: "Kata Ganti", desc: "Menunjuk benda di genggaman/dekat pembicara.", jlpt: "N5", bab: 2 },
  { id: "v2_2", jp: "それ", rom: "Sore", translation: "Itu (dekat lawan bicara)", type: "Kata Ganti", desc: "Menunjuk benda dekat lawan bicara.", jlpt: "N5", bab: 2 },
  { id: "v2_3", jp: "あれ", rom: "Are", translation: "Itu (jauh dari keduanya)", type: "Kata Ganti", desc: "Menunjuk benda yang jauh dari keduanya.", jlpt: "N5", bab: 2 },
  { id: "v2_4", jp: "ほん", rom: "Hon", translation: "Buku", type: "Kata Benda", desc: "Buku bacaan atau buku pelajaran.", jlpt: "N5", bab: 2 },
  { id: "v2_5", jp: "じしょ", rom: "Jisho", translation: "Kamus", type: "Kata Benda", desc: "Kamus penerjemah kata bahasa asing.", jlpt: "N5", bab: 2 },
  { id: "v2_6", jp: "しんぶん", rom: "Shinbun", translation: "Surat Kabar / Koran", type: "Kata Benda", desc: "Koran atau media berita cetak harian.", jlpt: "N5", bab: 2 },
  { id: "v2_7", jp: "てちょう", rom: "Techou", translation: "Buku Saku / Memo", type: "Kata Benda", desc: "Buku notes kecil untuk mencatat jadwal.", jlpt: "N5", bab: 2 },
  { id: "v2_8", jp: "めいし", rom: "Meishi", translation: "Kartu Nama", type: "Kata Benda", desc: "Sangat penting di etika bisnis Jepang.", jlpt: "N5", bab: 2 },
  { id: "v2_9", jp: "えんぴつ", rom: "Enpitsu", translation: "Pensil", type: "Kata Benda", desc: "Alat tulis karbon pensil.", jlpt: "N5", bab: 2 },
  { id: "v2_10", jp: "とけい", rom: "Tokei", translation: "Jam / Arloji", type: "Kata Benda", desc: "Bisa jam dinding maupun jam tangan.", jlpt: "N5", bab: 2 },

  // --- BAB 3 (JLPT N5): Tempat & Arah ---
  { id: "v3_1", jp: "ここ", rom: "Koko", translation: "Sini / Di sini", type: "Kata Ganti", desc: "Lokasi tempat pembicara berada.", jlpt: "N5", bab: 3 },
  { id: "v3_2", jp: "そこ", rom: "Soko", translation: "Situ / Di situ", type: "Kata Ganti", desc: "Lokasi dekat lawan bicara.", jlpt: "N5", bab: 3 },
  { id: "v3_3", jp: "あそこ", rom: "Asoko", translation: "Sana / Di sana", type: "Kata Ganti", desc: "Tempat yang jauh dari pembicara & lawan.", jlpt: "N5", bab: 3 },
  { id: "v3_4", jp: "きょうしつ", rom: "Kyoushitsu", translation: "Ruang Kelas", type: "Kata Benda", desc: "Tempat kegiatan belajar mengajar berlangsung.", jlpt: "N5", bab: 3 },
  { id: "v3_5", jp: "しょくどう", rom: "Shokudou", translation: "Kantin / Ruang Makan", type: "Kata Benda", desc: "Ruangan kafetaria atau tempat makan bersama.", jlpt: "N5", bab: 3 },
  { id: "v3_6", jp: "じむしょ", rom: "Jimusho", translation: "Kantor / Tata Usaha", type: "Kata Benda", desc: "Ruangan administratif tempat bekerja.", jlpt: "N5", bab: 3 },
  { id: "v3_7", jp: "うけつけ", rom: "Uketsuke", translation: "Resepsionis / Meja Informasi", type: "Kata Benda", desc: "Meja penerima tamu di depan gedung.", jlpt: "N5", bab: 3 },
  { id: "v3_8", jp: "ロビー", rom: "Robii", translation: "Lobi", type: "Kata Benda", desc: "Ruang tunggu masuk hotel atau kantor.", jlpt: "N5", bab: 3 },
  { id: "v3_9", jp: "へや", rom: "Heya", translation: "Kamar / Ruangan", type: "Kata Benda", desc: "Ruang pribadi di rumah atau dorm.", jlpt: "N5", bab: 3 },
  { id: "v3_10", jp: "トイレ / おてあらい", rom: "Toire / Otearai", translation: "Tandilet / Kamar Mandi", type: "Kata Benda", desc: "Otearai adalah istilah yang lebih halus.", jlpt: "N5", bab: 3 },

  // --- BAB 4 (JLPT N5): Waktu & Aktivitas ---
  { id: "v4_1", jp: "おきます", rom: "Okimasu", translation: "Bangun", type: "Kata Kerja I", desc: "Bangun tidur atau bangkit berdiri.", jlpt: "N5", bab: 4 },
  { id: "v4_2", jp: "ねます", rom: "Nemasu", translation: "Tidur", type: "Kata Kerja II", desc: "Beristirahat / tidur malam.", jlpt: "N5", bab: 4 },
  { id: "v4_3", jp: "はたらきます", rom: "Hatarakimasu", translation: "Bekerja", type: "Kata Kerja I", desc: "Menjalani profesi atau tugas kerja.", jlpt: "N5", bab: 4 },
  { id: "v4_4", jp: "やすみます", rom: "Yasumimasu", translation: "Beristirahat / Libur", type: "Kata Kerja I", desc: "Ambil cuti, liburan, atau istirahat sejenak.", jlpt: "N5", bab: 4 },
  { id: "v4_5", jp: "べんきょうします", rom: "Benkyou shimasu", translation: "Belajar", type: "Kata Kerja III", desc: "Mempelajari ilmu atau pelajaran.", jlpt: "N5", bab: 4 },
  { id: "v4_6", jp: "おわります", rom: "Owarimasu", translation: "Selesai", type: "Kata Kerja I", desc: "Mengakhiri suatu hal / operasi selesai.", jlpt: "N5", bab: 4 },
  { id: "v4_7", jp: "いま", rom: "Ima", translation: "Sekarang", type: "Kata Keterangan", desc: "Waktu saat ini juga.", jlpt: "N5", bab: 4 },
  { id: "v4_8", jp: "じ", rom: "ji", translation: "Jam (Satuan Waktu)", type: "Kata Bantu Bilangan", desc: "Penggolong jam, misalnya ichi-ji (jam 1).", jlpt: "N5", bab: 4 },
  { id: "v4_9", jp: "ふん / ぷん", rom: "fun / pun", translation: "Menit", type: "Kata Bantu Bilangan", desc: "Penggolong menit, contoh go-fun (5 menit).", jlpt: "N5", bab: 4 },
  { id: "v4_10", jp: "はん", rom: "han", translation: "Setengah / Lewat 30 Menit", type: "Akhiran", desc: "Dipakai di jam, contoh yo-ji han (jam 4.30).", jlpt: "N5", bab: 4 },

  // --- BAB 5 (JLPT N5): Transportasi & Kepergian ---
  { id: "v5_1", jp: "いきます", rom: "Ikimasu", translation: "Pergi", type: "Kata Kerja I", desc: "Bergerak menuju ke lokasi lain.", jlpt: "N5", bab: 5 },
  { id: "v5_2", jp: "きます", rom: "Kimasu", translation: "Datang", type: "Kata Kerja III", desc: "Menuju ke tempat pembicara berada.", jlpt: "N5", bab: 5 },
  { id: "v5_3", jp: "かえります", rom: "Kaerimasu", translation: "Pulang", type: "Kata Kerja I", desc: "Kembali ke tempat asal (rumah / negara).", jlpt: "N5", bab: 5 },
  { id: "v5_4", jp: "でんしゃ", rom: "Densha", translation: "Kereta Listrik", type: "Kata Benda", desc: "Sarana transportasi andalan di Jepang.", jlpt: "N5", bab: 5 },
  { id: "v5_5", jp: "ちかてつ", rom: "Chikatetsu", translation: "Kereta Bawah Tanah", type: "Kata Benda", desc: "Subway bawah tanah kota metropolitan.", jlpt: "N5", bab: 5 },
  { id: "v5_6", jp: "しんかんせん", rom: "Shinkansen", translation: "Kereta Cepat (Bullet Train)", type: "Kata Benda", desc: "Kereta super cepat lambang teknologi Jepang.", jlpt: "N5", bab: 5 },
  { id: "v5_7", jp: "ともだち", rom: "Tomodachi", translation: "Teman / Rekan", type: "Kata Benda", desc: "Kawan sepertemanan atau kolega akrab.", jlpt: "N5", bab: 5 },
  { id: "v5_8", jp: "ひとり", rom: "Hitori", translation: "Sendiri / Satu Orang", type: "Kata Keterangan", desc: "Melakukan aksi tanpa didampingi orang lain.", jlpt: "N5", bab: 5 },
  { id: "v5_9", jp: "じてんしゃ", rom: "Jitensha", translation: "Sepeda", type: "Kata Benda", desc: "Alat transportasi gowes roda dua.", jlpt: "N5", bab: 5 },
  { id: "v5_10", jp: "ひこうき", rom: "Hikouki", translation: "Pesawat Terbang", type: "Kata Benda", desc: "Transportasi udara jarak jauh.", jlpt: "N5", bab: 5 },

  // --- BAB 6 (JLPT N5): Makanan, Minuman, Transaksi ---
  { id: "v6_1", jp: "たべます", rom: "Tabemasu", translation: "Makan", type: "Kata Kerja II", desc: "Mengkonsumsi makanan padat.", jlpt: "N5", bab: 6 },
  { id: "v6_2", jp: "みます", rom: "Mimasu", translation: "Melihat / Menonton", type: "Kata Kerja II", desc: "Memandang dengan mata / menonton film.", jlpt: "N5", bab: 6 },
  { id: "v6_3", jp: "かきます", rom: "Kakimasu", translation: "Menulis", type: "Kata Kerja I", desc: "Menulis huruf, laporan, atau menggambar.", jlpt: "N5", bab: 6 },
  { id: "v6_4", jp: "かいます", rom: "Kaimasu", translation: "Membeli", type: "Kata Kerja I", desc: "Membeli barang dengan menukar uang.", jlpt: "N5", bab: 6 },
  { id: "v6_5", jp: "おちゃ", rom: "Ocha", translation: "Teh Hijau Jepang", type: "Kata Benda", desc: "Teh tradisional hangat / dingin khas.", jlpt: "N5", bab: 6 },
  { id: "v6_6", jp: "ごはん", rom: "Gohan", translation: "Nasi / Makanan", type: "Kata Benda", desc: "Dapat berarti nasi matang atau makanan bernutrisi.", jlpt: "N5", bab: 6 },
  { id: "v6_7", jp: "パン", rom: "Pan", translation: "Roti", type: "Kata Benda", desc: "Berasal dari serapan bahasa Portugis.", jlpt: "N5", bab: 6 },
  { id: "v6_8", jp: "たまご", rom: "Tamago", translation: "Telur", type: "Kata Benda", desc: "Bahan makanan lauk telur ayam.", jlpt: "N5", bab: 6 },
  { id: "v6_9", jp: "にく", rom: "Niku", translation: "Daging", type: "Kata Benda", desc: "Istilah umum untuk daging hewan penunjang gizi.", jlpt: "N5", bab: 6 },
  { id: "v6_10", jp: "さかな", rom: "Sakana", translation: "Ikan", type: "Kata Benda", desc: "Bahan makanan laut yang melimpah.", jlpt: "N5", bab: 6 },

  // --- BAB 7 (JLPT N5): Alat & Bahasa Kerja ---
  { id: "v7_1", jp: "きります", rom: "Kirimasu", translation: "Memotong / Menggunting", type: "Kata Kerja I", desc: "Gunting kertas, memotong sayur di dapur.", jlpt: "N5", bab: 7 },
  { id: "v7_2", jp: "おくります", rom: "Okurimasu", translation: "Mengirim / Mengantarkan", type: "Kata Kerja I", desc: "Kirim paket ke tanah air atau kirim surel.", jlpt: "N5", bab: 7 },
  { id: "v7_3", jp: "あげます", rom: "Agemasu", translation: "Memberikan (kepada orang lain)", type: "Kata Kerja II", desc: "Memberikan hadiah ato bantuan ke kawan.", jlpt: "N5", bab: 7 },
  { id: "v7_4", jp: "もらいます", rom: "Moraimasu", translation: "Menerima", type: "Kata Kerja I", desc: "Menerima hadiah, saran, ataupun arahan.", jlpt: "N5", bab: 7 },
  { id: "v7_5", jp: "かします", rom: "Kashimasu", translation: "Meminjamkan", type: "Kata Kerja I", desc: "Mengizinkan kawan atau atasan memakai alat kita.", jlpt: "N5", bab: 7 },
  { id: "v7_6", jp: "かります", rom: "Karimasu", translation: "Meminjam", type: "Kata Kerja II", desc: "Meminjam perkakas, obeng, atau alat tulis.", jlpt: "N5", bab: 7 },
  { id: "v7_7", jp: "はし", rom: "Hashi", translation: "Sumpit", type: "Kata Benda", desc: "Alat makan khas Asia Timur.", jlpt: "N5", bab: 7 },
  { id: "v7_8", jp: "スプーン", rom: "Supuun", translation: "Sendok", type: "Kata Benda", desc: "Serapan dari kata kata Spoon.", jlpt: "N5", bab: 7 },
  { id: "v7_9", jp: "フォーク", rom: "Fooku", translation: "Garpu", type: "Kata Benda", desc: "Serapan dari kata Fork.", jlpt: "N5", bab: 7 },
  { id: "v7_10", jp: "ハサミ", rom: "Hasami", translation: "Gunting", type: "Kata Benda", desc: "Perkakas untuk memotong bahan tipis.", jlpt: "N5", bab: 7 },

  // --- BAB 8 (JLPT N5): Kata Sifat & Lingkungan Kerja ---
  { id: "v8_1", jp: "うれしい", rom: "Ureshii", translation: "Senang / Gembira", type: "Kata Sifat -i", desc: "Perasaan bahagia emosional.", jlpt: "N5", bab: 8 },
  { id: "v8_2", jp: "いそがしい", rom: "Isogashii", translation: "Sibuk", type: "Kata Sifat -i", desc: "Banyak pekerjaan di pabrik/kantor.", jlpt: "N5", bab: 8 },
  { id: "v8_3", jp: "たのしい", rom: "Tanoshii", translation: "Sangat Menyenangkan", type: "Kata Sifat -i", desc: "Keadaan yang riang dan gembira.", jlpt: "N5", bab: 8 },
  { id: "v8_4", jp: "しずか", rom: "Shizuka", translation: "Tenang / Sunyi / Sepi", type: "Kata Sifat -na", desc: "Lingkungan kondusif tanpa bising.", jlpt: "N5", bab: 8 },
  { id: "v8_5", jp: "にぎやか", rom: "Nigiyaka", translation: "Ramai / Meriah", type: "Kata Sifat -na", desc: "Suasana ramai penuh orang di kota.", jlpt: "N5", bab: 8 },
  { id: "v8_6", jp: "べんり", rom: "Benri", translation: "Praktis / Mempermudah", type: "Kata Sifat -na", desc: "Sangat praktis mempercepat kerja.", jlpt: "N5", bab: 8 },
  { id: "v8_7", jp: "しろい", rom: "Shiroi", translation: "Putih", type: "Kata Sifat -i", desc: "Warna putih polos suci.", jlpt: "N5", bab: 8 },
  { id: "v8_8", jp: "くろい", rom: "Kuroi", translation: "Hitam", type: "Kata Sifat -i", desc: "Warna hitam legam.", jlpt: "N5", bab: 8 },
  { id: "v8_9", jp: "あかい", rom: "Akai", translation: "Merah", type: "Kata Sifat -i", desc: "Warna merah menyala.", jlpt: "N5", bab: 8 },
  { id: "v8_10", jp: "あおい", rom: "Aoi", translation: "Biru / Hijau Cerah", type: "Kata Sifat -i", desc: "Warna langit atau dedaunan muda.", jlpt: "N5", bab: 8 },

  // --- BAB 9 (JLPT N5): Kegemaran & Preferensi ---
  { id: "v9_1", jp: "すき", rom: "Suki", translation: "Suka / Gemar", type: "Kata Sifat -na", desc: "Menunjukkan hobi atau kesukaan.", jlpt: "N5", bab: 9 },
  { id: "v9_2", jp: "きらい", rom: "Kirai", translation: "Benci / Tidak Suka", type: "Kata Sifat -na", desc: "Antagonis dari kata suki.", jlpt: "N5", bab: 9 },
  { id: "v9_3", jp: "じょうず", rom: "Jouzu", translation: "Mahir / Pandai", type: "Kata Sifat -na", desc: "Digunakan memuji keahlian orang lain.", jlpt: "N5", bab: 9 },
  { id: "v9_4", jp: "へた", rom: "Heta", translation: "Kurang Mahir / Payah", type: "Kata Sifat -na", desc: "Biasa untuk merendah diri sendiri.", jlpt: "N5", bab: 9 },
  { id: "v9_5", jp: "わかります", rom: "Wakarimasu", translation: "Mengerti / Paham", type: "Kata Kerja I", desc: "Memahami arahan kerja atau penjelasan.", jlpt: "N5", bab: 9 },
  { id: "v9_6", jp: "あります", rom: "Arimasu", translation: "Ada / Memiliki (Benda Mati)", type: "Kata Kerja I", desc: "Menunjukkan kepemilikan benda mati / abstrak.", jlpt: "N5", bab: 9 },
  { id: "v9_7", jp: "スポーツ", rom: "Supootsu", translation: "Olahraga", type: "Kata Benda", desc: "Aktivitas fisik menjaga kesehatan.", jlpt: "N5", bab: 9 },
  { id: "v9_8", jp: "ダンス", rom: "Dansu", translation: "Dansa / Tari", type: "Kata Benda", desc: "Tarian ritmis modern.", jlpt: "N5", bab: 9 },
  { id: "v9_9", jp: "おんがく", rom: "Ongaku", translation: "Musik", type: "Kata Benda", desc: "Alunan instrumen meredakan stres.", jlpt: "N5", bab: 9 },
  { id: "v9_10", jp: "うた", rom: "Uta", translation: "Lagu", type: "Kata Benda", desc: "Senandung lagu bernada.", jlpt: "N5", bab: 9 },

  // --- BAB 10 (JLPT N5): Eksistensi & Posisi ---
  { id: "v10_1", jp: "あります", rom: "Arimasu", translation: "Ada / Berada (Benda Mati)", type: "Kata Kerja I", desc: "Menandakan keberadaan benda mati / tanaman.", jlpt: "N5", bab: 10 },
  { id: "v10_2", jp: "います", rom: "Imasu", translation: "Ada / Berada (Makhluk Hidup)", type: "Kata Kerja II", desc: "Menandakan keberadaan manusia atau hewan.", jlpt: "N5", bab: 10 },
  { id: "v10_3", jp: "うえ", rom: "Ue", translation: "Atas / Bagian Atas", type: "Kata Benda / Arah", desc: "Posisi di atas permukaan benda.", jlpt: "N5", bab: 10 },
  { id: "v10_4", jp: "した", rom: "Shita", translation: "Bawah / Bagian Bawah", type: "Kata Benda / Arah", desc: "Posisi di bawah kolong / lantai dasar.", jlpt: "N5", bab: 10 },
  { id: "v10_5", jp: "まえ", rom: "Mae", translation: "Depan / Bagian Depan", type: "Kata Benda / Arah", desc: "Posisi di depan pandangan mata.", jlpt: "N5", bab: 10 },
  { id: "v10_6", jp: "うしろ", rom: "Ushiro", translation: "Belakang / Bagian Belakang", type: "Kata Benda / Arah", desc: "Posisi di bagian buntut / punggung.", jlpt: "N5", bab: 10 },
  { id: "v10_7", jp: "なか", rom: "Naka", translation: "Dalam / Bagian Dalam", type: "Kata Benda / Arah", desc: "Di dalam kotak, gedung, atau saku.", jlpt: "N5", bab: 10 },
  { id: "v10_8", jp: "そと", rom: "Soto", translation: "Luar / Bagian Luar", type: "Kata Benda / Arah", desc: "Di luar area, halaman luar.", jlpt: "N5", bab: 10 },
  { id: "v10_9", jp: "みぎ", rom: "Migi", translation: "Kanan", type: "Kata Benda / Arah", desc: "Sisi sebelah kanan.", jlpt: "N5", bab: 10 },
  { id: "v10_10", jp: "ひだり", rom: "Hidari", translation: "Kiri", type: "Kata Benda / Arah", desc: "Sisi sebelah kiri.", jlpt: "N5", bab: 10 },

  // --- BAB 11 (JLPT N5): Hitungan Jumlah & Durasi ---
  { id: "v11_1", jp: "ひとつ", rom: "Hitotsu", translation: "Satu Buah Benda", type: "Kata Bantu Bilangan", desc: "Penghitung objek kecil/umum.", jlpt: "N5", bab: 11 },
  { id: "v11_2", jp: "ふたつ", rom: "Futatsu", translation: "Dua Buah Benda", type: "Kata Bantu Bilangan", desc: "Penghitung dua unit objek.", jlpt: "N5", bab: 11 },
  { id: "v11_3", jp: "みっつ", rom: "Mittsu", translation: "Tiga Buah Benda", type: "Kata Bantu Bilangan", desc: "Penghitung tiga unit objek.", jlpt: "N5", bab: 11 },
  { id: "v11_4", jp: "だんせい", rom: "Dansei", translation: "Laki-laki / Pria", type: "Kata Benda", desc: "Gender laki-laki penunjuk personal.", jlpt: "N5", bab: 11 },
  { id: "v11_5", jp: "じょせい", rom: "Josei", translation: "Perempuan / Wanita", type: "Kata Benda", desc: "Gender wanita penunjuk personal.", jlpt: "N5", bab: 11 },
  { id: "v11_6", jp: "きょうだい", rom: "Kyoudai", translation: "Saudara Kandung", type: "Kata Benda", desc: "Kakak beradik sedarah.", jlpt: "N5", bab: 11 },
  { id: "v11_7", jp: "りょうしん", rom: "Ryoushin", translation: "Orang Tua / Ibu Bapak", type: "Kata Benda", desc: "Orang tua kandung pendidik anak.", jlpt: "N5", bab: 11 },
  { id: "v11_8", jp: "～じかん", rom: "~jikan", translation: "[Durasi] jam", type: "Akhiran", desc: "Contoh: ichi-jikan (selama 1 jam).", jlpt: "N5", bab: 11 },
  { id: "v11_9", jp: "～しゅうかん", rom: "~shuukan", translation: "[Durasi] minggu / pekan", type: "Akhiran", desc: "Contoh: san-shuukan (selama 3 minggu).", jlpt: "N5", bab: 11 },
  { id: "v11_10", jp: "～かげつ", rom: "~kagetsu", translation: "[Durasi] bulan", type: "Akhiran", desc: "Contoh: ni-kagetsu (selama 2 bulan).", jlpt: "N5", bab: 11 },

  // --- BAB 12 (JLPT N5): Kejadian Masa Lalu ---
  { id: "v12_1", jp: "きのう", rom: "Kinou", translation: "Kemarin", type: "Kata Keterangan", desc: "Satu hari sebelum hari ini.", jlpt: "N5", bab: 12 },
  { id: "v12_2", jp: "おととい", rom: "Ototoi", translation: "Dua Hari Lalu", type: "Kata Keterangan", desc: "Dua hari sebelum hari ini.", jlpt: "N5", bab: 12 },
  { id: "v12_3", jp: "あした", rom: "Ashita", translation: "Besok", type: "Kata Keterangan", desc: "Satu hari setelah hari ini.", jlpt: "N5", bab: 12 },
  { id: "v12_4", jp: "あさって", rom: "Asatte", translation: "Lusa", type: "Kata Keterangan", desc: "Dua hari setelah hari ini.", jlpt: "N5", bab: 12 },
  { id: "v12_5", jp: "てんき", rom: "Tenki", translation: "Cuaca", type: "Kata Benda", desc: "Keadaan iklim harian.", jlpt: "N5", bab: 12 },
  { id: "v12_6", jp: "あめ", rom: "Ame", translation: "Hujan", type: "Kata Benda", desc: "Presipitasi air langit.", jlpt: "N5", bab: 12 },
  { id: "v12_7", jp: "ゆき", rom: "Yuki", translation: "Salju", type: "Kata Benda", desc: "Kristal es dingin di musim dingin.", jlpt: "N5", bab: 12 },
  { id: "v12_8", jp: "くもり", rom: "Kumori", translation: "Mendung / Berawan", type: "Kata Benda", desc: "Langit dipenuhi awan kelabu.", jlpt: "N5", bab: 12 },
  { id: "v12_9", jp: "はれ", rom: "Hare", translation: "Cerah", type: "Kata Benda", desc: "Langit biru bersih tanpa hambatan.", jlpt: "N5", bab: 12 },
  { id: "v12_10", jp: "あつい", rom: "Atsui", translation: "Panas (Cuaca / Benda)", type: "Kata Sifat -i", desc: "Suhu udara tinggi atau teh panas.", jlpt: "N5", bab: 12 },

  // --- BAB 13 (JLPT N4): Keinginan & Penawaran ---
  { id: "v13_1", jp: "ほしい", rom: "Hoshii", translation: "Ingin / Mau (Benda)", type: "Kata Sifat -i", desc: "Menginginkan kepemilikan suatu benda.", jlpt: "N4", bab: 13 },
  { id: "v13_2", jp: "おくりたいです", rom: "Okuritai desu", translation: "Ingin mengirim", type: "Kata Kerja (Keinginan)", desc: "Aspirasi mengirim barang ke kerabat.", jlpt: "N4", bab: 13 },
  { id: "v13_3", jp: "あそびます", rom: "Asobimasu", translation: "Bermain / Berwisata", type: "Kata Kerja I", desc: "Meluangkan waktu santai atau bermain game.", jlpt: "N4", bab: 13 },
  { id: "v13_4", jp: "およぎます", rom: "Oyogimasu", translation: "Berenang", type: "Kata Kerja I", desc: "Aktivitas berenang di kolam / laut.", jlpt: "N4", bab: 13 },
  { id: "v13_5", jp: "むかえます", rom: "Mukaemasu", translation: "Menyambut / Menjemput", type: "Kata Kerja II", desc: "Menjemput tamu di stasiun / bandara.", jlpt: "N4", bab: 13 },
  { id: "v13_6", jp: "つかれます", rom: "Tsukaremasu", translation: "Kelelahan / Letih", type: "Kata Kerja II", desc: "Kondisi kehabisan energi jasmani.", jlpt: "N4", bab: 13 },
  { id: "v13_7", jp: "かいものします", rom: "Kaimono shimasu", translation: "Berbelanja", type: "Kata Kerja III", desc: "Melakukan belanja kebutuhan sehari-hari.", jlpt: "N4", bab: 13 },
  { id: "v13_8", jp: "しょくじします", rom: "Shokuji shimasu", translation: "Makan Bersama", type: "Kata Kerja III", desc: "Menikmati hidangan makan secara formal.", jlpt: "N4", bab: 13 },
  { id: "v13_9", jp: "こうえん", rom: "Kouen", translation: "Taman", type: "Kata Benda", desc: "Taman umum untuk melepas penat.", jlpt: "N4", bab: 13 },
  { id: "v13_10", jp: "かわ", rom: "Kawa", translation: "Sungai", type: "Kata Benda", desc: "Aliran air alami berarus.", jlpt: "N4", bab: 13 },

  // --- BAB 14 (JLPT N4): Perintah & Bantuan ---
  { id: "v14_1", jp: "つけてください", rom: "Tsukete kudasai", translation: "Mohon nyalakan", type: "Kata Kerja (Bentuk Te)", desc: "Menyalakan mesin, lampu, atau AC.", jlpt: "N4", bab: 14 },
  { id: "v14_2", jp: "けしてください", rom: "Keshite kudasai", translation: "Mohon matikan", type: "Kata Kerja (Bentuk Te)", desc: "Mematikan sekering, mesin, ataupun lampu.", jlpt: "N4", bab: 14 },
  { id: "v14_3", jp: "あけてください", rom: "Akete kudasai", translation: "Mohon buka", type: "Kata Kerja (Bentuk Te)", desc: "Membuka pintu, katrol, kontainer, dsb.", jlpt: "N4", bab: 14 },
  { id: "v14_4", jp: "しめてください", rom: "Shimete kudasai", translation: "Mohon tutup", type: "Kata Kerja (Bentuk Te)", desc: "Menutup pintu gerbang, loker, atau folder.", jlpt: "N4", bab: 14 },
  { id: "v14_5", jp: "いそいでください", rom: "Isoide kudasai", translation: "Mohon bergegas", type: "Kata Kerja (Bentuk Te)", desc: "Meminta bekerja lebih cepat karena mendesak.", jlpt: "N4", bab: 14 },
  { id: "v14_6", jp: "まってください", rom: "Matte kudasai", translation: "Mohon tunggu", type: "Kata Kerja (Bentuk Te)", desc: "Tahan sebentar / menunggu instruksi.", jlpt: "N4", bab: 14 },
  { id: "v14_7", jp: "もってください", rom: "Motte kudasai", translation: "Mohon pegang / bawa", type: "Kata Kerja (Bentuk Te)", desc: "Memegang perkakas berat, membawa ransel.", jlpt: "N4", bab: 14 },
  { id: "v14_8", jp: "てつだってください", rom: "Tetsudatte kudasai", translation: "Mohon bantu saya", type: "Kata Kerja (Bentuk Te)", desc: "Meminta tolong diringankan beban tugas.", jlpt: "N4", bab: 14 },
  { id: "v14_9", jp: "よんでください", rom: "Yonde kudasai", translation: "Mohon panggil", type: "Kata Kerja (Bentuk Te)", desc: "Memanggil taksi, atasan, atau ambulance.", jlpt: "N4", bab: 14 },
  { id: "v14_10", jp: "はなしてください", rom: "Hanashite kudasai", translation: "Mohon bicara", type: "Kata Kerja (Bentuk Te)", desc: "Berbicara mengutarakan kejadian.", jlpt: "N4", bab: 14 },

  // --- BAB 15 (JLPT N4): Larangan & Kepemilikan ---
  { id: "v15_1", jp: "おいてもいいです", rom: "Oite mo ii desu", translation: "Boleh meletakkan", type: "Kata Kerja (Izin)", desc: "Menaruh barang atau kardus di lantai.", jlpt: "N4", bab: 15 },
  { id: "v15_2", jp: "つかってはいけません", rom: "Tsukatte wa ikemasen", translation: "Tidak boleh memakai", type: "Kata Kerja (Larangan)", desc: "Pemberitahuan dilarang keras memakai gadget.", jlpt: "N4", bab: 15 },
  { id: "v15_3", jp: "しっています", rom: "Shitte imasu", translation: "Tahu / Mengenal", type: "Kata Kerja (Kondisi)", desc: "Mengetahui info atau kenal personal.", jlpt: "N4", bab: 15 },
  { id: "v15_4", jp: "すんでいます", rom: "Sunde imasu", translation: "Tinggal / Bermukim", type: "Kata Kerja (Kondisi)", desc: "Menetap tinggal di asrama / kota.", jlpt: "N4", bab: 15 },
  { id: "v15_5", jp: "けんきゅうしています", rom: "Kenkyuu shite imasu", translation: "Sedang meneliti", type: "Kata Kerja (Kondisi)", desc: "Melaksanakan eksplorasi ilmiah.", jlpt: "N4", bab: 15 },
  { id: "v15_6", jp: "カタログ", rom: "Katarogu", translation: "Katalog", type: "Kata Benda", desc: "Buku rincian spesifikasi produk.", jlpt: "N4", bab: 15 },
  { id: "v15_7", jp: "じこくひょう", rom: "Jikokuhyou", translation: "Tabel Jadwal Waktu", type: "Kata Benda", desc: "Jadwal keberangkatan bus / kereta.", jlpt: "N4", bab: 15 },
  { id: "v15_8", jp: "ふく", rom: "Fuku", translation: "Pakaian / Baju", type: "Kata Benda", desc: "Sandang penutup tubuh.", jlpt: "N4", bab: 15 },
  { id: "v15_9", jp: "はいしゃ", rom: "Haisha", translation: "Dokter Gigi", type: "Kata Benda", desc: "Spesialis kesehatan gigi & gusi.", jlpt: "N4", bab: 15 },
  { id: "v15_10", jp: "とくや", rom: "Tokuya", translation: "Pangkas Rambut", type: "Kata Benda", desc: "Salon cukur rambut pria.", jlpt: "N4", bab: 15 },

  // --- BAB 16 (JLPT N4): Sekuensial & Urutan ---
  { id: "v16_1", jp: "のります", rom: "Norimasu", translation: "Naik (Kendaraan)", type: "Kata Kerja I", desc: "Naik bus, kereta, atau pesawat.", jlpt: "N4", bab: 16 },
  { id: "v16_2", jp: "おります", rom: "Orimasu", translation: "Turun (Kendaraan)", type: "Kata Kerja II", desc: "Turun di stasiun atau halte.", jlpt: "N4", bab: 16 },
  { id: "v16_3", jp: "のりかえます", rom: "Norikaemasu", translation: "Transfer / Ganti Jalur", type: "Kata Kerja II", desc: "Ganti kereta di stasiun transit.", jlpt: "N4", bab: 16 },
  { id: "v16_4", jp: "あびます", rom: "Abimasu", translation: "Mandi / Guyur", type: "Kata Kerja II", desc: "Mandi air pancuran (shawaa).", jlpt: "N4", bab: 16 },
  { id: "v16_5", jp: "いれます", rom: "Iremasu", translation: "Memasukkan", type: "Kata Kerja II", desc: "Menyisipkan koin atau berkas ke laci.", jlpt: "N4", bab: 16 },
  { id: "v16_6", jp: "だします", rom: "Dashimasu", translation: "Mengeluarkan / Menyerahkan", type: "Kata Kerja I", desc: "Menarik uang di ATM atau kumpul laporan.", jlpt: "N4", bab: 16 },
  { id: "v16_7", jp: "おろします", rom: "Oroshimasu", translation: "Menurunkan / Ambil Uang", type: "Kata Kerja I", desc: "Mengambil uang kontan dari rekening.", jlpt: "N4", bab: 16 },
  { id: "v16_8", jp: "おします", rom: "Oshimasu", translation: "Menekan / Mendorong", type: "Kata Kerja I", desc: "Menekan tombol lift atau saklar.", jlpt: "N4", bab: 16 },
  { id: "v16_9", jp: "わかい", rom: "Wakai", translation: "Muda", type: "Kata Sifat -i", desc: "Berusia belia, energik.", jlpt: "N4", bab: 16 },
  { id: "v16_10", jp: "ながい", rom: "Nagai", translation: "Panjang", type: "Kata Sifat -i", desc: "Dimensi ukuran memanjang / waktu lama.", jlpt: "N4", bab: 16 },

  // --- BAB 17 (JLPT N4): Larangan & Aturan Keselamatan ---
  { id: "v17_1", jp: "さわらないでください", rom: "Sawaranaide kudasai", translation: "Dilarang menyentuh", type: "Kata Kerja (Bentuk Nai)", desc: "Sangat krusial di pabrik agar terhindar kecelakaan.", jlpt: "N4", bab: 17 },
  { id: "v17_2", jp: "わすれないでください", rom: "Wasurenaide kudasai", translation: "Jangan lupakan", type: "Kata Kerja (Bentuk Nai)", desc: "Misalnya memakai helm atau mematikan tungku.", jlpt: "N4", bab: 17 },
  { id: "v17_3", jp: "しんぱいしないでください", rom: "Shinpai shinaide kudasai", translation: "Jangan khawatir", type: "Kata Kerja (Bentuk Nai)", desc: "Dikatakan untuk meredakan ketegangan rekan.", jlpt: "N4", bab: 17 },
  { id: "v17_4", jp: "おかないでください", rom: "Okanaide kudasai", translation: "Jangan letakkan di sini", type: "Kata Kerja (Bentuk Nai)", desc: "Kardus jangan menutupi jalur evakuasi.", jlpt: "N4", bab: 17 },
  { id: "v17_5", jp: "くすり", rom: "Kusuri", translation: "Obat / Herbal", type: "Kata Benda", desc: "Tablet medis dari apoteker.", jlpt: "N4", bab: 17 },
  { id: "v17_6", jp: "ほけんしょう", rom: "Hokenshou", translation: "Kartu Asuransi Kesehatan", type: "Kata Benda", desc: "Wajib dibawa saat periksa ke klinik.", jlpt: "N4", bab: 17 },
  { id: "v17_7", jp: "ねつ", rom: "Netsu", translation: "Demam / Panas Tubuh", type: "Kata Benda", desc: "Suhu tubuh melonjak akibat sakit.", jlpt: "N4", bab: 17 },
  { id: "v17_8", jp: "かぜ", rom: "Kaze", translation: "Masuk Angin / Flu", type: "Kata Benda", desc: "Penyakit influenza umum.", jlpt: "N4", bab: 17 },
  { id: "v17_9", jp: "ざんぎょう", rom: "Zangyou", translation: "Lembur / Overtime", type: "Kata Benda", desc: "Jam kerja tambahan di luar jam reguler.", jlpt: "N4", bab: 17 },
  { id: "v17_10", jp: "しゅっちょう", rom: "Shutchou", translation: "Dinas Luar Kota/Negeri", type: "Kata Benda", desc: "Perjalanan bisnis menjalankan kerja.", jlpt: "N4", bab: 17 },

  // --- BAB 18 (JLPT N4): Potensi & Kemampuan ---
  { id: "v18_1", jp: "できます", rom: "Dekimasu", translation: "Sanggup / Mampu", type: "Kata Kerja II", desc: "Memiliki keahlian mengelas, bahasa, dsb.", jlpt: "N4", bab: 18 },
  { id: "v18_2", jp: "うんてんできます", rom: "Unten dekimasu", translation: "Sanggup menyetir / mengemudi", type: "Kata Kerja (Mampu)", desc: "Memiliki lisensi dan bisa mengendarai mobil.", jlpt: "N4", bab: 18 },
  { id: "v18_3", jp: "よやくします", rom: "Yoyaku shimasu", translation: "Memesan / Booking", type: "Kata Kerja III", desc: "Pesan tiket pesawat, meja restoran, dsb.", jlpt: "N4", bab: 18 },
  { id: "v18_4", jp: "けんがくします", rom: "Kengaku shimasu", translation: "Kunjungan Studi / Peninjauan", type: "Kata Kerja III", desc: "Melihat langsung metode kerja di pabrik mitra.", jlpt: "N4", bab: 18 },
  { id: "v18_5", jp: "ピアノ", rom: "Piano", translation: "Piano", type: "Kata Benda", desc: "Alat musik piano klasik.", jlpt: "N4", bab: 18 },
  { id: "v18_6", jp: "おゆ", rom: "Oyu", translation: "Air Panas", type: "Kata Benda", desc: "Air mendidih fungsional.", jlpt: "N4", bab: 18 },
  { id: "v18_7", jp: "こくさい", rom: "Kokusai", translation: "Internasional", type: "Kata Benda", desc: "Melibatkan banyak negara dunia.", jlpt: "N4", bab: 18 },
  { id: "v18_8", jp: "げんきん", rom: "Genkin", translation: "Uang Tunai / Cash", type: "Kata Benda", desc: "Lembaran uang kontan.", jlpt: "N4", bab: 18 },
  { id: "v18_9", jp: "おいのり", rom: "Oinori", translation: "Doa / Ibadah", type: "Kata Benda", desc: "Ibadah spiritual memohon perlindungan.", jlpt: "N4", bab: 18 },
  { id: "v18_10", jp: "しゅみ", rom: "Shumi", translation: "Hobi", type: "Kata Benda", desc: "Aktivitas favorit waktu luang.", jlpt: "N4", bab: 18 },

  // --- BAB 19 (JLPT N4): Pengalaman Kerja ---
  { id: "v19_1", jp: "のぼったことがあります", rom: "Nobotta koto ga arimasu", translation: "Pernah mendaki", type: "Kata Kerja (Bentuk Ta)", desc: "Menyatakan riwayat mendaki gunung Fuji.", jlpt: "N4", bab: 19 },
  { id: "v19_2", jp: "とまったことがあります", rom: "Tomatta koto ga arimasu", translation: "Pernah menginap", type: "Kata Kerja (Bentuk Ta)", desc: "Pernah tidur menginap di hotel tradisional.", jlpt: "N4", bab: 19 },
  { id: "v19_3", jp: "そうじします", rom: "Souji shimasu", translation: "Membersihkan ruangan", type: "Kata Kerja III", desc: "Menyapu, mengepel, mencuci piring harian.", jlpt: "N4", bab: 19 },
  { id: "v19_4", jp: "せんたくします", rom: "Sentaku shimasu", translation: "Mencuci pakaian", type: "Kata Kerja III", desc: "Menggunakan mesin cuci mengeringkan fuku.", jlpt: "N4", bab: 19 },
  { id: "v19_5", jp: "ねむい", rom: "Nemui", translation: "Mengantuk / Lelah", type: "Kata Sifat -i", desc: "Kurang istirahat malam.", jlpt: "N4", bab: 19 },
  { id: "v19_6", jp: "からだ", rom: "Karada", translation: "Tubuh / Fisik", type: "Kata Benda", desc: "Badan penunjang aktivitas.", jlpt: "N4", bab: 19 },
  { id: "v19_7", jp: "ちょうし", rom: "Choushi", translation: "Kondisi Tubuh / Mesin", type: "Kata Benda", desc: "Keadaan kinerja mekanis atau stamina.", jlpt: "N4", bab: 19 },
  { id: "v19_8", jp: "ゴルフ", rom: "Gorufu", translation: "Olahraga Golf", type: "Kata Benda", desc: "Sering dilakukan eksekutif perusahaan.", jlpt: "N4", bab: 19 },
  { id: "v19_9", jp: "すもう", rom: "Sumou", translation: "Gulat Sumo", type: "Kata Benda", desc: "Olahraga gulat tradisional raksasa.", jlpt: "N4", bab: 19 },
  { id: "v19_10", jp: "お茶をたてます", rom: "Ocha wo tatemasu", translation: "Menyajikan teh upacara", type: "Kata Kerja II", desc: "Seni penyajian teh matcha (sado).", jlpt: "N4", bab: 19 },

  // --- BAB 20 (JLPT N4): Ragam Biasa / Kasual ---
  { id: "v20_1", jp: "いう (いいます)", rom: "Iu (iimasu)", translation: "Berkata", type: "Kata Kerja I [Biasa]", desc: "Ragam kasual mengutarakan kata.", jlpt: "N4", bab: 20 },
  { id: "v20_2", jp: "おもう (おもいます)", rom: "Omou (omoimasu)", translation: "Berpikir / Menurut opini", type: "Kata Kerja I [Biasa]", desc: "Melambangkan pemikiran pribadi.", jlpt: "N4", bab: 20 },
  { id: "v20_3", jp: "おもう (する)", rom: "Suru (shimasu)", translation: "Melakukan", type: "Kata Kerja III [Biasa]", desc: "Aksi melakukan sesuatu ragam biasa.", jlpt: "N4", bab: 20 },
  { id: "v20_4", jp: "いる (います)", rom: "Iru (imasu)", translation: "Ada (Makhluk Hidup)", type: "Kata Kerja II [Biasa]", desc: "Keberadaan makhluk hidup kasual.", jlpt: "N4", bab: 20 },
  { id: "v20_5", jp: "ある (あります)", rom: "Aru (arimasu)", translation: "Ada (Benda Mati)", type: "Kata Kerja I [Biasa]", desc: "Keberadaan benda mati kasual.", jlpt: "N4", bab: 20 },
  { id: "v20_6", jp: "いく (いきます)", rom: "Iku (ikimasu)", translation: "Pergi", type: "Kata Kerja I [Biasa]", desc: "Ragam kasual pergi ke lokasi.", jlpt: "N4", bab: 20 },
  { id: "v20_7", jp: "くる (きます)", rom: "Kuru (kimasu)", translation: "Datang", type: "Kata Kerja III [Biasa]", desc: "Ragam kasual mendatangi lokasi.", jlpt: "N4", bab: 20 },
  { id: "v20_8", jp: "たべる (たべます)", rom: "Taberu (tabemasu)", translation: "Makan", type: "Kata Kerja II [Biasa]", desc: "Ragam kasual makan hidangan.", jlpt: "N4", bab: 20 },
  { id: "v20_9", jp: "のむ (のみます)", rom: "Nomu (nomimasu)", translation: "Minum", type: "Kata Kerja I [Biasa]", desc: "Ragam kasual meneguk cairan.", jlpt: "N4", bab: 20 },
  { id: "v20_10", jp: "かう (かいます)", rom: "Kau (kaimasu)", translation: "Membeli", type: "Kata Kerja I [Biasa]", desc: "Ragam biasa membeli barang.", jlpt: "N4", bab: 20 },

  // --- BAB 21 (JLPT N4): Berpendapat & Menyampaikan Pesan ---
  { id: "v21_1", jp: "そうじき", rom: "Soujiki", translation: "Jujur / Sebenarnya", type: "Kata Keterangan", desc: "Mengungkapkan pendapat sejujurnya.", jlpt: "N4", bab: 21 },
  { id: "v21_2", jp: "いけん", rom: "Iken", translation: "Opini / Pendapat", type: "Kata Benda", desc: "Pandangan pribadi dalam perundingan.", jlpt: "N4", bab: 21 },
  { id: "v21_3", jp: "かいぎ", rom: "Kaigi", translation: "Rapat / Pertemuan Kerja", type: "Kata Benda", desc: "Sangat krusial untuk meeting di kantor.", jlpt: "N4", bab: 21 },
  { id: "v21_4", jp: "はなし", rom: "Hanashi", translation: "Cerita / Percakapan", type: "Kata Benda", desc: "Isi pidato atau komunikasi verbal.", jlpt: "N4", bab: 21 },
  { id: "v21_5", jp: "うんてんしゅ", rom: "Untenshu", translation: "Sopir / Pengemudi", type: "Kata Benda", desc: "Driver kendaraan perusahaan.", jlpt: "N4", bab: 21 },
  { id: "v21_6", jp: "ポリゴン", rom: "Porigon", translation: "Poligon / Geometri", type: "Kata Benda", desc: "Rincian teknis sudut pabrik.", jlpt: "N4", bab: 21 },
  { id: "v21_7", jp: "ユーモア", rom: "Yuumoa", translation: "Humor / Jenaka", type: "Kata Benda", desc: "Gurauan meredakan kaku.", jlpt: "N4", bab: 21 },
  { id: "v21_8", jp: "むだ", rom: "Muda", translation: "Sia-sia / Mubazir", type: "Kata Sifat -na", desc: "Konsep pemborosan material / waktu (Muda-zukai).", jlpt: "N4", bab: 21 },
  { id: "v21_9", jp: "べんり", rom: "Benri", translation: "Memudahkan", type: "Kata Sifat -na", desc: "Membantu mempercepat kelancaran tugas.", jlpt: "N4", bab: 21 },
  { id: "v21_10", jp: "やくにたちます", rom: "Yaku ni tachimasu", translation: "Bermanfaat / Berguna", type: "Kata Kerja I", desc: "Sangat menunjang efisiensi operasional.", jlpt: "N4", bab: 21 },

  // --- BAB 22 (JLPT N4): Klausa Pewatas / Modifikasi Kata Benda ---
  { id: "v22_1", jp: "きているふく", rom: "Kite iru fuku", translation: "Baju yang sedang dipakai", type: "Klausa Pewatas", desc: "Menggambarkan sifat subjek menggunakan kata kerja.", jlpt: "N4", bab: 22 },
  { id: "v22_2", jp: "すむうち", rom: "Sumu uchi", translation: "Rumah tempat tinggal", type: "Klausa Pewatas", desc: "Modifikasi kata benda uchi dengan kata kerja sumu.", jlpt: "N4", bab: 22 },
  { id: "v22_3", jp: "つくるごはん", rom: "Tsukuru gohan", translation: "Makanan yang dibuat", type: "Klausa Pewatas", desc: "Makanan buatan kawan atau juru masak.", jlpt: "N4", bab: 22 },
  { id: "v22_4", jp: "おくるてがみ", rom: "Okuru tegami", translation: "Surat yang dikirim", type: "Klausa Pewatas", desc: "Surat yang ditujukan ke kerabat.", jlpt: "N4", bab: 22 },
  { id: "v22_5", jp: "かうきょうしつ", rom: "Kau kyoushitsu", translation: "Kelas yang dibeli", type: "Klausa Pewatas", desc: "Klausa pewatas menerangkan properti.", jlpt: "N4", bab: 22 },
  { id: "v22_6", jp: "うごくロボット", rom: "Ugoku robotto", translation: "Robot yang bergerak", type: "Klausa Pewatas", desc: "Mesin otomasi di bagian perakitan pabrik.", jlpt: "N4", bab: 22 },
  { id: "v22_7", jp: "あらうきかい", rom: "Arau kikai", translation: "Mesin yang mencuci", type: "Klausa Pewatas", desc: "Alat pembersih komponen logam.", jlpt: "N4", bab: 22 },
  { id: "v22_8", jp: "はたらくひと", rom: "Hataraku hito", translation: "Orang yang bekerja", type: "Klausa Pewatas", desc: "Segenap karyawan / kenshuusei di pabrik.", jlpt: "N4", bab: 22 },
  { id: "v22_9", jp: "やすむ日 (やすむひ)", rom: "Yasumu hi", translation: "Hari libur / istirahat", type: "Klausa Pewatas", desc: "Hari saat pabrik stop operasi.", jlpt: "N4", bab: 22 },
  { id: "v22_10", jp: "つかうどうぐ", rom: "Tsukau dougu", translation: "Perkakas yang digunakan", type: "Klausa Pewatas", desc: "Tang, kunci pas, solder yang digunakan pekerja.", jlpt: "N4", bab: 22 },

  // --- BAB 23 (JLPT N4): Kondisi Sebab Akibat (Pola Toki / To) ---
  { id: "v23_1", jp: "～とき", rom: "~toki", translation: "Ketika / Saat...", type: "Partikel / Konjungsi", desc: "Menandai temporalitas situasi, contoh: 'Waktu kecil...'.", jlpt: "N4", bab: 23 },
  { id: "v23_2", jp: "～と", rom: "~to", translation: "Jika / Begitu... maka pasti...", type: "Partikel / Konjungsi", desc: "Sebab akibat alami, misal: 'Tekan tombol ini maka air keluar.'.", jlpt: "N4", bab: 23 },
  { id: "v23_3", jp: "わたります", rom: "Watarimasu", translation: "Menyeberang", type: "Kata Kerja I", desc: "Menyeberangi rute jembatan atau zebra cross.", jlpt: "N4", bab: 23 },
  { id: "v23_4", jp: "まがります", rom: "Magarimasu", translation: "Belok / Berbelok", type: "Kata Kerja I", desc: "Belok kanan (migi ni magarimasu) di simpang.", jlpt: "N4", bab: 23 },
  { id: "v23_5", jp: "さわります", rom: "Sawarimasu", translation: "Menyentuh", type: "Kata Kerja I", desc: "Menyentuh tombol navigasi panel kontrol.", jlpt: "N4", bab: 23 },
  { id: "v23_6", jp: "でます", rom: "Demasu", translation: "Keluar (Uang / Hasil)", type: "Kata Kerja II", desc: "Keluar kembalian dari vending machine.", jlpt: "N4", bab: 23 },
  { id: "v23_7", jp: "うごきます", rom: "Ugokimasu", translation: "Bergerak / Jalan (Mesin)", type: "Kata Kerja I", desc: "Motor dinamo berputar lancar.", jlpt: "N4", bab: 23 },
  { id: "v23_8", jp: "ひきます", rom: "Hikimasu", translation: "Menarik", type: "Kata Kerja I", desc: "Menarik tuas darurat atau pintu geser.", jlpt: "N4", bab: 23 },
  { id: "v23_9", jp: "かえます", rom: "Kaemasu", translation: "Mengubah / Mengganti", type: "Kata Kerja II", desc: "Menyesuaikan setelan temperatur ruangan.", jlpt: "N4", bab: 23 },
  { id: "v23_10", jp: "きをつけて", rom: "Ki wo tsukete", translation: "Berhati-hatilah", type: "Ungkapan", desc: "Atasan memperingati kenshuusei di area berbahaya.", jlpt: "N4", bab: 23 },

  // --- BAB 24 (JLPT N4): Hubungan Sosial (Ageru, Morau, Kureru) ---
  { id: "v24_1", jp: "くれます", rom: "Kuremasu", translation: "Memberikan (kepada pembicara)", type: "Kata Kerja II", desc: "Orang lain sukarela memberi bantuan kepada saya.", jlpt: "N4", bab: 24 },
  { id: "v24_2", jp: "つれていきます", rom: "Tsurete ikimasu", translation: "Membawa pergi (orang)", type: "Kata Kerja I", desc: "Mengantar sepupu ke stasiun terdekat.", jlpt: "N4", bab: 24 },
  { id: "v24_3", jp: "つれてきます", rom: "Tsurete kimasu", translation: "Membawa datang (orang)", type: "Kata Kerja III", desc: "Mengajak kawan baru mampir ke asrama.", jlpt: "N4", bab: 24 },
  { id: "v24_4", jp: "おくります", rom: "Okurimasu (hito wo)", translation: "Mengantarkan (orang)", type: "Kata Kerja I", desc: "Mengantar tamu sampai ke gerbang luar.", jlpt: "N4", bab: 24 },
  { id: "v24_5", jp: "しょうかいします", rom: "Shoukai shimasu", translation: "Memperkenalkan", type: "Kata Kerja III", desc: "Memperkenalkan anggota tim magang baru.", jlpt: "N4", bab: 24 },
  { id: "v24_6", jp: "あんないします", rom: "Annai shimasu", translation: "Memandu / Mengantar Keliling", type: "Kata Kerja III", desc: "Memandu investor meninjau proses perakitan.", jlpt: "N4", bab: 24 },
  { id: "v24_7", jp: "せつめいします", rom: "Setsumei shimasu", translation: "Menjelaskan", type: "Kata Kerja III", desc: "Menjelaskan SOP pemakaian bor listrik.", jlpt: "N4", bab: 24 },
  { id: "v24_8", jp: "おじいさん", rom: "Ojiisan", translation: "Kakek (orang lain)", type: "Kata Benda", desc: "Menyebut kakek keluarga lain.", jlpt: "N4", bab: 24 },
  { id: "v24_9", jp: "おばあさん", rom: "Obaasan", translation: "Nenek (orang lain)", type: "Kata Benda", desc: "Menyebut nenek keluarga lain.", jlpt: "N4", bab: 24 },
  { id: "v24_10", jp: "じゅんびします", rom: "Junbi shimasu", translation: "Mempersiapkan", type: "Kata Kerja III", desc: "Persiapan bahan baku produksi esok hari.", jlpt: "N4", bab: 24 },

  // --- BAB 25 (JLPT N4): Pengandaian Kondisional (Tara & Demo) ---
  { id: "v25_1", jp: "～たら", rom: "~tara", translation: "Jika / Seandainya sudah...", type: "Partikel / Konjungsi", desc: "Pengandaian bersyarat tinggi, contoh: 'Jika tiba di stasiun...'.", jlpt: "N4", bab: 25 },
  { id: "v25_2", jp: "～ても", rom: "~temo", translation: "Meskipun / Biarpun...", type: "Partikel / Konjungsi", desc: "Kondisional konsesif, contoh: 'Biarpun hujan tetap berangkat.'.", jlpt: "N4", bab: 25 },
  { id: "v25_3", jp: "かんがえます", rom: "Kangaemasu", translation: "Memikirkan / Merenungkan", type: "Kata Kerja II", desc: "Berpikir keras memecahkan masalah sistem kerja.", jlpt: "N4", bab: 25 },
  { id: "v25_4", jp: "つきます", rom: "Tsukimasu", translation: "Tiba / Sampai", type: "Kata Kerja I", desc: "Tiba di pelabuhan atau bandara udara.", jlpt: "N4", bab: 25 },
  { id: "v25_5", jp: "としをとります", rom: "Toshi wo torimasu", translation: "Menjadi Tua / Berumur", type: "Kata Kerja I", desc: "Usia bertambah seiring waktu.", jlpt: "N4", bab: 25 },
  { id: "v25_6", jp: "たりる", rom: "Tariru", translation: "Cukup / Memadai", type: "Kata Kerja II", desc: "Ketersediaan suku cadang memadai.", jlpt: "N4", bab: 25 },
  { id: "v25_7", jp: "いなか", rom: "Inaka", translation: "Pedesaan / Kampung Halaman", type: "Kata Benda", desc: "Daerah sunyi asri jauh dari metropolitan.", jlpt: "N4", bab: 25 },
  { id: "v25_8", jp: "たいしかん", rom: "Taishikan", translation: "Kedutaan Besar (KBRI)", type: "Kata Benda", desc: "Wajib dilaporkan untuk perlindungan WNI.", jlpt: "N4", bab: 25 },
  { id: "v25_9", jp: "おせわになりました", rom: "Osewa ni narimashita", translation: "Terima kasih banyak atas segala bantuannya", type: "Ungkapan", desc: "Urusan magang usai, berpamitan luhur kepada atasan.", jlpt: "N4", bab: 25 },
  { id: "v25_10", jp: "がんばります", rom: "Ganbarimasu", translation: "Akan berusaha sekuat tenaga", type: "Ungkapan", desc: "Ungkapan pembakar etos kerja pantang menyerah.", jlpt: "N4", bab: 25 }
];

/**
 * Filter vocabulary by JLPT levels.
 */
export const getVocabByJlpt = (level: 'N5' | 'N4'): VocabularyWord[] => {
  return VOCABULARY_DATABASE.filter(v => v.jlpt === level);
};

/**
 * Filter vocabulary by Bab (Chapter).
 */
export const getVocabByBab = (bab: number): VocabularyWord[] => {
  return VOCABULARY_DATABASE.filter(v => v.bab === bab);
};

/**
 * Search vocabulary by Japanese, Romaji, or Indonesian translation.
 */
export const searchVocab = (query: string): VocabularyWord[] => {
  const normQuery = query.toLowerCase().trim();
  if (!normQuery) return VOCABULARY_DATABASE;
  return VOCABULARY_DATABASE.filter(v => 
    v.jp.toLowerCase().includes(normQuery) ||
    v.rom.toLowerCase().includes(normQuery) ||
    v.translation.toLowerCase().includes(normQuery) ||
    v.type.toLowerCase().includes(normQuery) ||
    v.desc.toLowerCase().includes(normQuery)
  );
};
