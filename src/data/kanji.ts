export interface KanjiEntry {
  kanji: string;
  level: 'N5' | 'N4';
  onyomi: string;
  kunyomi: string;
  meaning: string;
  strokes: number;
  strokeSteps: string[];
  examples: {
    word: string;
    kana: string;
    meaning: string;
  }[];
}

export const KANJI_DATA: KanjiEntry[] = [
  // --- JLPT N5 KANJI ---
  {
    kanji: "一",
    level: "N5",
    onyomi: "イチ (ichi), イツ (itsu)",
    kunyomi: "ひと-つ (hito-tsu)",
    meaning: "Satu",
    strokes: 1,
    strokeSteps: ["Garis mendatar dari kiri ke kanan."],
    examples: [
      { word: "一つ", kana: "ひとつ (hitotsu)", meaning: "Satu buah" },
      { word: "一日", kana: "ついたち (tsuitachi)", meaning: "Tanggal satu" },
      { word: "一人", kana: "ひとり (hitori)", meaning: "Satu orang" },
      { word: "一年", kana: "いちねん (ichinen)", meaning: "Satu tahun" }
    ]
  },
  {
    kanji: "二",
    level: "N5",
    onyomi: "ニ (ni), ジ (ji)",
    kunyomi: "ふた-つ (futa-tsu)",
    meaning: "Dua",
    strokes: 2,
    strokeSteps: ["Garis mendatar pendek di atas", "Garis mendatar lebih panjang di bawah"],
    examples: [
      { word: "二つ", kana: "ふたつ (futatsu)", meaning: "Dua buah" },
      { word: "二日", kana: "ふつか (futsuka)", meaning: "Tanggal dua, dua hari" },
      { word: "二人", kana: "ふたり (futari)", meaning: "Dua orang" },
      { word: "二月", kana: "にがつ (nigatsu)", meaning: "Februari" }
    ]
  },
  {
    kanji: "三",
    level: "N5",
    onyomi: "サン (san)",
    kunyomi: "みっ-つ (mit-tsu)",
    meaning: "Tiga",
    strokes: 3,
    strokeSteps: ["Garis mendatar sedang di atas", "Garis mendatar pendek di tengah", "Garis mendatar panjang di bawah"],
    examples: [
      { word: "三つ", kana: "みっつ (mittsu)", meaning: "Tiga buah" },
      { word: "三日", kana: "みっか (mikka)", meaning: "Tanggal tiga, tiga hari" },
      { word: "三人", kana: "さんにん (sannin)", meaning: "Tiga orang" },
      { word: "三角", kana: "さんかく (sankaku)", meaning: "Segitiga" }
    ]
  },
  {
    kanji: "日",
    level: "N5",
    onyomi: "ニチ (nichi), ジツ (jitsu)",
    kunyomi: "ひ (hi), -び (-bi), か (ka)",
    meaning: "Matahari / Hari",
    strokes: 4,
    strokeSteps: ["Garis vertikal kiri", "Garis atas ke kanan lalu ditekuk ke bawah", "Garis horizontal tengah", "Garis horizontal penutup bawah"],
    examples: [
      { word: "日本", kana: "にほん (nihon)", meaning: "Jepang" },
      { word: "日曜日", kana: "にちようび (nichiyoubi)", meaning: "Hari Minggu" },
      { word: "毎日", kana: "まいにち (mainichi)", meaning: "Setiap hari" },
      { word: "今日", kana: "きょう (kyou)", meaning: "Hari ini" }
    ]
  },
  {
    kanji: "本",
    level: "N5",
    onyomi: "ホン (hon)",
    kunyomi: "もと (moto)",
    meaning: "Buku / Asal",
    strokes: 5,
    strokeSteps: ["Garis horizontal mendatar", "Garis vertikal lurus menembus", "Garis diagonal kiri bawah", "Garis diagonal kanan bawah", "Garis horizontal kecil di bagian bawah tiang lurus"],
    examples: [
      { word: "本", kana: "ほん (hon)", meaning: "Buku" },
      { word: "日本語", kana: "にほんご (nihongo)", meaning: "Bahasa Jepang" },
      { word: "山本", kana: "やまもと (yamamoto)", meaning: "Yamamoto (nama keluarga)" },
      { word: "本日", kana: "ほんじつ (honjitsu)", meaning: "Hari ini (formal)" }
    ]
  },
  {
    kanji: "人",
    level: "N5",
    onyomi: "ジン (jin), ニン (nin)",
    kunyomi: "ひと (hito)",
    meaning: "Orang",
    strokes: 2,
    strokeSteps: ["Garis melengkung ke kiri dari atas", "Garis diagonal ke kanan menyentuh kaki pertama"],
    examples: [
      { word: "人", kana: "ひと (hito)", meaning: "Orang" },
      { word: "日本人", kana: "にほんじん (nihonjin)", meaning: "Orang Jepang" },
      { word: "三人", kana: "さんにん (sannin)", meaning: "Tiga orang" },
      { word: "大人", kana: "おとな (otona)", meaning: "Orang dewasa" }
    ]
  },
  {
    kanji: "月",
    level: "N5",
    onyomi: "ゲツ (getsu), ガツ (gatsu)",
    kunyomi: "つき (tsuki)",
    meaning: "Bulan",
    strokes: 4,
    strokeSteps: ["Garis vertikal melengkung kiri", "Garis atas ke kanan lalu ditekuk ke bawah dengan kait di akhir", "Garis horizontal atas tengah", "Garis horizontal bawah tengah"],
    examples: [
      { word: "月", kana: "つき (tsuki)", meaning: "Bulan" },
      { word: "一月", kana: "いちがつ (ichigatsu)", meaning: "Januari" },
      { word: "今月", kana: "こんげつ (kongetsu)", meaning: "Bulan ini" },
      { word: "月曜日", kana: "げつようび (getsuyoubi)", meaning: "Hari Senin" }
    ]
  },
  {
    kanji: "火",
    level: "N5",
    onyomi: "カ (ka)",
    kunyomi: "ひ (hi), -び (-bi)",
    meaning: "Api",
    strokes: 4,
    strokeSteps: ["Percikan api kecil kiri", "Percikan api kecil kanan", "Garis vertikal melengkung kiri dari tengah", "Garis diagonal menyebar kanan"],
    examples: [
      { word: "火", kana: "ひ (hi)", meaning: "Api" },
      { word: "火曜日", kana: "かようび (kayoubi)", meaning: "Hari Selasa" },
      { word: "火山", kana: "かざん (kazan)", meaning: "Gunung berapi" },
      { word: "火事", kana: "かじ (kaji)", meaning: "Kebakaran" }
    ]
  },
  {
    kanji: "水",
    level: "N5",
    onyomi: "スイ (sui)",
    kunyomi: "みず (mizu)",
    meaning: "Air",
    strokes: 4,
    strokeSteps: ["Garis vertikal kait di bawah tengah", "Garis menyiku melengkung di kiri", "Garis diagonal pendek kanan atas", "Garis diagonal lurus kanan bawah"],
    examples: [
      { word: "水", kana: "みず (mizu)", meaning: "Air" },
      { word: "水曜日", kana: "すいようび (suiyoubi)", meaning: "Hari Rabu" },
      { word: "水道", kana: "すいどう (suidou)", meaning: "Saluran/keran air" },
      { word: "水泳", kana: "すいえい (suiei)", meaning: "Berenang" }
    ]
  },
  {
    kanji: "木",
    level: "N5",
    onyomi: "モク (moku), ボク (boku)",
    kunyomi: "き (ki)",
    meaning: "Pohon",
    strokes: 4,
    strokeSteps: ["Garis horizontal mendatar", "Garis vertikal lurus memotong", "Garis miring kiri dari titik potong", "Garis miring kanan dari titik potong"],
    examples: [
      { word: "木", kana: "き (ki)", meaning: "Pohon / Kayu" },
      { word: "木曜日", kana: "もくようび (mokuyoubi)", meaning: "Hari Kamis" },
      { word: "大木", kana: "たいぼく (taiboku)", meaning: "Pohon besar" },
      { word: "木村", kana: "きむら (kimura)", meaning: "Kimura (nama keluarga Jepang)" }
    ]
  },
  {
    kanji: "金",
    level: "N5",
    onyomi: "キン (kin), コン (kon)",
    kunyomi: "かね (kane), -がね (-gane)",
    meaning: "Emas / Uang",
    strokes: 8,
    strokeSteps: ["Kanopi kiri", "Kanopi kanan", "Garis horizontal atas mendatar", "Garis horizontal tengah", "Tiang vertikal kecil bawah", "Goresan serong kiri bawah", "Goresan serong kanan bawah", "Garis horizontal penutup bawah panjang"],
    examples: [
      { word: "お金", kana: "おかね (okane)", meaning: "Uang" },
      { word: "金曜日", kana: "きんようび (kinyoubi)", meaning: "Hari Jumat" },
      { word: "金", kana: "きん (kin)", meaning: "Emas / Logam" },
      { word: "金持ち", kana: "かねもち (kanemochi)", meaning: "Orang kaya" }
    ]
  },
  {
    kanji: "土",
    level: "N5",
    onyomi: "ト (to), ド (do)",
    kunyomi: "つち (tsuchi)",
    meaning: "Tanah",
    strokes: 3,
    strokeSteps: ["Garis horizontal sedang", "Garis vertikal menembus ke bawah", "Garis horizontal panjang penutup bawah"],
    examples: [
      { word: "土", kana: "つち (tsuchi)", meaning: "Tanah / Bumi" },
      { word: "土曜日", kana: "どようび (doyoubi)", meaning: "Hari Sabtu" },
      { word: "土地", kana: "とち (tochi)", meaning: "Lahan / Tanah kavling" },
      { word: "土木", kana: "どぼく (doboku)", meaning: "Teknik sipil" }
    ]
  },

  // --- JLPT N4 KANJI ---
  {
    kanji: "会",
    level: "N4",
    onyomi: "カイ (kai), エ (e)",
    kunyomi: "あ-う (a-u)",
    meaning: "Bertemu / Perkumpulan",
    strokes: 6,
    strokeSteps: ["Kanopi kiri atas", "Kanopi kanan atas", "Garis horizontal tengah lurus", "Garis lipatan menyiku bawah kiri", "Goresan pelindung mendatar dalam", "Garis melengkung tipis alas"],
    examples: [
      { word: "会う", kana: "あう (au)", meaning: "Bertemu" },
      { word: "会社", kana: "かいしゃ (kaisha)", meaning: "Perusahaan" },
      { word: "会話", kana: "かいわ (kaiwa)", meaning: "Percakapan" },
      { word: "会議", kana: "かいぎ (kaigi)", meaning: "Rapat / Konferensi" }
    ]
  },
  {
    kanji: "社",
    level: "N4",
    onyomi: "シャ (sha)",
    kunyomi: "やしろ (yashiro)",
    meaning: "Perusahaan / Kuil Kuil",
    strokes: 7,
    strokeSteps: ["Goresan titik atas kiri Radikal Jin", "Garis menyamping kebawah", "Tiang tegak radikal", "Goresan samping pelindung", "Garis mendatar atas kanan", "Tiang tegak kanan", "Garis penutup dasar mendatar"],
    examples: [
      { word: "社会", kana: "しゃかい (shakai)", meaning: "Masyarakat / Ilmu Sosial" },
      { word: "新入社員", kana: "しんにゅうしゃいん (shinnyuu shain)", meaning: "Karyawan baru" },
      { word: "神社", kana: "じんじゃ (jinja)", meaning: "Kuil Shinto" },
      { word: "本社", kana: "ほんしゃ (honsha)", meaning: "Kantor Pusat" }
    ]
  },
  {
    kanji: "国",
    level: "N4",
    onyomi: "コク (koku)",
    kunyomi: "くに (kuni)",
    meaning: "Negara",
    strokes: 8,
    strokeSteps: ["Garis kiri bingkai", "Garis bingkai atas belok kanan kebawah", "Mendatar dalam giok", "Tiang dalam giok", "Mendatar tengah giok", "Titik kecil kanan giok", "Garis dasar penutup luar"],
    examples: [
      { word: "国", kana: "くに (kuni)", meaning: "Negara / Negeri" },
      { word: "外国人", kana: "がいこくじん (gaikokujin)", meaning: "Orang asing / WNA" },
      { word: "国内", kana: "こくない (kokunai)", meaning: "Dalam negeri" },
      { word: "国籍", kana: "こくせき (kokuseki)", meaning: "Kewarganegaraan" }
    ]
  },
  {
    kanji: "言",
    level: "N4",
    onyomi: "ゲン (gen), ゴン (gon)",
    kunyomi: "い-う (i-u), こと (koto)",
    meaning: "Berkata / Kata-kata",
    strokes: 7,
    strokeSteps: ["Titik puncak atas", "Garis horizontal panjang kedua", "Garis horizontal sedang ketiga", "Garis horizontal pendek keempat", "Mulut (Kuchi) di bagian paling bawah terdiri dari 3 goresan"],
    examples: [
      { word: "言う", kana: "いう (iu)", meaning: "Berkata / Mengatakan" },
      { word: "言葉", kana: "ことば (kotoba)", meaning: "Bahasa / Kata-kata" },
      { word: "伝言", kana: "でんごん (dengon)", meaning: "Pesan titip" },
      { word: "言語学", kana: "げんごがく (gengogaku)", meaning: "Linguistik" }
    ]
  },
  {
    kanji: "話",
    level: "N4",
    onyomi: "ワ (wa)",
    kunyomi: "はな-す (hana-su), はなし (hanashi)",
    meaning: "Berbicara / Cerita",
    strokes: 13,
    strokeSteps: ["Lakukan 7 goresan radikal 言 (kata) di sebelah kiri", "Goresan mendatar kanan atas", "Segitiga/garis menembus tengah lidah", "Kotak Kuchi (mulut) bawah kanan terdiri dari 3 coretan"],
    examples: [
      { word: "話す", kana: "はなす (hanasu)", meaning: "Berbicara / Bercerita" },
      { word: "電話", kana: "でんわ (denwa)", meaning: "Telepon" },
      { word: "昔話", kana: "むかしばなし (mukashibanashi)", meaning: "Cerita rakyat / Dongeng kuno" },
      { word: "世話", kana: "せわ (sewa)", meaning: "Merawat / Mengurus" }
    ]
  },
  {
    kanji: "行",
    level: "N4",
    onyomi: "コウ (kou), ギョウ (gyou), アン (an)",
    kunyomi: "い-く (i-ku), ゆ-く (yu-ku), おこな-う (okonau)",
    meaning: "Pergi / Melakukan",
    strokes: 6,
    strokeSteps: ["Garis miring kiri atas", "Garis miring kiri kedua mengarah ke bawah", "Garis tegak lurus kiri", "Garis mendatar atas kanan", "Garis mendatar tengah kanan", "Tiang kait bagian kanan luar mendatar"],
    examples: [
      { word: "行く", kana: "いく (iku)", meaning: "Pergi" },
      { word: "行う", kana: "おこなう (okonau)", meaning: "Melakukan / Menyelenggarakan" },
      { word: "銀行", kana: "ぎんこう (ginkou)", meaning: "Bank" },
      { word: "旅行", kana: "りょこう (ryokou)", meaning: "Piknik / Perjalanan" }
    ]
  },
  {
    kanji: "来",
    level: "N4",
    onyomi: "ライ (rai)",
    kunyomi: "く-る (ku-ru), きた-る (kita-ru)",
    meaning: "Datang",
    strokes: 7,
    strokeSteps: ["Garis horizontal atas", "Percikan miring kiri dalam", "Percikan miring kanan dalam", "Garis mendatar panjang tengah", "Tiang vertikal tegak lurus membelah tengah", "Goresan diagonal kaki kiri", "Goresan diagonal kaki kanan"],
    examples: [
      { word: "来る", kana: "くる (kuru)", meaning: "Datang" },
      { word: "来週", kana: "らいしゅう (raishu)", meaning: "Minggu depan" },
      { word: "来年", kana: "らいねん (rainen)", meaning: "Tahun depan" },
      { word: "将来", kana: "しょうらい (shourai)", meaning: "Masa depan" }
    ]
  },
  {
    kanji: "車",
    level: "N4",
    onyomi: "シャ (sha)",
    kunyomi: "くるま (kuruma)",
    meaning: "Mobil / Kendaraan",
    strokes: 7,
    strokeSteps: ["Garis horizontal atas", "Garis meliuk kotak kiri", "Garis atas ke kanan ditekuk kotak", "Garis horizontal tengah dalam kotak", "Garis mendatar bawah kotak", "Garis horizontal pelindung bawah penutup", "Tiang vertikal membelah tengah meluncur ke bawah"],
    examples: [
      { word: "車", kana: "くるま (kuruma)", meaning: "Mobil / Kereta" },
      { word: "電車", kana: "でんしゃ (densha)", meaning: "Kereta listrik" },
      { word: "自転車", kana: "じてんしゃ (jitensha)", meaning: "Sepeda" },
      { word: "救急車", kana: "きゅうきゅうしゃ (kyuukyuusha)", meaning: "Ambulans" }
    ]
  }
];
