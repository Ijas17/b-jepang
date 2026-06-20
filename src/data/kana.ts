/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KanaItem {
  char: string;
  rom: string;
}

export interface KanaGroup {
  dasar: KanaItem[];
  varian: KanaItem[];
  kombinasi: KanaItem[];
}

export interface KanaData {
  hiragana: KanaGroup;
  katakana: KanaGroup;
}

/**
 * Japanese Kana (Hiragana & Katakana) Database
 * Includes Basic (Gojuon), Variants (Dakuon/Handakuon) and Combinations (Yō-on).
 */
export const KANA_DATA: KanaData = {
  hiragana: {
    dasar: [
      { char: 'あ', rom: 'a' }, { char: 'い', rom: 'i' }, { char: 'う', rom: 'u' }, { char: 'え', rom: 'e' }, { char: 'お', rom: 'o' },
      { char: 'か', rom: 'ka' }, { char: 'き', rom: 'ki' }, { char: 'く', rom: 'ku' }, { char: 'け', rom: 'ke' }, { char: 'こ', rom: 'ko' },
      { char: 'さ', rom: 'sa' }, { char: 'し', rom: 'shi' }, { char: 'す', rom: 'su' }, { char: 'せ', rom: 'se' }, { char: 'そ', rom: 'so' },
      { char: 'た', rom: 'ta' }, { char: 'ち', rom: 'chi' }, { char: 'つ', rom: 'tsu' }, { char: 'て', rom: 'te' }, { char: 'と', rom: 'to' },
      { char: 'な', rom: 'na' }, { char: 'に', rom: 'ni' }, { char: 'ぬ', rom: 'nu' }, { char: 'ね', rom: 'ne' }, { char: 'の', rom: 'no' },
      { char: 'は', rom: 'ha' }, { char: 'ひ', rom: 'hi' }, { char: 'ふ', rom: 'fu' }, { char: 'へ', rom: 'he' }, { char: 'ほ', rom: 'ho' },
      { char: 'ま', rom: 'ma' }, { char: 'み', rom: 'mi' }, { char: 'む', rom: 'mu' }, { char: 'め', rom: 'me' }, { char: 'も', rom: 'mo' },
      { char: 'や', rom: 'ya' }, { char: '—', rom: '' }, { char: 'ゆ', rom: 'yu' }, { char: '—', rom: '' }, { char: 'よ', rom: 'yo' },
      { char: 'ら', rom: 'ra' }, { char: 'り', rom: 'ri' }, { char: 'る', rom: 'ru' }, { char: 'れ', rom: 're' }, { char: 'ろ', rom: 'ro' },
      { char: 'わ', rom: 'wa' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: 'を', rom: 'wo' },
      { char: 'ん', rom: 'n' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }
    ],
    varian: [
      { char: 'が', rom: 'ga' }, { char: 'ぎ', rom: 'gi' }, { char: 'ぐ', rom: 'gu' }, { char: 'げ', rom: 'ge' }, { char: 'ご', rom: 'go' },
      { char: 'ざ', rom: 'za' }, { char: 'じ', rom: 'ji' }, { char: 'ず', rom: 'zu' }, { char: 'ぜ', rom: 'ze' }, { char: 'ぞ', rom: 'zo' },
      { char: 'だ', rom: 'da' }, { char: 'ぢ', rom: 'di' }, { char: 'づ', rom: 'du' }, { char: 'で', rom: 'de' }, { char: 'ど', rom: 'do' },
      { char: 'ば', rom: 'ba' }, { char: 'び', rom: 'bi' }, { char: 'ぶ', rom: 'bu' }, { char: 'べ', rom: 'be' }, { char: 'ぼ', rom: 'bo' },
      { char: 'ぱ', rom: 'pa' }, { char: 'ぴ', rom: 'pi' }, { char: 'ぷ', rom: 'pu' }, { char: 'ぺ', rom: 'pe' }, { char: 'ぽ', rom: 'po' }
    ],
    kombinasi: [
      { char: 'きゃ', rom: 'kya' }, { char: 'きゅ', rom: 'kyu' }, { char: 'きょ', rom: 'kyo' },
      { char: 'しゃ', rom: 'sha' }, { char: 'しゅ', rom: 'shu' }, { char: 'しょ', rom: 'sho' },
      { char: 'ちゃ', rom: 'cha' }, { char: 'ちゅ', rom: 'chu' }, { char: 'ちょ', rom: 'cho' },
      { char: 'にゃ', rom: 'nya' }, { char: 'にゅ', rom: 'nyu' }, { char: 'にょ', rom: 'nyo' },
      { char: 'ひゃ', rom: 'hya' }, { char: 'ひゅ', rom: 'hyu' }, { char: 'ひょ', rom: 'hyo' },
      { char: 'みゃ', rom: 'mya' }, { char: 'みゅ', rom: 'myu' }, { char: 'みょ', rom: 'myo' },
      { char: 'りゃ', rom: 'rya' }, { char: 'りゅ', rom: 'ryu' }, { char: 'りょ', rom: 'ryo' },
      { char: 'ぎゃ', rom: 'gya' }, { char: 'ぎゅ', rom: 'gyu' }, { char: 'ぎょ', rom: 'gyo' },
      { char: 'じゃ', rom: 'jya' }, { char: 'じゅ', rom: 'jyu' }, { char: 'じょ', rom: 'jyo' },
      { char: 'びゃ', rom: 'bya' }, { char: 'びゅ', rom: 'byu' }, { char: 'びょ', rom: 'byo' },
      { char: 'ぴゃ', rom: 'pya' }, { char: 'ぴゅ', rom: 'pyu' }, { char: 'ぴょ', rom: 'pyo' }
    ]
  },
  katakana: {
    dasar: [
      { char: 'ア', rom: 'a' }, { char: 'イ', rom: 'i' }, { char: 'ウ', rom: 'u' }, { char: 'エ', rom: 'e' }, { char: 'オ', rom: 'o' },
      { char: 'カ', rom: 'ka' }, { char: 'キ', rom: 'ki' }, { char: 'ク', rom: 'ku' }, { char: 'ケ', rom: 'ke' }, { char: 'コ', rom: 'ko' },
      { char: 'サ', rom: 'sa' }, { char: 'シ', rom: 'shi' }, { char: 'ス', rom: 'su' }, { char: 'セ', rom: 'se' }, { char: 'ソ', rom: 'so' },
      { char: 'タ', rom: 'ta' }, { char: 'チ', rom: 'chi' }, { char: 'ツ', rom: 'tsu' }, { char: 'テ', rom: 'te' }, { char: 'ト', rom: 'to' },
      { char: 'ナ', rom: 'na' }, { char: 'ニ', rom: 'ni' }, { char: 'ヌ', rom: 'nu' }, { char: 'ネ', rom: 'ne' }, { char: 'ノ', rom: 'no' },
      { char: 'ハ', rom: 'ha' }, { char: 'ヒ', rom: 'hi' }, { char: 'フ', rom: 'fu' }, { char: 'ヘ', rom: 'he' }, { char: 'ホ', rom: 'ho' },
      { char: 'マ', rom: 'ma' }, { char: 'ミ', rom: 'mi' }, { char: 'ム', rom: 'mu' }, { char: 'メ', rom: 'me' }, { char: 'モ', rom: 'mo' },
      { char: 'ヤ', rom: 'ya' }, { char: '—', rom: '' }, { char: 'ユ', rom: 'yu' }, { char: '—', rom: '' }, { char: 'ヨ', rom: 'yo' },
      { char: 'ラ', rom: 'ra' }, { char: 'リ', rom: 'ri' }, { char: 'ル', rom: 'ru' }, { char: 'レ', rom: 're' }, { char: 'ロ', rom: 'ro' },
      { char: 'ワ', rom: 'wa' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: 'ヲ', rom: 'wo' },
      { char: 'ン', rom: 'n' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }, { char: '—', rom: '' }
    ],
    varian: [
      { char: 'ガ', rom: 'ga' }, { char: 'ギ', rom: 'gi' }, { char: 'グ', rom: 'gu' }, { char: 'ゲ', rom: 'ge' }, { char: 'ゴ', rom: 'go' },
      { char: 'ザ', rom: 'za' }, { char: 'ジ', rom: 'ji' }, { char: 'ズ', rom: 'zu' }, { char: 'ゼ', rom: 'ze' }, { char: 'ゾ', rom: 'zo' },
      { char: 'ダ', rom: 'da' }, { char: 'ヂ', rom: 'di' }, { char: 'ヅ', rom: 'du' }, { char: 'デ', rom: 'de' }, { char: 'ド', rom: 'do' },
      { char: 'バ', rom: 'ba' }, { char: 'ビ', rom: 'bi' }, { char: 'ブ', rom: 'bu' }, { char: 'べ', rom: 'be' }, { char: 'ボ', rom: 'bo' },
      { char: 'パ', rom: 'pa' }, { char: 'ピ', rom: 'pi' }, { char: 'プ', rom: 'pu' }, { char: 'ペ', rom: 'pe' }, { char: 'ポ', rom: 'po' }
    ],
    kombinasi: [
      { char: 'キャ', rom: 'kya' }, { char: 'キュ', rom: 'kyu' }, { char: 'キョ', rom: 'kyo' },
      { char: 'シャ', rom: 'sha' }, { char: 'シュ', rom: 'shu' }, { char: 'ショ', rom: 'sho' },
      { char: 'チャ', rom: 'cha' }, { char: 'チュ', rom: 'chu' }, { char: 'チョ', rom: 'cho' },
      { char: 'ニャ', rom: 'nya' }, { char: 'ニュ', rom: 'nyu' }, { char: 'ニョ', rom: 'nyo' },
      { char: 'ヒャ', rom: 'hya' }, { char: 'ヒュ', rom: 'hyu' }, { char: 'ヒョ', rom: 'hyo' },
      { char: 'ミャ', rom: 'mya' }, { char: 'ミュ', rom: 'myu' }, { char: 'ミョ', rom: 'myo' },
      { char: 'リャ', rom: 'rya' }, { char: 'リュ', rom: 'ryu' }, { char: 'リョ', rom: 'ryo' },
      { char: 'ギャ', rom: 'gya' }, { char: 'ギュ', rom: 'gyu' }, { char: 'ギョ', rom: 'gyo' },
      { char: 'ジャ', rom: 'jya' }, { char: 'ジュ', rom: 'jyu' }, { char: 'ジョ', rom: 'jyo' },
      { char: 'ビャ', rom: 'bya' }, { char: 'ビュ', rom: 'byu' }, { char: 'ビョ', rom: 'byo' },
      { char: 'ピャ', rom: 'pya' }, { char: 'ピュ', rom: 'pyu' }, { char: 'ピョ', rom: 'pyo' }
    ]
  }
};
