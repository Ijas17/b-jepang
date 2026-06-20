/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from './lessonsPart1';

export const LESSONS_PART2: Lesson[] = [
  {
    id: 13,
    classLevel: "Kelas 5 (Mahir Awal)",
    title: "Bab 13: Keinginan Bekerja di Jepang",
    theme: "Membahas Keinginan Masa Depan & Minat Kerja",
    estimatedMinutes: 45,
    objectives: [
      "Mampu menggunakan pola keinginan kepemilikan benda (ほしぃ - hoshii)",
      "Mampu merangkai keinginan melakukan perbuatan (〜たい - tai) harian",
      "Menyatakan tujuan kepergian atau kedatangan (tujuan ni ikimasu)"
    ],
    vocabulary: [
      { jp: "ほしい", rom: "Hoshii", translation: "Ingin (memiliki barang)", type: "Kata Sifat-i", desc: "Mengekspresikan hasrat kepemilikan material." },
      { jp: "おきなわ", rom: "Okinawa", translation: "Okinawa", type: "Kata Benda", desc: "Provinsi pulau tropis indah di selatan Jepang." },
      { jp: "こうじょう", rom: "Koujou", translation: "Pabrik / Manufaktur", type: "Kata Benda", desc: "Tempat kerja utama pemagang industri." },
      { jp: "かわ", rom: "Kawa", translation: "Sungai", type: "Kata Benda", desc: "Aliran air tawar alam." },
      { jp: "つり", rom: "Tsuri", translation: "Memancing ikan", type: "Kata Benda", desc: "Hobi menangkap ikan dengan joran." }
    ],
    grammarPoints: [
      {
        title: "Pola: KB が ほしいです (Ingin memiliki barang...)",
        explanation: "Pola dasar hasrat. Benda yang didambakan ditandai partikel が (ga) diikuti kata hoshii desu. Hoshii berkonjugasi seperti kata sifat-i biasa.",
        exJp: "私は新しいスマートフォンがほしいです。",
        exRom: "Watashi wa atarashii sumaatofon ga hoshii desu.",
        exId: "Saya ingin mempunyai ponsel pintar baru.",
        commonMistakeJp: "わたしは 日本へ ほしいです。",
        commonMistakeId: "Salah menggunakan 'hoshii' untuk menyatakan keinginan pergi ke tempat. Hoshii hanya diduetkan dengan barang nyata."
      },
      {
        title: "Pola: KK Bentuk-Masu (hilangkan masu) + たいです (Ingin melakukan...)",
        explanation: "Mengubah kata kerja menjadi keinginan tindakan. Caranya: hilangkan akhiran 'masu' lalu ganti dengan 'tai desu'. Bentuk tai berkonjugasi setara kata sifat-i.",
        exJp: "日本で介護の仕事をしてみたいです。",
        exRom: "Nihon de kaigo no shigoto o shite mitai desu.",
        exId: "Saya ingin mencoba bekerja di bidang perawatan lansia di Jepang.",
        commonMistakeJp: "すしを食べますたいです。",
        commonMistakeId: "Lupa menghapus kata 'masu' sebelum menempelkan 'tai'."
      }
    ],
    sentencePatterns: [
      { pattern: "私は日本の車がほしいです。", meaning: "Saya ingin mobil buatan Jepang." },
      { pattern: "今週末、映画館へ行きたいです。", meaning: "Akhir pekan ini saya ingin pergi ke bioskop." }
    ],
    exercises: [
      {
        type: "A",
        title: "Urutan",
        sentence: "Katakan 'Saya ingin makan ramen':",
        options: ["ラーメンを食べたいです", "ラーメンを食べますたいです", "ラーメンが食べほしいです"],
        correct: "ラーメンを食べたいです",
        explanation: "Tabemasu dihilangkan 'masu' menjadi tabe-tai desu."
      },
      {
        type: "B",
        title: "Pilihan",
        sentence: "Pasangan dari kata 'Hoshii' adalah:",
        options: ["Barang yang diincar", "Perbuatan aksi", "Tempat tinggal"],
        correct: "Barang yang diincar",
        explanation: "Hoshii hanya merujuk pada benda substantif murni."
      },
      {
        type: "C",
        title: "Partikel",
        sentence: "Atarashii jitensha __ hoshii desu.",
        options: ["が (ga)", "を (wo)", "に (ni)"],
        correct: "が (ga)",
        explanation: "Target keinginan hoshii diikat menggunakan partikel ga."
      }
    ],
    dialogue: [
      { speaker: "ルカ", textJp: "日本で何が一番買いたいですか。", textRom: "Nihon de nani ga ichiban kaitai desu ka?", textId: "Di Jepang benda apa yang paling ingin Anda beli?" },
      { speaker: "山田", textJp: "パソコンがほしいですから、秋葉原で買いたいです。", textRom: "Pasokon ga hoshii desu kara, Akihabara de kaitai desu.", textId: "Karena ingin mempunyai laptop, saya ingin membelinya di Akihabara." }
    ],
    quiz: [
      {
        question: "Ubah kata 'nomimasu' (minum) menjadi 'ingin minum':",
        options: ["nomitai desu", "nomimasutai desu", "nomihoshii desu"],
        answer: "nomitai desu",
        explanation: "Masu dibuang dipasangkan tai."
      }
    ],
    cultureNote: "Ketika membahas impian kerja dengan pewawancara kerja (mensetsu) Jepang, suarakan jawaban secara bersungguh-sungguh dengan punggung tegak.",
    reviewSummary: [
      "Menguasai hasrat barang memakai 'ga hoshii'.",
      "Menguasai hasrat perbuatan memakai bentuk verba '~tai desu'."
    ]
  },
  {
    id: 14,
    classLevel: "Kelas 5 (Mahir Awal)",
    title: "Bab 14: Konjugasi Bentuk ~te",
    theme: "Meminta Tolong Mengantarkan Barang di Gudang",
    estimatedMinutes: 50,
    objectives: [
      "Menguasai konjugasi pembagian golongan Kata Kerja I, II, III",
      "Membuat permintaan tolong sopan memakai pola (〜てください - te kudasai)",
      "Menerangkan tindakan yang sedang dilakukan (〜ています - te imasu)"
    ],
    vocabulary: [
      { jp: "おきます", rom: "Okimasu", translation: "Meletakkan", type: "Kata Kerja I", desc: "Menaruhkan benda di permukaan." },
      { jp: "まちます", rom: "Machimasu", translation: "Menunggu", type: "Kata Kerja I", desc: "Menanti kedatangan giliran." },
      { jp: "てつだいます", rom: "Tetsudaimasu", translation: "Membantu", type: "Kata Kerja I", desc: "Turut meringankan beban tugas rekan." },
      { jp: "みせます", rom: "Misemasu", translation: "Memperlihatkan", type: "Kata Kerja II", desc: "Menunjukkan dokumen atau sertifikat." },
      { jp: "コピ―します", rom: "Kopii shimasu", translation: "Memfotokopi", type: "Kata Kerja III", desc: "Menggandakan berkas dengan printer." }
    ],
    grammarPoints: [
      {
        title: "Pola: Klasifikasi Golongan Kata Kerja Jepang (Te-form)",
        explanation: "Pilar utama bahasa Jepang! Golongan I: Berakhiran vokal 'i' sebelum masu (Kaimasu -> Katte, Machimasu -> Matte, Kakimasu -> Kaite). Golongan II: Berakhiran vokal 'e' atau beberapa perkecualian sela sebelum masu (Tabemasu -> Tabete, Mimasu -> Mite). Golongan III: Irregular (Shimasu -> Shite, Kimasu -> Kite).",
        exJp: "ハサミを使ってください。",
        exRom: "Hasami o tsukatte kudasai.",
        exId: "Tolong gunakan gunting.",
        commonMistakeJp: "持ちますてください。",
        commonMistakeId: "Menghubungkan kata kerja goly I langsung ke kudasai tanpa mengubahnya dulu menjadi bentuk ~te (Matte kudasai)."
      },
      {
        title: "Pola: KK Bentuk-te + います (Sedang melakukan...)",
        explanation: "Menyatakan tindakan aksi progresif kontinu harian yang sedang berlangsung lurus.",
        exJp: "彼は事務所でレポートを書いています。",
        exRom: "Kare wa jimusho de repooto o kaite imasu.",
        exId: "Dia sedang menulis laporan di kantor.",
        commonMistakeJp: "わたしは 本を読み ますいます。",
        commonMistakeId: "Salah menggabungkan 'masu' dengan 'imasu', wajib diubah menjadi 'yonde imasu'."
      }
    ],
    sentencePatterns: [
      { pattern: "ちょっと待ってください。", meaning: "Tolong tunggu sebentar." },
      { pattern: "今、雨が降っています。", meaning: "Sekarang, hujan sedang turun." }
    ],
    exercises: [
      {
        type: "A",
        title: "Konjugasi",
        sentence: "Bentuk -te dari 'Kaimasu' (Membeli) adalah:",
        options: ["Katte", "Kaite", "Kande"],
        correct: "Katte",
        explanation: "Kata kerja Golongan I yang berakhiran i-chi-ri di depan masu diubah menjadi 'tte'."
      },
      {
        type: "B",
        title: "Pilihan",
        sentence: "Tolong tunjukkan kamusnya:",
        options: ["見せてください (misete kudasai)", "見してください (mishite kudasai)", "見てください (mite kudasai)"],
        correct: "見せてください (misete kudasai)",
        explanation: "Misemasu (Golongan II) dikontrol menjadi misete kudasai."
      },
      {
        type: "C",
        title: "Arti",
        sentence: "Apakah makna dari 'Shite kudasai'?",
        options: ["Tolong lakukan", "Tolong beli", "Tolong pergi"],
        correct: "Tolong lakukan",
        explanation: "Shimasu memiliki bentuk te berupa 'shite'."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "ルカさん、この書類をコピ―してください。", textRom: "Ruka-san, kono shorui o kopii shite kudasai.", textId: "Ruka, tolong fotokopi berkas kertas laporan ini." },
      { speaker: "ルカ", textJp: "はい、何枚コピーしますか。", textRom: "Hai, nan-mai kopii shimasu ka?", textId: "Baik, berapa lembar fotokopi yang dibutuhkan?" }
    ],
    quiz: [
      {
        question: "Manakah bentuk -te yang tepat untuk kata 'Kakimasu' (menulis)?",
        options: ["Kaite", "Katte", "Kashite"],
        answer: "Kaite",
        explanation: "Ki sebelum masu dikonversi bertahap menjadi 'ite'."
      }
    ],
    cultureNote: "Saat memohon bantuan kerja kepada senior, awali selalu dengan menyapa ramah 'Oisogashii tokoro sumimasen' (Maaf mengganggu di saat sibuk).",
    reviewSummary: [
      "Menguasai konjugasi sakral bentuk te.",
      "Mengajukan permohonan santun memakai 'te kudasai'."
    ]
  },
  {
    id: 15,
    classLevel: "Kelas 6 (Sertifikasi N5)",
    title: "Bab 15: Izin & Larangan di Pabrik",
    theme: "Aturan Keselamatan & Kesehatan Kerja",
    estimatedMinutes: 45,
    objectives: [
      "Mampu meminta izin perbuatan (〜ても いいですか - te mo ii desu ka)",
      "Mampu mengutarakan larangan keras (〜ては いけません - te wa ikemasen)",
      "Menyatakan kepemilikan aset perusahaan"
    ],
    vocabulary: [
      { jp: "おきます", rom: "Okimasu", translation: "Menaruh / Meletakkan", type: "Kata Kerja I", desc: "Aksi meletakkan komponen." },
      { jp: "つくります", rom: "Tsukurimasu", translation: "Membuat", type: "Kata Kerja I", desc: "Memproduksi barang perakitan." },
      { jp: "うります", rom: "Urimasu", translation: "Menjual", type: "Kata Kerja I", desc: "Meniagakan produk jadi." },
      { jp: "しっています", rom: "Shitte imasu", translation: "Tahu / Kenal", type: "Kata Kerja I", desc: "Memiliki memori pengetahuan sela." },
      { jp: "すみます", rom: "Sumimasu", translation: "Tinggal (bermukim)", type: "Kata Kerja I", desc: "Meresidensi alamat asrama." }
    ],
    grammarPoints: [
      {
        title: "Pola: KK Bentuk-te + も いいですか (Bolehkah saya...)",
        explanation: "Cara sopan mengajukan permohonan lisensi perizinan personal melakukan suatu hal di mess atau area umum.",
        exJp: "ここで写真を撮ってもいいですか。",
        exRom: "Koko de shashin o totte mo ii desu ka?",
        exId: "Bolehkah saya memotret foto di sebelah sini?",
        commonMistakeJp: "タバコを吸う も いいですか。",
        commonMistakeId: "Lupa mengubah ke bentuk -te (sute) sebelum memasangkan 'mo ii desu ka'."
      },
      {
        title: "Pola: KK Bentuk-te + は いけません (Dilarang keras...)",
        explanation: "Menyatakan instruksi larangan keras di tempat kerja, pabrik, atau demi menjaga keselamatan sirkuit.",
        exJp: "工場でタバコを吸ってはいけません。",
        exRom: "Koujou de tabako o sutte wa ikemasen.",
        exId: "Dilarang keras merokok di area dalam pabrik.",
        commonMistakeJp: "入る は いけません。",
        commonMistakeId: "Lupa meremajakan kata masuk (hairimasu) menjadi bentuk -te (haitte)."
      }
    ],
    sentencePatterns: [
      { pattern: "ここに車を止めてもいいですか。", meaning: "Bolehkah saya memarkir mobil di area sini?" },
      { pattern: "ここにゴミを捨ててはいけません。", meaning: "Dilarang membuang sampah di area sini." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Bolehkah saya memakai komputer ini?",
        options: ["このパソコンを使ってもいいですか", "このパソコンを使ってはいけません", "このパソコンを使ってください"],
        correct: "このパソコンを使ってもいいですか",
        explanation: "'~te mo ii desu ka' mengekspresikan perizinan diri."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Koujou no naka de asobb__ wa ikemasen.",
        options: ["んで (nde)", "て (te)", "た (ta)"],
        correct: "んで (nde)",
        explanation: "Asobimasu bentuk te nya adalah 'asonde'."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti dari 'Shitte imasu ka'?",
        options: ["Apakah Anda tahu?", "Apakah Anda tinggal?", "Apakah Anda membuat?"],
        correct: "Apakah Anda tahu?",
        explanation: "Shitte imasu artinya mengetahui suatu info fakta."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "ルカさん、ここに自転車を止めてはいけませんよ。", textRom: "Ruka-san, koko ni jitensha o tomete wa ikemasen yo.", textId: "Ruka, dilarang keras memarkir sepeda di sini lho." },
      { speaker: "ルカ", textJp: "すみません、どこに止めればいいですか。", textRom: "Sumimasen, doko ni tomereba ii desu ka?", textId: "Maaf, sebaiknya diparkir di sebelah mana?" }
    ],
    quiz: [
      {
        question: "Pilihan penolakan halus instruksi 'Dilarang keras masuk' adalah?",
        options: ["Haitte wa ikemasen", "Haitte mo ii desu", "Hairu desu"],
        answer: "Haitte wa ikemasen",
        explanation: "Larangan keras mutlak memakai de wa ikemasen."
      }
    ],
    cultureNote: "Asrama Jepang menetapkan hari penjemputan sampah (Gomi) yang ketat. Pisahkan organik (Moeru), plastik (Moenai), serta kaleng kaca botol sesuai laci murni.",
    reviewSummary: [
      "Mengajukan perizinan 'te mo ii desu'.",
      "Mematuhi larangan industri keselamatan 'te wa ikemasen'."
    ]
  },
  {
    id: 16,
    classLevel: "Kelas 6 (Sertifikasi N5)",
    title: "Bab 16: Urutan Langkah Kerja",
    theme: "Alur Perakitan Produk di Mesin",
    estimatedMinutes: 45,
    objectives: [
      "Menyambungkan aktivitas berurutan waktu (〜て、〜て- te-form chain)",
      "Menerangkan sekuen 'setelah melakukan' (〜てから - te kara)",
      "Meringkas ciri khas fisik wilayah"
    ],
    vocabulary: [
      { jp: "おります", rom: "Orimasu", translation: "Turun (kereta/bus)", type: "Kata Kerja II", desc: "Mengosongkan muatan gerbong." },
      { jp: "あびます", rom: "Abimasu", translation: "Mandi (air shower)", type: "Kata Kerja II", desc: "Membersihkan raga tubuh." },
      { jp: "いれます", rom: "Iremasu", translation: "Memasukkan", type: "Kata Kerja II", desc: "Menyisipkan komponen ke saku." },
      { jp: "だします", rom: "Dashimasu", translation: "Mengeluarkan", type: "Kata Kerja I", desc: "Menyerahkan uang, menarik berkas." },
      { jp: "おします", rom: "Oshimasu", translation: "Menekan", type: "Kata Kerja I", desc: "Menekan tombol emergency industri." }
    ],
    grammarPoints: [
      {
        title: "Pola: Rangkaian Sambung Kata Kerja (te, te, ...)",
        explanation: "Menghubungkan rantai tindakan berurutan kronologis. Cukup ubah kata kerja awal-medial menjadi bentuk-te, dan tandai kata kerja penutup waktu di paling ujung.",
        exJp: "昨日京都へ行って、お寺を見て、友達に会いました。",
        exRom: "Kinou Kyoto e itte, otera o mite, tomodachi ni aimashita.",
        exId: "Kemarin saya pergi ke Kyoto, melihat pura kuil, lalu berpapasan menemui teman.",
        commonMistakeJp: "京都へ行きます、お寺を見ます、友達に会いました。",
        commonMistakeId: "Menyambung rangkaian kejadian dengan bentuk masu biasa bertumpuk-tumpuk tanpa modifikasi konjugasi."
      },
      {
        title: "Pola: KK Bentuk-te + から (Setelah melakukan...)",
        explanation: "Menegaskan bahwa perbuatan kedua mutlak baru boleh diinisiasi sesudah tuntas melaksanakan perbuatan kesatu harian.",
        exJp: "仕事が終わってから、ランニングをします。",
        exRom: "Shigoto ga owatte kara, ranningu o shimasu.",
        exId: "Setelah pekerjaan selesai, saya berlari lari sehat.",
        commonMistakeJp: "終わる から 走ります。",
        commonMistakeId: "Memakai bentuk kamus biasa di depan kata 'kara', padahal aturannya mewajibkan bentuk '-te kara'."
      }
    ],
    sentencePatterns: [
      { pattern: "シャワーを浴びてから、寝ます。", meaning: "Setelah mandi shower, saya tidur." },
      { pattern: "お金を下ろしてから、買い物します。", meaning: "Setelah menarik uang tunai, saya berbelanja." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Setelah menekan tombol ini, masukkan kartu koin:",
        options: ["このボタンを押してから、カードを入れてください", "このボタンを押し、カードを入れます", "このボタンを押して、カードがほしぃ"],
        correct: "このボタンを押してから、カードを入れてください",
        explanation: "'Oshite' (te-form) + 'kara' + 'irete kudasai'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Ruka-san wa kurokute __ me ga ookii desu.",
        options: ["(tanpa kata tambahan)", "の (no)", "が (ga)"],
        correct: "(tanpa kata tambahan)",
        explanation: "Penyambungan kata sifat-i menggunakan bentuk te (kuroi -> kurokute)."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti dari 'Iremasu'?",
        options: ["Memasukkan", "Mengeluarkan", "Menutup"],
        correct: "Memasukkan",
        explanation: "Iremasu berarti memasukkan sesuatu barang."
      }
    ],
    dialogue: [
      { speaker: "班長", textJp: "機械の電源を切ってから、掃除をしてください。", textRom: "Kikai no dengen o kitte kara, souji o shite kudasai.", textId: "Setelah mematikan daya mesin, tolong lakukan pembersihan." },
      { speaker: "ルカ", textJp: "はい、安全のために気をつけて行います。", textRom: "Hai, anzen no tame ni ki o tsukete okonaimasu.", textId: "Baik, demi keselamatan akan saya lakukan berhati-hati." }
    ],
    quiz: [
      {
        question: "Bagaimanakah mengubah 'shokuji o shimasu' (makan) menjadi 'setelah selesai makan'?",
        options: ["shokuji o shite kara", "shokuji o shimasu kara", "shokuji o shita kara"],
        answer: "shokuji o shite kara",
        explanation: "Shimasu dikonversi menjadi shite barulah ditambah kara."
      }
    ],
    cultureNote: "Keselamatan di area industri Jepang dirangkum dalam jargon 'Anzen Daiichi' (Keselamatan Nomor Satu). Pahami instruksi langkah kerja dengan tenang.",
    reviewSummary: [
      "Menghubungkan rentetan aktivitas dengan rumpang 'KK-te'.",
      "Menyusun sekuens teratur menggunakan 'te kara'."
    ]
  },
  {
    id: 17,
    classLevel: "Kelas 7 (SSW & JLPT N4)",
    title: "Bab 17: Kewajiban & Tindakan Darurat",
    theme: "Melaporkan Kerusakan Mesin Pabrik",
    estimatedMinutes: 50,
    objectives: [
      "Menguasai pembentukan Kata Kerja bentuk Negatif (Nai-form)",
      "Menyatakan keharusan mutlak (〜なければ なりません - nakereba narimasen)",
      "Menyatakan kelegaan tidak wajib (〜なくても いいです - nakute mo ii desu)"
    ],
    vocabulary: [
      { jp: "おぼえます", rom: "Oboemasu", translation: "Menghafal / Mengingat", type: "Kata Kerja II", desc: "Merekam memori pelajaran." },
      { jp: "わすれます", rom: "Wasuremasu", translation: "Lupa", type: "Kata Kerja II", desc: "Kehilangan ingatan pemicu." },
      { jp: "しんぱいします", rom: "Shinpaishimasu", translation: "Khawatir / Cemas", type: "Kata Kerja III", desc: "Perasaan risau mendalam." },
      { jp: "もっていきます", rom: "Motte ikimasu", translation: "Membawa pergi", type: "Kata Kerja I", desc: "Membawa barang menjauh." },
      { jp: "ぬぎます", rom: "Nugimasu", translation: "Melepas (pakaian/sepatu)", type: "Kata Kerja I", desc: "Membuka sandangan pelindung." }
    ],
    grammarPoints: [
      {
        title: "Pola: Cara Membentuk Kata Kerja Negatif Dasar (Nai-form)",
        explanation: "Golongan I: Ubah vokal penentu 'i' sebelum masu menjadi baris 'a' lalu tambah 'nai' (Kaimasu -> Kawanai, Kakimasu -> Kakanai). Golongan II: Buang masu langsung ganti 'nai' (Tabemasu -> Tabenai). Golongan III: Shimus -> Shinai, Kimasu -> Konai.",
        exJp: "パスポートを忘れないでください。",
        exRom: "Pasupooto o wasurenai de kudasai.",
        exId: "Tolong jangan lupakan passport harian.",
        commonMistakeJp: "忘れなくて ください。",
        commonMistakeId: "Memohon larangan halus memakai 'nakute kudasai'. Yang legal mutlak adalah 'nai de kudasai'."
      },
      {
        title: "Pola: KK Bentuk-nai + なければ なりません (Keharusan Mutlak / Wajib)",
        explanation: "Pola wajib SSW! Diperoleh dari bentuk -nai, buang huruf 'i' di ujung, ganti dipasangkan 'nakereba narimasen'.",
        exJp: "毎日残業の報告書を書かなければなりません。",
        exRom: "Mainichi zangyou no houkokusho o kakanakereba narimasen.",
        exId: "Setiap hari diwajibkan menulis lembar laporan kerja lembur.",
        commonMistakeJp: "書かない なければなりません。",
        commonMistakeId: "Lupa membuang huruf 'i' terakhir pada 'kakanai' sebelum menyambungnya dengan nakereba narimasen."
      }
    ],
    sentencePatterns: [
      { pattern: "靴を脱がなければなりませんか。", meaning: "Apakah saya harus melepas sepatu?" },
      { pattern: "日曜日ですから、早く起きなくてもいいです。", meaning: "Karena hari Minggu, tidak perlu bangun pagi-pagi." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Tolong jangan merokok di sini.",
        options: ["ここでタバコを吸わないでください", "ここでタバコを吸ってはいけません", "ここでタバコを吸わなくていいです"],
        correct: "ここでタバコを吸わないでください",
        explanation: "Permohonan larangan sopan: 'nai de kudasai'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Ashita hayaku oki__ narimasen.",
        options: ["なければ (nakereba)", "なくちゃ (nakucha)", "なくても (nakutemo)"],
        correct: "なければ (nakereba)",
        explanation: "Pasangan absolut penyusunan keharusan: '~nakereba' + 'narimasen'."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti dari 'Nakute mo ii desu'?",
        options: ["Boleh tidak dilakukan", "Harus dilakukan", "Dilarang dilakukan"],
        correct: "Boleh tidak dilakukan",
        explanation: "Pola kelonggaran: tidak wajib melaksanakannya."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "熱がありますから、無理をしないで休まなければなりませんよ。", textRom: "Netsu ga arimasu kara, muri o shinaide yasumanakereba narimasen yo.", textId: "Karena demam panas, jangan dipaksakan, Anda wajib istirahat lho." },
      { speaker: "実習生", textJp: "はい、分かりました。お薬をもらいに行きます。", textRom: "Hai, wakarimashita. Okusuri o morai ni ikimasu.", textId: "Baik, saya mengerti. Saya akan pergi mengambil obat." }
    ],
    quiz: [
      {
        question: "Ubah kata 'kaerimasu' ke kewajiban: 'Harus pulang':",
        options: ["kaeranakereba narimasen", "kaeranakutenarimasen", "kaeranai de kudasai"],
        answer: "kaeranakereba narimasen",
        explanation: "Kaerimasu -> kaeranai -> kaeranakereba narimasen."
      }
    ],
    cultureNote: "Saat tidak sehat di tempat magang Jepang, laporkan segera kepada Kumiai (Organisasi Pengawas) agar tidak memicu ambruk performa fisik.",
    reviewSummary: [
      "Menguasai konjugasi bentuk negatif 'Nai-form'.",
      "Menggunakan penunjuk mandat 'nakereba narimasen' dan izin longgar 'nakute mo ii'."
    ]
  },
  {
    id: 18,
    classLevel: "Kelas 7 (SSW & JLPT N4)",
    title: "Bab 18: Kemampuan & Hobi Deskriptif",
    theme: "Membahas Persyaratan Keahlian Mensetsu Kerja",
    estimatedMinutes: 45,
    objectives: [
      "Menguasai pembentukan Kata Kerja bentuk Kamus (Jisho-form)",
      "Menyatakan kompetensi kemampuan (〜ことが できます - koto ga dekimasu)",
      "Mendeskripsikan detail kegemaran rekreasi"
    ],
    vocabulary: [
      { jp: "うんてんします", rom: "Untenshimasu", translation: "Mengemudi", type: "Kata Kerja III", desc: "Mengendalikan setir kemudi." },
      { jp: "およぎます", rom: "Oyogimasu", translation: "Berenang", type: "Kata Kerja I", desc: "Mengapung di kolam air." },
      { jp: "しゅうりします", rom: "Shuurishimasu", translation: "Mereparasi / Menservis", type: "Kata Kerja III", desc: "Membetulkan jeroan mesin rusak." },
      { jp: "ピアノ", rom: "Piano", translation: "Piano", type: "Kata Benda", desc: "Alat musik tuts berdawai." },
      { jp: "シャシン", rom: "Shashin", translation: "Foto / Potret", type: "Kata Benda", desc: "Hasil jepretan lensa visual." }
    ],
    grammarPoints: [
      {
        title: "Pola: Klasifikasi Kata Kerja Bentuk Kamus (Jisho-form)",
        explanation: "Bentuk dasar harian di kamus. Gol I: vokal 'i' diubah baris ke vokal 'u' (Kaimasu -> Kau, Kakimasu -> Kaku). Gol II: Akhiran masu dibuang langsung ditempeli 'ru' (Tabemasu -> Taberu, Mimasu -> Miru). Gol III: Shimasu -> Suru, Kimasu -> Kuru.",
        exJp: "私は日本料理を作ることができます。",
        exRom: "Watashi wa Nihon ryouri o tsukuru koto ga dekimasu.",
        exId: "Saya sanggup memproses membuat hidangan makanan Jepang.",
        commonMistakeJp: "わたしは 漢字をかきますことができます。",
        commonMistakeId: "Salah menggunakan kata kerja bentuk sopan '~masu' sebelum koto ga dekimasu. Wajib diganti ke bentuk kamus terlebih dahulu (kaku koto ga dekimasu)."
      },
      {
        title: "Pola: 趣味は KK Bentuk-Kamus + ことです (Hobi saya adalah...)",
        explanation: "Pola ideal menceritakan hobi berbasis perbuatan dinamis secara komplit.",
        exJp: "私の趣味は写真を撮ることです。",
        exRom: "Watashi no shumi wa shashin o toru koto desu.",
        exId: "Kegemaran hobi saya adalah menjepret gambar foto.",
        commonMistakeJp: "趣味 は 写真 撮り です。",
        commonMistakeId: "Kurang pas memnominalkan kata kerja secara mentah, wajib memakai pola 'toru koto desu'."
      }
    ],
    sentencePatterns: [
      { pattern: "車を運転することができますか。", meaning: "Apakah Anda sanggup menyetir kendaraan mobil?" },
      { pattern: "ここから海が見えることができます。", meaning: "Dari tempat ini sanggup memandang birunya air laut." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Apakah Anda bisa membaca lembar kanji?",
        options: ["漢字を読むことができますか", "漢字を読みますことができますか", "漢字を読めことができますか"],
        correct: "漢字を読むことができますか",
        explanation: "Bentuk kamus dari yomimasu adalah yomu, dipasangkan koto ga dekimasu ka."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Asobi__ koto ga dekimasu.",
        options: ["ぶ (bu)", "んで (nde)", "ぶる (buru)"],
        correct: "ぶ (bu)",
        explanation: "Asobimasu diubah ke bentuk kamus menjadi asobu."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Bentuk kamus dari 'Kimasu' (Datang) adalah:",
        options: ["Kuru", "Miru", "Suru"],
        correct: "Kuru",
        explanation: "Kimasu adalah golongan III yang bermetamorfosis menjadi kuru."
      }
    ],
    dialogue: [
      { speaker: "面接官", textJp: "インドネシアでフォークリフトの運転をすることができましたか。", textRom: "Indonesia de fookurifuto no unten o suru koto ga dekimashita ka?", textId: "Apakah di Indonesia dulu Anda sanggup mengemudikan forklift?" },
      { speaker: "実習生", textJp: "はい、３年間工場で運転していました。", textRom: "Hai, san-nenkan koujou de unten shite imashita.", textId: "Ya, saya mengoperasikannya selama 3 tahun di pabrik." }
    ],
    quiz: [
      {
        question: "Bentuk kamus formal dari kata 'Benkyou shimasu':",
        options: ["Benkyou suru", "Benkyou kuru", "Benkyou shite"],
        answer: "Benkyou suru",
        explanation: "Shimasu bentuk kamusnya suru."
      }
    ],
    cultureNote: "Di dunia kerja Jepang, lisensi kemahiran (shikaku) sangat krusial. Cantumkan sertifikasi JLPT / SSW Anda di bagian curriculum vitae resume.",
    reviewSummary: [
      "Mengonversi verba ke bentuk kamus (Jisho-form).",
      "Mengekspresikan total kapasitas kecakapan murni 'koto ga dekimasu'."
    ]
  },
  {
    id: 19,
    classLevel: "Kelas 8 (Komunikasi Aktif)",
    title: "Bab 19: Pengalaman Berharga di Jepang",
    theme: "Membicarakan Rekreasi Mendaki Gunung Fuji",
    estimatedMinutes: 45,
    objectives: [
      "Menguasai pembentukan Kata Kerja bentuk Lampau Kasual (Ta-form)",
      "Menyatakan pernah merasakan pengalaman tertentu (〜た ことが あります - ta koto ga arimasu)",
      "Menggabungkan kegiatan acak sejajar (〜たり、〜たり します - tari, tari shimasu)"
    ],
    vocabulary: [
      { jp: "のぼります", rom: "Noborimasu", translation: "Mendaki", type: "Kata Kerja I", desc: "Menaiki tanjakan bukit gunung." },
      { jp: "とまります", rom: "Tomarimasu", translation: "Menginap", type: "Kata Kerja I", desc: "Kemalaman bermalam di hotel/ryokan." },
      { jp: "そうじします", rom: "Soujishimasu", translation: "Bersih-bersih", type: "Kata Kerja III", desc: "Mengelap debu merawat higienitas." },
      { jp: "せんたくします", rom: "Sentakushimasu", translation: "Mencuci pakaian", type: "Kata Kerja III", desc: "Membersihkan busana kotor." },
      { jp: "おんせん", rom: "Onsen", translation: "Pemandian Air Panas", type: "Kata Benda", desc: "Therapi rendam belerang panas relaksasi." }
    ],
    grammarPoints: [
      {
        title: "Pola: Klasifikasi Kata Kerja Bentuk Ta (Masa Lampau Kasual)",
        explanation: "Skema pembentukannya 100% presisi meniru aturan bentuk-te harian, tinggal menyulap akhiran vokal 'te' menjadi 'ta', dan bunyi sengau 'de' menjadi 'da' (Tabete -> Tabeta, Nonde -> Nonda).",
        exJp: "わたしは富士山に登ったことがあります。",
        exRom: "Watashi wa Fujisan ni nobotta koto ga arimasu.",
        exId: "Saya pernah merasakan pengalaman mendaki Gunung Fuji.",
        commonMistakeJp: "わたしは 日本へ 行きました ことがあります。",
        commonMistakeId: "Mencampur bentuk lampau sopan '~mashita' sebelum koto ga arimasu. Aturan sakral mewajibkan bentuk kasual lampau (-ta koto ga arimasu)."
      },
      {
        title: "Pola: KK1 たり, KK2 たり します (Melakukan kegiatan bernuansa variatif)",
        explanation: "Mengutarakan rangkaian beberapa tindakan demonstratif representatif secara acak sebanding dari kumpulan alternatif tindakan.",
        exJp: "日曜日は部屋を掃除したり、洗濯したりします。",
        exRom: "Nichiyoubi wa heya o souji shitari, sentaku shitari shimasu.",
        exId: "Hari Minggu saya menyapu bersih kamar, mencuci pakaian jeans, dan aktivitas sejenis lainnya.",
        commonMistakeJp: "掃除するたり、洗濯するたりします。",
        commonMistakeId: "Memakai bentuk kamus suru sebelum tari, mutlak wajib memakai bentuk lampau kasual -ta (shitari)."
      }
    ],
    sentencePatterns: [
      { pattern: "日本の温泉に入ったことがありますか。", meaning: "Apakah Anda pernah berendam di pemandian air panas alami Jepang?" },
      { pattern: "昨日はテレビを見たり、本を読んだりしました。", meaning: "Kemarin saya menonton siaran visual TV, membaca lembar buku, dan lain-lain." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Ubah 'mimasu' (melihat) menjadi 'pernah melihat':",
        options: ["見たことがあります", "見ましたことがあります", "見るのがあります"],
        correct: "見たことがあります",
        explanation: "Mimasu (Gol II) -> Mite -> Mita koto ga arimasu."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Nichiyoubi wa kaimono shi__ terebi o mi__ shimasu.",
        options: ["たり、たり (tari, tari)", "て、て (te, te)", "と、と (to, to)"],
        correct: "たり、たり (tari, tari)",
        explanation: "Aksi perbuatan acak sejajar dipadukan dengan rumpang '~tari ~tari shimasu'."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Bentuk lampau kasual dari 'Ikimasu' (Pergi):",
        options: ["Itta", "Iite", "Ikita"],
        correct: "Itta",
        explanation: "Pengecualian khusus: bentuk te dari ikimasu adalah itte, maka bentuk tanya/lampau kasualnya itta."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "歌舞伎を見たことがありますか。", textRom: "Kabuki o mita koto ga arimasu ka?", textId: "Apakah Anda pernah menyaksikan pertunjukan seni drama Kabuki?" },
      { speaker: "ルカ", textJp: "いいえ、一度もありません。見たいですね。", textRom: "Iie, ichido mo arimasen. Mitai desu ne.", textId: "Sama sekali belumlah pernah. Ingin sekali menontonnya ya." }
    ],
    quiz: [
      {
        question: "Ubah kata 'tabemasu' ke frasa 'pernah mencicipi makan':",
        options: ["tabeta koto ga arimasu", "tabemashita koto ga arimasu", "tabenai koto desu"],
        answer: "tabeta koto ga arimasu",
        explanation: "Tabemasu berubah ke bentuk -ta adalah tabeta."
      }
    ],
    cultureNote: "Onsen melarang keras orang bertato masuk demi menjaga stabilitas ketenangan bath sosial. Bilas tubuh total sebersih mungkin sebelum berendam.",
    reviewSummary: [
      "Menguasai konjugasi tenses kasual lampau 'Ta-form'.",
      "Meringkas petualangan pengalaman 'ta koto ga arimasu' dan variatif '~tari, ~tari shimasu'."
    ]
  },
  {
    id: 20,
    classLevel: "Kelas 8 (Komunikasi Aktif)",
    title: "Bab 20: Percakapan Akrab Teman Mess",
    theme: "Obrolan Santai Sepulang Kerja",
    estimatedMinutes: 45,
    objectives: [
      "Memahami perbedaan ragam bahasa sopan (Keigo/Teineigo) dan kamus akrab (Futsuugo)",
      "Melakukan obrolan harian kasual tanpa kikuk kaku"
    ],
    vocabulary: [
      { jp: "いう", rom: "Iu", translation: "Mengucap / Berkata", type: "Kata Kerja I", desc: "Suara menyalurkan bunyi pemikiran." },
      { jp: "おもう", rom: "Omou", translation: "Berpendapat / Berpikir", type: "Kata Kerja I", desc: "Persepsi asumsi kognitif di otak." },
      { jp: "きく", rom: "Kiku", translation: "Mendengar / Menanyakan", type: "Kata Kerja I", desc: "Menyimak gelombang getar suara." },
      { jp: "かつ", rom: "Katsu", translation: "Menang", type: "Kata Kerja I", desc: "Memperoleh kejuaraan tanding." },
      { jp: "まける", rom: "Makeru", translation: "Kalah (tanding)", type: "Kata Kerja II", desc: "Menerima kekosongan poin tanding." }
    ],
    grammarPoints: [
      {
        title: "Pola: Teoretis Ragam Bahasa Biasa / Akrab (Futsuugo)",
        explanation: "Ragam akrab kasual digunakan bersama teman akrab, anggota keluarga inti, atau bawahan. Semua kata kerja sopan (~masu) dilarang beredar, diganti dengan tenses kasualnya (Makan sopan: tabemasu -> Kasual: taberu. Penyangkalan sopan: tabemasen -> Kasual: tabenai).",
        exJp: "今週末、一緒に海行かない？",
        exRom: "Konshuumi, issho ni umi ikanai?",
        exId: "Akhir pekan esok lusa, mau ga pergi ke pantai bareng?",
        commonMistakeJp: "先生、今日 どこへ 行く？",
        commonMistakeId: "Sangat tidak sopan menyapa guru / pembimbing industri memakai ragam kasual murni."
      },
      {
        title: "Pola: Pergantian kata bantu copula biasa (da / datta)",
        explanation: "Kopula penegas desu diubah setara menjadi 'da', denda bentuk lampau desu deshita berubah menjadi 'datta'. Seringkali kata 'da' dilesapkan saat intonasi naik bertanya.",
        exJp: "今日は雨だし、とても寒いね。",
        exRom: "Kyou wa ame da shi, totemo samui ne.",
        exId: "Hari ini turun hujan deras sih, dingin banget ya.",
        commonMistakeJp: "あれ は わたしの 傘 ですか だ。",
        commonMistakeId: "Menumpuk kopula desu dan da sekaligus di ekor kalimat pengiring."
      }
    ],
    sentencePatterns: [
      { pattern: "明日、会社へ来る？", meaning: "Besok kamu mau datang ke perusahaan gak?" },
      { pattern: "ううん、明日は行かない。", meaning: "Ngga, besok saya ngga pergi." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Apakah besok senggang (kasual)?",
        options: ["明日、暇？", "明日、暇ですか？", "明日、暇だでした？"],
        correct: "明日、暇？",
        explanation: "Dalam ragam kasual, tanda tanya desu ka dibuang, intonasi akhir kalimat dinaikkan."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Nomimasen diubah ke kasual akrab:",
        options: ["Nomanai", "Nomu", "Nonda"],
        correct: "Nomanai",
        explanation: "Nomimasen adalah negatif masa saat ini, kasualnya adalah nomanai."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Kepada siapa ragam kasual boleh dilayangkan?",
        options: ["Teman sebaya sederajat", "Pemberi kerja atasan", "Orang asing baru ditemui"],
        correct: "Teman sebaya sederajat",
        explanation: "Menjaga batas hormat sopan santun mutlak harian."
      }
    ],
    dialogue: [
      { speaker: "ケン", textJp: "ルカ、今日の晩ご飯何食べるの？", textRom: "Ruka, kyou no bangohan nani taberu no?", textId: "Ruka, makan malam hari ini kamu makan apa?" },
      { speaker: "ルカ", textJp: "カレーを作る予定。一緒に食べる？", textRom: "Karee o tsukuru yotei. Issho ni taberu?", textId: "Berencana masak kari india. Mau makan bareng?" }
    ],
    quiz: [
      {
        question: "Bentuk kasual dari kalimat 'Nihongo ga wakarimasu ka' yang ramah:",
        options: ["Nihongo ga wakaru?", "Nihongo ga wakarimasu?", "Nihongo ga wakaranai?"],
        answer: "Nihongo ga wakaru?",
        explanation: "Kata kerja masu diganti bentuk kamus (wakaru) disertai intonasi naik."
      }
    ],
    cultureNote: "Tingkatan strata tutur bicara melambangkan empati tim. Gunakan bahasa sopan (Keigo) di depan publik, simpan ragam biasa untuk kedekatan intim.",
    reviewSummary: [
      "Memilah kesadaran sela Ragam Sopan vs Ragam Akrab.",
      "Mengontrak pola ujaran kasual secara luwes harian."
    ]
  },
  {
    id: 21,
    classLevel: "Kelas 9 (Fase Mahir Kerja)",
    title: "Bab 21: Menyampaikan Pendapat & Dugaan Kerja",
    theme: "Mengutarakan Opini Solusi Mesin Bermasalah",
    estimatedMinutes: 50,
    objectives: [
      "Mengutarakan asumsi opini personal (〜と 思います - to omoimasu)",
      "Melaporkan kutipan ujaran kalimat orang lain (〜と 言いました - to iimashita)"
    ],
    vocabulary: [
      { jp: "おもいます", rom: "Omoimasu", translation: "Berpendapat / Berpikir", type: "Kata Kerja I", desc: "Pemikiran internal subjek." },
      { jp: "いいます", rom: "Iimasu", translation: "Mengatakan", type: "Kata Kerja I", desc: "Mengucap lisan vokal." },
      { jp: "やくそく", rom: "Yakusoku", translation: "Janji", type: "Kata Benda", desc: "Ikatan komitmen moral." },
      { jp: "いけん", rom: "Iken", translation: "Pendapat / Opini", type: "Kata Benda", desc: "Perspektif rasional seseorang." },
      { jp: "ただしい", rom: "Tadashii", translation: "Benar / Tepat", type: "Kata Sifat-i", desc: "Akurasi nilai kebenaran." }
    ],
    grammarPoints: [
      {
        title: "Pola: Kalimat Ragam-Biasa + と 思います (Saya rasa / Saya pikir)",
        explanation: "Pola santun menghindari kesan menghakimi sepihak. Klausa depan diwajibkan dikemas dalam ragam biasa / futsuugo diikuti partikel と (to) baru kata omoimasu.",
        exJp: "明日は雨が降ると思います。",
        exRom: "Ashita wa ame ga furu to omoimasu.",
        exId: "Saya rasa esok lusa akan turun hujan lebat.",
        commonMistakeJp: "日本は 綺麗です と思います。",
        commonMistakeId: "Lupa melesapkan desu saat bertemu kata sifat-na kirei. Seharusnya 'Kirei da to omoimasu'."
      },
      {
        title: "Pola: Kalimat Kutipan + と 言いました (Bahwa dia berkata...)",
        explanation: "Digunakan melapor kutipan murni pembicaraan pihak ketiga secara akurat kepada mandor atau pengawas pabrik.",
        exJp: "田中さんは明日休むと言いました。",
        exRom: "Tanaka-san wa ashita yasumu to iimashita.",
        exId: "Tuan Tanaka mengabarkan bahwa besok dia akan absen libur.",
        commonMistakeJp: "山田さんは 私は行きますと言いました。",
        commonMistakeId: "Kurang pas merangkai ragam kutipan tidak langsung tak sengaja bercampur status saya."
      }
    ],
    sentencePatterns: [
      { pattern: "この機械は使いやすいと思います。", meaning: "Saya rasa mesin perakitan ini sangat gampang dipakai." },
      { pattern: "社長は会議が始まると言いました。", meaning: "Direktur utama mengabarkan bahwa rapat operasional segera dibuka." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Menurut saya harga barang impor mahal:",
        options: ["物価が高いと思います", "物価は高いですと思います", "物価が低いと思います"],
        correct: "物価が高いと思います",
        explanation: "Takai (kata sifat-i) langsung bergabung ke penyambung opini 'to omoimasu'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Santosu-san wa kyou isogashii __ iimashita.",
        options: ["と (to)", "を (wo)", "が (ga)"],
        correct: "と (to)",
        explanation: "Partikel 'to' bertindak selaku penanda muatan isi kata kutipan."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Penyangkalan opini dari 'Berpikir mudah' (kantan desu):",
        options: ["簡単じゃないと思います", "簡単じゃありませんと思います", "簡単くないと思います"],
        correct: "簡単じゃないと思います",
        explanation: "Kantan (kata sifat-na), disangkal kasual menjadi 'kantan janai' sebelum to omoimasu."
      }
    ],
    dialogue: [
      { speaker: "指導役", textJp: "この新しい作業手順はどう思う？", textRom: "Kono atarashii sagyou tejun wa dou omou?", textId: "Bagaimana opinimu tentang prosedur kerja baru ini?" },
      { speaker: "ルカ", textJp: "前の手順より安全で早いと思います。", textRom: "Mae no tejun yori anzen de hayai to omoimasu.", textId: "Saya rasa lebih aman dan lebih cepat berkali-kali dibanding prosedur yang terdahulu." }
    ],
    quiz: [
      {
        question: "Partikel apa yang wajib berada di belakang klausa sebelum kata 'iimashita'?",
        options: ["To", "Ga", "De"],
        answer: "To",
        explanation: "Kutipan isi perkataan diakhiri partikel pembungkus 'to'."
      }
    ],
    cultureNote: "Saat mengutarakan argumen evaluasi kerja di rapat (kaigi) Jepang, lampirkan data pendukung riil tanpa memicu gosip subyektif harian.",
    reviewSummary: [
      "Mengekspresikan asumsi bijak 'to omoimasu'.",
      "Kelihaian meneruskan instruksi orang lain lewat 'to iimashita'."
    ]
  },
  {
    id: 22,
    classLevel: "Kelas 9 (Fase Mahir Kerja)",
    title: "Bab 22: Menerangkan Kondisi Mesin & Barang",
    theme: "Pengecekan Kualitas Akhir Produk (QC)",
    estimatedMinutes: 45,
    objectives: [
      "Menguasai teknik pemakaian Anak Kalimat pengubah makna Kata Benda",
      "Membuat detail kompleksitas penjelasan fungsional barang"
    ],
    vocabulary: [
      { jp: "ふく", rom: "Fuku", translation: "Baju / Busana", type: "Kata Benda", desc: "Pakaian penutup raga." },
      { jp: "こうじょう", rom: "Koujou", translation: "Pabrik", type: "Kata Benda", desc: "Tempat pemrosesan produk." },
      { jp: "つくった", rom: "Tsukutta", translation: "Telah membuat (kasual)", type: "Kata Kerja I", desc: "Hasil manipulasi barang jadi." },
      { jp: "すむ", rom: "Sumu", translation: "Tinggal (kasual)", type: "Kata Kerja I", desc: "Asimilasi alamat tinggal." },
      { jp: "おいしい", rom: "Oishii", translation: "Lezat / Enak", type: "Kata Sifat-i", desc: "Rasa hidangan memuaskan." }
    ],
    grammarPoints: [
      {
        title: "Pola: Anak Kalimat Menerangkan Kata Benda langsung",
        explanation: "Teknik menyusun detail keterangan benda. Letakkan klausa penjelas berwujud Ragam Biasa (Futsuugo) persis mendahului Kata Benda sasaran tanpa partikel penyela.",
        exJp: "これは私が昨日作った製品です。",
        exRom: "Kore wa watashi ga kinou tsukutta seihin desu.",
        exId: "Ini adalah barang produk akhir yang kemarin telah saya buat.",
        commonMistakeJp: "これは わたしは昨日作りましたの製品です。",
        commonMistakeId: "Memakai partikel 'no' atau bentuk teineigo 'masu' sebelum kata benda sasaran modifikasi."
      },
      {
        title: "Pola: Menjadikan anak kalimat sebagai penanda subjek kalimat",
        explanation: "Menempatkan struktur rumusan yang menerangkan sebagai topik penanda subjek kalimat yang lebih luas jangkauannya.",
        exJp: "彼女が住んでいる家はとても静かです。",
        exRom: "Kanojo ga sunde iru ie wa totemo shizuka desu.",
        exId: "Rumah kediaman yang dia tempati saat ini sangatlah sepi hening.",
        commonMistakeJp: "住むの家 は",
        commonMistakeId: "Menggunakan kata penyambung milik 'no ie' untuk kata kerja."
      }
    ],
    sentencePatterns: [
      { pattern: "私が働く工場は静岡にあります。", meaning: "Pabrik tempat saya bekerja berada di Shizuoka." },
      { pattern: "これは先週買ったばかりの安全靴です。", meaning: "Ini adalah sepatu pengaman kaki yang baru saja dibeli minggu lalu." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Orang yang sedang berdiri di sana adalah atasan saya:",
        options: ["あそこに立っている人は先輩です", "あそこに立ちます人は先輩です", "あそこに立ったばかりの人は先輩です"],
        correct: "あそこに立っている人は先輩です",
        explanation: "'Sunde iru' / 'tatte iru' bentuk progresif mendahului kata benda 'hito'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Watashi ga hataraku __ wa kirei desu.",
        options: ["工場 (koujou)", "に (ni)", "を (wo)"],
        correct: "工場 (koujou)",
        explanation: "Kata kerja bentuk kamus 'hataraku' langsung mengikat / menerangkan kata benda berikutnya."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Arti dari 'Tsukutta seihin' jika dialihkan makna:",
        options: ["Produk hasil buatan", "Mesin pembuat", "Mencoba membuat"],
        correct: "Produk hasil buatan",
        explanation: "Tsukutta (telah dibuat) + seihin (produk)."
      }
    ],
    dialogue: [
      { speaker: "山田", textJp: "ルカさんがかぶっているヘルメットは新しいですね。", textRom: "Ruka-san ga kabutte iru herumetto wa atarashii desu ne.", textId: "Helm pelindung kepala yang sedang Ruka pakai terlihat baru ya." },
      { speaker: "ルカ", textJp: "はい、昨日熊本の工場長からもらったものです。", textRom: "Hai, kinou Kumamoto no koujouchou kara moratta mono desu.", textId: "Ya, ini adalah barang pemberian Kepala Pabrik Kumamoto kemarin." }
    ],
    quiz: [
      {
        question: "Ubah frase 'membeli buku catatan' menjadi 'catatan yang saya beli kemarin':",
        options: ["kinou watashi ga katta nooto", "kinou watashi ga kaimasu nooto", "kinou watashi ga kau nooto"],
        answer: "kinou watashi ga katta nooto",
        explanation: "Memakai bentuk lampau kasual ('katta') mendahului benda 'nooto'."
      }
    ],
    cultureNote: "Kualitas detail produk yang presisi tanpa cacat (Zero Defect) melambangkan dedikasi industri 'Monozukuri' (pembuatan barang sepenuh jiwa) di Jepang.",
    reviewSummary: [
      "Memperkaya detil subjek dengan modifikasi frase klausa.",
      "Mengekalkan struktur pendukung di depan kata benda."
    ]
  },
  {
    id: 23,
    classLevel: "Kelas 10 (Sertifikasi N4 / Lancar)",
    title: "Bab 23: Masa Depan & Menggunakan Alat Mekanik",
    theme: "Navigasi Ketika Terjadi Gempa Bumi di Jepang",
    estimatedMinutes: 50,
    objectives: [
      "Menyatakan kronologis momentum waktu (〜とき - toki, bila/saat)",
      "Menyatakan jaminan hukum sebab alami mutlak (〜と - to, jika menekan...)"
    ],
    vocabulary: [
      { jp: "とき", rom: "Toki", translation: "Bila / Saat", type: "Kata Benda", desc: "Momentum penanda kala waktu." },
      { jp: "おすと", rom: "Osu to", translation: "Jika ditekan", type: "Kata Kerja", desc: "Aksi sela pemicu mesin." },
      { jp: "うごきます", rom: "Ugokimasu", translation: "Bergerak / Jalan", type: "Kata Kerja I", desc: "Mesin mulai berputar sirkulasi." },
      { jp: "ひく", rom: "Hiku", translation: "Menarik", type: "Kata Kerja I", desc: "Gerakan menarik tuas." },
      { jp: "じしん", rom: "Jishin", translation: "Gempa Bumi", type: "Kata Benda", desc: "Bencana alam tektonik bergetar." }
    ],
    grammarPoints: [
      {
        title: "Pola: Ragam Biasa + とき (Ketika / Saat merasa...)",
        explanation: "Menyebutkan konstelasi situasi waktu tertentu. Kata kerja disesuaikan ke bentuk kasual kamus/lampau sebelum ditempeli toki.",
        exJp: "地震のとき、エレベーターを使ってはいけません。",
        exRom: "Jishin no toki, erebeetar o tsukatte wa ikemasen.",
        exId: "Ketika momentum bencana gempa bumi, dilarang keras memakai lift elevator.",
        commonMistakeJp: "暇な のとき、電話します。",
        commonMistakeId: "Kata sifat-na 'hima' harus disambung menjadi 'hima na toki', dilarang menyelipkan kata 'no'."
      },
      {
        title: "Pola: KK Bentuk-Kamus + と (Bila dilakukan, otomatis terjadi...)",
        explanation: "Pola penunjuk kausalitas hukum mutlak fisik alam atau sirkuit tombol. Bila meluncurkan perbuatan A, seketika dampak hasil B absolut langsung menyala sela.",
        exJp: "この赤ボタンを押すと、機械が緊急停止します。",
        exRom: "Kono aka botan o osu to, kikai ga kinkyuu teishi shimasu.",
        exId: "Bila Anda menekan tombol merah murni ini, seketika unit mesin berhenti darurat.",
        commonMistakeJp: "お薬を飲みまして と 体が良い。",
        commonMistakeId: "Menggabungkan akhiran sopan '~masu' sebelum partikel logis 'to'."
      }
    ],
    sentencePatterns: [
      { pattern: "道が分からないとき、スマホの地図を見ます。", meaning: "Ketika tidak mengetahui jalan arah pulang, saya melihat navigasi peta ponsel pintar." },
      { pattern: "つまみを右に回すと、音が大きくなります。", meaning: "Bila memutar kenop kancing ke kanan, volume suara otomatis membesar." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Bila memutar tuas ini ke kiri, air keluar:",
        options: ["このレバーを左に引くと、水が出ます", "このレバーを左に引きと、水が出ます", "このレバーを左に引かないと、水がほしい"],
        correct: "このレバーを左に引くと、水が出ます",
        explanation: "Formulasi kamus 'hiku' + 'to' + hasil mutlak 'mizu ga demasu'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Kodomo no __, yoku asobimashita.",
        options: ["とき (toki)", "と (to)", "のとき (notoki)"],
        correct: "とき (toki)",
        explanation: "Kata benda anak-anak (kodomo) menyanyikan gabungan 'kodomo no' + 'toki'."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti dari 'Jishin'?",
        options: ["Gempa Bumi", "Kereta Api", "Gaji Pokok"],
        correct: "Gempa Bumi",
        explanation: "Jishin merupakan fenomena gempa tektonik bumi."
      }
    ],
    dialogue: [
      { speaker: "防災員", textJp: "地震が起きたとき、どうしますか。", textRom: "Jishin ga okita toki, dou shimasu ka?", textId: "Ketika getaran gempa bumi terjadi, apa yang harus Anda upayakan?" },
      { speaker: "ルカ", textJp: "まず冷静になり、机の下に入って頭を守ります。", textRom: "Mazu reisei ni nari, tsukue no shita ni haitte atama o mamorimasu.", textId: "Mula-mula bersikap tenang kepala dingin, menyelinap masuk ke bawah kolong meja mengamankan kepala." }
    ],
    quiz: [
      {
        question: "Bila ingin menyatakan kalimat 'Bila menyeberang jembatan ini, ada stasiun di sebelah kiri':",
        options: ["Kono hashi o wataru to, hidari ni eki ga arimasu", "Kono hashi o watarimasu to, eki ga imasu", "Kono hashi o watari to, eki desu"],
        answer: "Kono hashi o wataru to, hidari ni eki ga arimasu",
        explanation: "Kamus wataru (menyebrang) + to + ekosistem keberadaan stasiun."
      }
    ],
    cultureNote: "Setiap pekan apartemen pabrik wajib meluangkan waktu kawat darurat mitigasi bencana (Bosai Kunren). Pahami tangga keluar darurat keselamatan (Hinjokuchi).",
    reviewSummary: [
      "Meringkas momentum waktu spesifik via 'toki'.",
      "Mengintegrasikan kepasitas reaksi mesin mekanis mutlak menggunakan partikel 'to'."
    ]
  },
  {
    id: 24,
    classLevel: "Kelas 10 (Sertifikasi N4 / Lancar)",
    title: "Bab 24: Saling Membantu Rekan Kerja",
    theme: "Budaya Kerja Saling Menopang di Pabrik",
    estimatedMinutes: 45,
    objectives: [
      "Menguasai silsilah memberi pertolongan jasa (〜て あげます - te agemasu)",
      "Menguasai silsilah menerima perlakuan baik (〜て もらいます - te moraimasu)",
      "Menggunakan kerendahan hati aksi budi (〜て くれます - te kuremasu)"
    ],
    vocabulary: [
      { jp: "おごります", rom: "Ogorimasu", translation: "Mentraktir makan", type: "Kata Kerja I", desc: "Membayari makan minum rekan kerja." },
      { jp: "つれていきます", rom: "Tsurete ikimasu", translation: "Mengajak pergi (orang)", type: "Kata Kerja I", desc: "Membimbing orang jalan." },
      { jp: "おくります", rom: "Okurimasu", translation: "Mengantar (jemput)", type: "Kata Kerja I", desc: "Mengantarkan orang sampai asrama." },
      { jp: "しょうかいします", rom: "Shoukaishimasu", translation: "Memperkenalkan", type: "Kata Kerja III", desc: "Mengenalkan rekan sejawat." },
      { jp: "じゅんびします", rom: "Junbishimasu", translation: "Mempersiapkan", type: "Kata Kerja III", desc: "Menyiapkan alat kargo." }
    ],
    grammarPoints: [
      {
        title: "Pola: KK Bentuk-te + あげる / もらう / くれる (Donasi Berbalas Jasa Budi)",
        explanation: "Sistem tata laku budi pekerja sosial. 'Te agemasu' memberi pertolongan jasa ke luar. 'Te moraimasu' memohon/menerima tindak pertolongan dari pihak luar. 'Te kuremasu' orang luar secara spontan sudi membantu kita tanpa pamrih.",
        exJp: "わたしは山田さんに日本語を教えてもらいました。",
        exRom: "Watashi wa Yamada-san ni Nihongo o oshiete moraimashita.",
        exId: "Saya telah menerima perlakuan baik diajarkan Bahasa Jepang oleh Tuan Yamada.",
        commonMistakeJp: "社長は 私に 荷物を 持ってあげました。",
        commonMistakeId: "Aksi 'te agemasu' ketiadaan status sopan jika subjek pemberi pelindung adalah atasan mapan. Seharusnya memakai kuremashta."
      },
      {
        title: "Pola: Perbedaan tegas 'motte ikimasu' dan 'tsurete ikimasu'",
        explanation: "Motte ikimasu hanya didedikasikan untuk komoditas barang mati, sedangkan tsurete ikimasu didedikasikan membimbing mahluk hidup/orang harian.",
        exJp: "病気のとき、先輩が病院へ連れていってくれました。",
        exRom: "Byouki no toki, senpai ga byouin e tsurete itte kuremashita.",
        exId: "Ketika saya jatuh sakit, senior dengan tulus mengantarkan saya berangkat ke rumah sakit.",
        commonMistakeJp: "友達を 荷物に 持っていきます。",
        commonMistakeId: "Tertukar menempatkan target subjek manusia dengan barang."
      }
    ],
    sentencePatterns: [
      { pattern: "私は友達の引っ越しを手伝ってあげました。", meaning: "Saya telah membantu memindahkan barang kepindahan apartemen teman saya." },
      { pattern: "母がいつも仕送りを送ってくれます。", meaning: "Ibu saya di kampung halaman selamanya rutin mengirimkan uang saku untuk saya." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Mandor (Fukumandor) telah mentraktir saya sushi kargo:",
        options: ["班長が私に寿司をおごってくれました", "班長に寿司をおごってあげました", "班長が私から寿司をおごってくれた"],
        correct: "班長が私に寿司をおごってくれました",
        explanation: "Pemberian spontan dari figur atasan/rekan kepada saya ditata dengan pola '~te kuremashita'."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Watashi wa tomodachi no shorui o na__ shimashita.",
        options: ["してあげ (shiteage)", "してもら (shitemora)", "してくれ (shitekure)"],
        correct: "してあげ (shiteage)",
        explanation: "Melakukan pertolongan aktif melayani keperluan dokumen kawan (shite agemashita)."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti dari 'Tsurete ikimasu'?",
        options: ["Mengajak pergi (orang)", "Membawa pergi (benda)", "Mengembalikan barang"],
        correct: "Mengajak pergi (orang)",
        explanation: "Merujuk aksi fisik membimbing orang."
      }
    ],
    dialogue: [
      { speaker: "サリ", textJp: "ルカさん、そのカバンは重そうですね。手伝ってあげましょうか。", textRom: "Ruka-san, sono kaban wa omosou desu ne. Tetsudatte agemashou ka?", textId: "Ruka, tas itu kelihatannya berat sekali ya. Maukah saya bantu membawakannya?" },
      { speaker: "ルカ", textJp: "ありがとうございます！急いでいますから、本当に助かります。", textRom: "Arigatou gozaimasu! Isoide imasu kara, hontou ni tasukarimasu.", textId: "Terima kasih banyak! Karena saya sedang terburu-buru, ini benar-benar sangat menolong saya." }
    ],
    quiz: [
      {
        question: "Ubah frasa 'oshiemasu' (mengajar) menjadi 'Telah diajarkan oleh guru':",
        options: ["sensei ni oshiete moraimashita", "sensei ni oshiete agemashita", "sensei ni oshiete kudasai"],
        answer: "sensei ni oshiete moraimashita",
        explanation: "Menerima jasa pengajaran guru: 'oshiete moraimashita'."
      }
    ],
    cultureNote: "Budaya saling tolong-menolong tanpa hitung-perhitungan untung rugi (Omoやり - Omoyari) adalah perekat harmoni kerja tim di tim Jepang.",
    reviewSummary: [
      "Menguasai alur transkripsi jasa Te-Agemasu, Te-Moraimasu, dan Te-Kuremasu.",
      "Mengembangkan kepedulian sosial sosial sesama teman setim pabrik."
    ]
  },
  {
    id: 25,
    classLevel: "Kelas 10 (Sertifikasi N4 / Lancar)",
    title: "Bab 25: Menghadapi Hasil & Masa Depan",
    theme: "Mempersiapkan Kelulusan Ujian Tokutei Ginou SSW",
    estimatedMinutes: 55,
    objectives: [
      "Menguasai kalimat pengkondisian bersyarat waktu (〜たら - tara, bila...)",
      "Menguasai ekspresi konsesi kompromi (〜ても - te mo, kendati/walaupun...)"
    ],
    vocabulary: [
      { jp: "おわったら", rom: "Owattara", translation: "Jika selesai", type: "Kondisional", desc: "Pengkondisian batas mulainya perbuatan." },
      { jp: "やすかったら", rom: "Yasukattara", translation: "Jika murah (kasual)", type: "Kondisional", desc: "Pertimbangan nominal ekonomis." },
      { jp: "がんばります", rom: "Ganbarimasu", translation: "Berusaha pantang menyerah", type: "Kata Kerja I", desc: "Sikap tekad tekun memenangkan target." },
      { jp: "こうこうけん", rom: "Koukouken", translation: "Tiket pesawat", type: "Kata Benda", desc: "Surat izin menumpang maskapai." },
      { jp: "こうじょうちょう", rom: "Koujouchou", translation: "Kepala Pabrik", type: "Kata Benda", desc: "Pimpinan eksekutif otoritas sirkuit pabrik." }
    ],
    grammarPoints: [
      {
        title: "Pola: KK Kalimat Bentuk-ta + ら (Bila / Seandainya terjadi...)",
        explanation: "Pola pengkondisian bersyarat umum. Cukup ubah kata kerja depan menjadi bentuk kasual lampau (-ta) lalu pasangkan suffix 'ra' (Tabeta -> Tabetara, Owatta -> Owattara).",
        exJp: "お給料が入ったら,、お母さんに仕送りをします。",
        exRom: "Okyuuryou ga haittara, okaasan ni shiokuri o shimasu.",
        exId: "Bila uang gaji bulanan sudah masuk rekening, saya akan mengirimkan uang saku untuk ibu.",
        commonMistakeJp: "雨が降りますたら、行かない。",
        commonMistakeId: "Menggabungkan imbuhan formal '~masu' dengan tara. Wajib diganti 'futtara'."
      },
      {
        title: "Pola: KK Bentuk-te + も (Walaupun / Kendati dilakukan...)",
        explanation: "Pola kompromis kontradiktif. Menyatakan biarpun premis A diinisiasi sepenuh hati, rintangan atau output B tetap takkan bergeser berubah harian.",
        exJp: "辞書を使っても、この高度な漢字が読めません。",
        exRom: "Jisho o tsukatte mo, kono koudo na kanji ga yomemasen.",
        exId: "Kendati sudah menggunakan kamus bahasa, saya tetap tidak bisa membaca kanji tingkat tinggi murni ini.",
        commonMistakeJp: "安いです も、買いません。 (dengan salah penyambung)",
        commonMistakeId: "Kata sifat-i 'yasui' diubah ke bentuk-te menjadi 'yasukute' baru ditempeli 'mo' (yasukute mo)."
      }
    ],
    sentencePatterns: [
      { pattern: "１０時になったら、すぐ出発しましょう。", meaning: "Bila waktu sudah menyentuh jam 10, mari seketika kita bergegas berangkat." },
      { pattern: "いくら考えても、このマニュアルが分かりません。", meaning: "Berapa kalipun dipikirkan berulang-ulang, saya tetap tidak paham manual kerja ini." }
    ],
    exercises: [
      {
        type: "A",
        title: "Latihan A",
        sentence: "Jika besok cuacanya bagus, mari mendaki:",
        options: ["明日天気がよかったら、登りましょう", "明日天気がよければ、登ります", "明日天気がいいなら、登りたい"],
        correct: "明日天気がよかったら、登りましょう",
        explanation: "ii -> yoi -> yokatta -> yokattara (kondisi bersyarat)."
      },
      {
        type: "B",
        title: "Latihan B",
        sentence: "Nihon ni i__ mo, mainichi benkyou shimasu.",
        options: ["っても (tte mo)", "ると (ru to)", "たら (tara)"],
        correct: "っても (tte mo)",
        explanation: "Meskipun pergi ke Jepang (Ittemo), tetap belajar setiap hari."
      },
      {
        type: "C",
        title: "Latihan C",
        sentence: "Apakah arti dari 'Ganbarimasu'?",
        options: ["Berusaha pantang menyerah", "Merasa khawatir", "Ingin menyerah"],
        correct: "Berusaha pantang menyerah",
        explanation: "Kredo legendaris mental baja pekerja Jepang."
      }
    ],
    dialogue: [
      { speaker: "社長", textJp: "ルカさん、３年間の研修が終わったらどうしますか。", textRom: "Ruka-san, san-nenkan no kenshuu ga owattara dou shimasu ka?", textId: "Ruka, seandainya pelatihan 3 tahun ini selesai, apa rencana hidup Anda selanjutnya?" },
      { speaker: "ルカ", textJp: "インドネシアへ帰って,日本学校を作って先生をします！", textRom: "Indonesia e kaette, Nihongo gakkou o tsukutte sensei o shimasu!", textId: "Saya akan pulang ke Indonesia, merintis sekolah bahasa Jepang, dan mengabdi menjadi seorang guru!" }
    ],
    quiz: [
      {
        question: "Ubah kata 'yasui' (murah) menjadi 'kalau murah':",
        options: ["yasukattara", "yasuitara", "yasutara"],
        answer: "yasukattara",
        explanation: "Yasui -> yasukatta -> yasukattara."
      }
    ],
    cultureNote: "Kelulusan sertifikasi SSW mengantarkan Anda memasuki gerbang kemakmuran karir seumur hidup. Selamat berkarya mencerdaskan silsilah bangsa!",
    reviewSummary: [
      "Fasih merangkai implikasi kausalitas bersyarat '〜tara'.",
      "Kosep tangguh pantang mundur melintasi oposisi kontradiktif '〜te mo'."
    ]
  }
];
