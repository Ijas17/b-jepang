/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThematicWord {
  id: string;
  jp: string;
  rom: string;
  translation: string;
  category: 'benda' | 'kerja' | 'sifat';
  type: string;
  desc: string;
}

export const THEMATIC_VOCABULARY: ThematicWord[] = [
  // ============================================
  // 1. KATA BENDA UMUM (COMMON NOUNS)
  // ============================================
  {
    id: "tb_01",
    jp: "かいしゃ (会社)",
    rom: "Kaisha",
    translation: "Perusahaan / Kantor",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Tempat bernaung pekerjaan niaga atau tempat bekerja."
  },
  {
    id: "tb_02",
    jp: "ともだち (友達)",
    rom: "Tomodachi",
    translation: "Teman / Kawan",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Relasi sosial dekat, rekan sejawat atau sahabat."
  },
  {
    id: "tb_03",
    jp: "しごと (仕事)",
    rom: "Shigoto",
    translation: "Pekerjaan / Tugas",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Aktivitas profesional harian yang menghasilkan upah."
  },
  {
    id: "tb_04",
    jp: "じゅうしょ (住所)",
    rom: "Juusho",
    translation: "Alat Rumah / Domisili",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Sangat krusial untuk administrasi kependudukan di Jepang."
  },
  {
    id: "tb_05",
    jp: "つくえ (机)",
    rom: "Tsukue",
    translation: "Meja Kerja",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Perabot utama di kelas maupun ruang administrasi kantor."
  },
  {
    id: "tb_06",
    jp: "いす (椅子)",
    rom: "Isu",
    translation: "Kursi",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Tempat duduk pendamping meja kerja."
  },
  {
    id: "tb_07",
    jp: "じしょ (辞書)",
    rom: "Jisho",
    translation: "Kamus",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Alat bantu utama menerjemahkan kosa kata bahasa asing."
  },
  {
    id: "tb_08",
    jp: "でんわ (電話)",
    rom: "Denwa",
    translation: "Telepon / Gawai",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Sarana komunikasi suara jarak jauh."
  },
  {
    id: "tb_09",
    jp: "けいたい (携帯)",
    rom: "Keitai",
    translation: "Ponsel Genggam",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Ponsel genggam yang selalu dibawa bepergian."
  },
  {
    id: "tb_10",
    jp: "しゃしん (写真)",
    rom: "Shashin",
    translation: "Foto / Potret",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Hasil tangkapan gambar optik dari kamera."
  },
  {
    id: "tb_11",
    jp: "うち (家)",
    rom: "Uchi",
    translation: "Rumah / Kediaman",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Tempat tinggal pribadi, tempat bernaung dari penat."
  },
  {
    id: "tb_12",
    jp: "びょういん (病院)",
    rom: "Byouin",
    translation: "Rumah Sakit",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Instansi pelayanan kesehatan medis terpadu."
  },
  {
    id: "tb_13",
    jp: "ぎんこう (銀行)",
    rom: "Ginkou",
    translation: "Bank",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Lembaga keuangan tempat menabung gaji bulanan magang."
  },
  {
    id: "tb_14",
    jp: "としょかん (図書館)",
    rom: "Toshokan",
    translation: "Perpustakaan",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Gedung pusat baca koleksi literatur dan sains."
  },
  {
    id: "tb_15",
    jp: "がっこう (学校)",
    rom: "Gakkou",
    translation: "Sekolah / LPK",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Lembaga bimbingan belajar bekal kerja di Jepang."
  },
  {
    id: "tb_16",
    jp: "きょうしつ (教室)",
    rom: "Kyoushitsu",
    translation: "Ruang Kelas",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Ruangan belajar tatap muka bersama sensei."
  },
  {
    id: "tb_17",
    jp: "しょくどう (食堂)",
    rom: "Shokudou",
    translation: "Kantin / Ruang Makan",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Tempat menikmati santap siang di lingkungan pabrik."
  },
  {
    id: "tb_18",
    jp: "うけつけ (受付)",
    rom: "Uketsuke",
    translation: "Resepsionis / Meja Depan",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Pusat informasi awal pengunjung saat mendatangi gedung."
  },
  {
    id: "tb_19",
    jp: "じむしょ (事務所)",
    rom: "Jimusho",
    translation: "Kantor Administrasi / Ruang Staf",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Ruang pengerjaan berkas staf administrasi magang."
  },
  {
    id: "tb_20",
    jp: "こうじょう (工場)",
    rom: "Koujou",
    translation: "Pabrik / Bengkel Kerja",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Situs utama manufaktur, assembling, atau pengelasan logam."
  },
  {
    id: "tb_21",
    jp: "えき (駅)",
    rom: "Eki",
    translation: "Stasiun",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Pusat transportasi darat kereta cepat komuter Jepang."
  },
  {
    id: "tb_22",
    jp: "くうこう (空港)",
    rom: "Kuukou",
    translation: "Bandar Udara",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Pintu gerbang jalur penerbangan internasional."
  },
  {
    id: "tb_23",
    jp: "じどうしゃ (自動車)",
    rom: "Jidousha",
    translation: "Mobil / Kendaraan Otomotif",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Kendaran beroda empat bertenaga mesin."
  },
  {
    id: "tb_24",
    jp: "おみやげ (お土産)",
    rom: "Omiyage",
    translation: "Oleh-oleh / Bingkisan khas",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Hadiah manis sepulang plesir ke kerabat dekat."
  },
  {
    id: "tb_25",
    jp: "おせわ (お世話)",
    rom: "Osewa",
    translation: "Bantuan / Dukungan Asuhan",
    category: "benda",
    type: "Kata Benda Umum",
    desc: "Istilah kehormatan atas kebaikan bimbingan atasan."
  },

  // ============================================
  // 2. KATA KERJA HARIAN (DAILY VERBS)
  // ============================================
  {
    id: "kk_01",
    jp: "いきます (行きます / 行く)",
    rom: "Ikimasu (Iku)",
    translation: "Pergi",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Melakukan perjalanan menuju ke suatu stasiun atau destinasi."
  },
  {
    id: "kk_02",
    jp: "きます (来ます / 来る)",
    rom: "Kimasu (Kuru)",
    translation: "Datang",
    category: "kerja",
    type: "Kata Kerja Golongan III",
    desc: "Mendatangi lokasi pembicara saat ini."
  },
  {
    id: "kk_03",
    jp: "かえります (帰ります / 帰る)",
    rom: "Kaerimasu (Kaeru)",
    translation: "Pulang",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Kembali pulang ke wisma, asrama, atau tanah air."
  },
  {
    id: "kk_04",
    jp: "たべます (食べます / 食べる)",
    rom: "Tabemasu (Taberu)",
    translation: "Makan",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Menyantap bekal bento atau sarapan sehat pagi hari."
  },
  {
    id: "kk_05",
    jp: "のみます (飲みます / 飲む)",
    rom: "Nomimasu (Nomu)",
    translation: "Minum",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Meneguk air tawar, sake dingin, atau minuman segar."
  },
  {
    id: "kk_06",
    jp: "かいます (買います / 買う)",
    rom: "Kaimasu (Kau)",
    translation: "Membeli",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Membeli keperluan pangan di minimarket (Konbini)."
  },
  {
    id: "kk_07",
    jp: "よみます (読みます / 読む)",
    rom: "Yomimasu (Yomu)",
    translation: "Membaca",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Membaca komik, artikel, manual operasional mesin pabrik."
  },
  {
    id: "kk_08",
    jp: "かきます (書きます / 書く)",
    rom: "Kakimasu (Kaku)",
    translation: "Menulis",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Menulis huruf Kanji, laporan harian kerja, atau jurnal magang."
  },
  {
    id: "kk_09",
    jp: "ききます (聞きます / 聞く)",
    rom: "Kikimasu (Kiku)",
    translation: "Mendengar / Bertanya",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Mendengarkan titah/arahan atasan atau bertanya arah."
  },
  {
    id: "kk_10",
    jp: "はなします (話します / 話す)",
    rom: "Hanashimasu (Hanasu)",
    translation: "Berbicara / Mengobrol",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Wawancara kerja atau mengobrol santai bersama sesama kenshuusei."
  },
  {
    id: "kk_11",
    jp: "べんきょうします (勉強します)",
    rom: "Benkyou shimasu",
    translation: "Belajar",
    category: "kerja",
    type: "Kata Kerja Golongan III",
    desc: "Aktivitas melatih tatabahasa Nihongo menjelang kelulusan."
  },
  {
    id: "kk_12",
    jp: "はたらきます (働きます)",
    rom: "Hatarakimasu",
    translation: "Bekerja",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Menjalankan tugas magang profesional di bengkel jepang."
  },
  {
    id: "kk_13",
    jp: "おきます (起きます / 起きる)",
    rom: "Okimasu (Okiru)",
    translation: "Bangun tidur",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Bangun pagi dini hari agar tidak terlambat absen kerja."
  },
  {
    id: "kk_14",
    jp: "ねます (寝ます / 寝る)",
    rom: "Nemasu (Neru)",
    translation: "Tidur / Rehat",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Tidur malam yang cukup untuk stamina fit esok hari."
  },
  {
    id: "kk_15",
    jp: "あいます (会います / 会う)",
    rom: "Aimasu (Au)",
    translation: "Bertemu / Berjumpa",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Menjumpai relasi, kekasih, atau instruktur di lobi."
  },
  {
    id: "kk_16",
    jp: "つくります (作ります / 作る)",
    rom: "Tsukurimasu (Tsukuru)",
    translation: "Membuat / Merakit",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Membuat hidangan bento atau memproduksi komponen teknik."
  },
  {
    id: "kk_17",
    jp: "つかいます (使います / 使う)",
    rom: "Tsukaimasu (Tsukau)",
    translation: "Menggunakan",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Memakai perkakas kerja safety atau laptop kantor."
  },
  {
    id: "kk_18",
    jp: "あらいます (洗います / 洗う)",
    rom: "Araimasu (Arau)",
    translation: "Mencuci / Membersihkan",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Mencuci baju, tangan, piring, atau part perakitan."
  },
  {
    id: "kk_19",
    jp: "みせます (見せます / 見せる)",
    rom: "Misemasu (Miseru)",
    translation: "Menunjukkan / Memperlihatkan",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Memperlihatkan KTP, paspor, atau hasil tes kepatuhan."
  },
  {
    id: "kk_20",
    jp: "おしえます (教えます / 教える)",
    rom: "Oshiemasu (Oshieru)",
    translation: "Mengajari / Memberitahu",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Menjelaskan cara kerja mesin CNC atau rute bus kota."
  },
  {
    id: "kk_21",
    jp: "おぼえます (覚えます / 覚える)",
    rom: "Oboemasu (Oboeru)",
    translation: "Mengingat / Menghafal",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Menghafal 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) pabrik."
  },
  {
    id: "kk_22",
    jp: "わすれます (忘れます / 忘れる)",
    rom: "Wasuremasu (Wasureru)",
    translation: "Lupa / Mengacuhkan",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Lupa membawa kunci asrama atau pen belajar."
  },
  {
    id: "kk_23",
    jp: "であいます (出会います)",
    rom: "Deaimasu",
    translation: "Bertemu tak sengaja / Berpapasan",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Tak sengaja berjumpa rekan lama sekolah di supermarket."
  },
  {
    id: "kk_24",
    jp: "きをつけます (気合を入れます)",
    rom: "Ki wo tsukemasu",
    translation: "Berhati-hati / Konsentrasi",
    category: "kerja",
    type: "Kata Kerja Golongan II",
    desc: "Aksi meningkatkan kewaspadaan penuh saat mengoperasikan las."
  },
  {
    id: "kk_25",
    jp: "おせわになります (お世話になります)",
    rom: "Osewa ni narimasu",
    translation: "Mengharapkan bantuan bimbingan Anda",
    category: "kerja",
    type: "Kata Kerja Golongan I",
    desc: "Salam asor yang sangat luhur di permulaan kerja."
  },

  // ============================================
  // 3. KATA SIFAT UTAMA (ADJECTIVES -I / -NA)
  // ============================================
  {
    id: "ks_01",
    jp: "たかい (高い)",
    rom: "Takai",
    translation: "Mahal / Tinggi",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Harga barang mewah berbiaya tinggi atau puncak gunung menjulang."
  },
  {
    id: "ks_02",
    jp: "やすい (安い)",
    rom: "Yasui",
    translation: "Murah",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Banderol barang sangat ekonomis, menghemat kantong."
  },
  {
    id: "ks_03",
    jp: "あつい (暑い / 熱い)",
    rom: "Atsui",
    translation: "Panas (Cuaca / Benda)",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Terik matahari musim panas atau secangkir teh seduhan mendidih."
  },
  {
    id: "ks_04",
    jp: "さむい (寒い)",
    rom: "Samui",
    translation: "Dingin (Cuaca)",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Rasa gigil hawa luar ruangan saat salju turun menderu."
  },
  {
    id: "ks_05",
    jp: "つめたい (冷たい)",
    rom: "Tsumetai",
    translation: "Dingin (Sentuhan Benda)",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Suhu segelas es batu jernih dingin saat diteguk."
  },
  {
    id: "ks_06",
    jp: "むずかしい (難しい)",
    rom: "Muzukashii",
    translation: "Sulit / Sukar",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Soal ujian Kanji level N4 yang butuh ketelitian coretan."
  },
  {
    id: "ks_07",
    jp: "やさしい (易しい / 優しい)",
    rom: "Yasashii",
    translation: "Mudah / Ramah Baik Hati",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Soal tes kosakata yang mudah dinalar atau sikap atasan ramah."
  },
  {
    id: "ks_08",
    jp: "ひろい (広い)",
    rom: "Hiroi",
    translation: "Luas / Lapang",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Gedung olahraga luas atau taman asrama yang membentang lapang."
  },
  {
    id: "ks_09",
    jp: "せまい (狭い)",
    rom: "Semai",
    translation: "Sempit / Padat",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Gang sempit perumahan kota padat penduduk."
  },
  {
    id: "ks_10",
    jp: "おもしろい (面白い)",
    rom: "Omashiroi",
    translation: "Menarik / Menghibur",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Kisah komik Jepang jenaka menarik dibaca."
  },
  {
    id: "ks_11",
    jp: "あたらしい (新しい)",
    rom: "Atarashii",
    translation: "Baru",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Kondisi peralatan rilis terbaru dari pabrikan gres."
  },
  {
    id: "ks_12",
    jp: "ふるい (古い)",
    rom: "Furui",
    translation: "Kuno / Usang / Lama",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Buku antik berdebu peninggalan kakek buyut."
  },
  {
    id: "ks_13",
    jp: "おおい (多い)",
    rom: "Ooi",
    translation: "Banyak (Jumlah)",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Volume barang atau antrean penduduk ramai saat liburan."
  },
  {
    id: "ks_14",
    jp: "すくない (少ない)",
    rom: "Sukunai",
    translation: "Sedikit (Jumlah)",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Kuantitas material baja tahan karat yang tersisa di rak."
  },
  {
    id: "ks_15",
    jp: "いい / よい (良い)",
    rom: "Ii / Yoi",
    translation: "Bagus / Baik",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Rekomendasi taktik pengemasan yang bernilai guna positif."
  },
  {
    id: "ks_16",
    jp: "わるい (悪い)",
    rom: "Warui",
    translation: "Jelek / Buruk",
    category: "sifat",
    type: "Kata Sifat -i",
    desc: "Kondisi fisik drop lelah atau kualitas paku keling yang rusak."
  },
  {
    id: "ks_17",
    jp: "べんり (便利)",
    rom: "Benri",
    translation: "Praktis / Memudahkan",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Fasilitas smart-card mempermudah lalu-lalang di gerbang."
  },
  {
    id: "ks_18",
    jp: "ふべん (不便)",
    rom: "Fuben",
    translation: "Tidak Praktis / Menyulitkan",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Akses wilayah pedalaman terpencil tanpa rute transportasi umum."
  },
  {
    id: "ks_19",
    jp: "しんせつ (親切)",
    rom: "Shinsetsu",
    translation: "Baik Hati / Suka Menolong",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Karakteristik tetangga Jepang paruh baya penyeka ramah."
  },
  {
    id: "ks_20",
    jp: "げんき (元気)",
    rom: "Genki",
    translation: "Sehat / Berstamina Prima",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Ungkapan kebugaran raga jiwa pantang lesu saat menyapa."
  },
  {
    id: "ks_21",
    jp: "にぎやか (賑やか)",
    rom: "Nigiyaka",
    translation: "Ramai / Hiruk Pikuk",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Atmosfer pasar malam atau pertigaan Shibuya yang padat."
  },
  {
    id: "ks_22",
    jp: "しずか (静か)",
    rom: "Shizuka",
    translation: "Tenang / Sunyi / Hening",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Relaksasi damai suasana perpustakaan atau kuil shinto."
  },
  {
    id: "ks_23",
    jp: "きれい (綺麗)",
    rom: "Kirei",
    translation: "Cantik / Indah / Bersih resik",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Kebersihan lantai asrama tanpa debu atau panorama danau jepang."
  },
  {
    id: "ks_24",
    jp: "ひま (暇)",
    rom: "Hima",
    translation: "Senggang / Luang waktu",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Ketiadaan tugas lembur di akhir pekan, waktu santai bergilir."
  },
  {
    id: "ks_25",
    jp: "すき (好き)",
    rom: "Suki",
    translation: "Suka / Gemar",
    category: "sifat",
    type: "Kata Sifat -na",
    desc: "Kesukaan hati yang mendalam terhadap kuliner ramen pedas."
  }
];
