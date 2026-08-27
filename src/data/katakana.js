// Katakana character data: shape mnemonics + acrophonic word/emoji pairs.
export const KATAKANA_ROWS = [
  { label: "a-row", cells: [
    { c: "ア", r: "a", m: "A sharp peak like an A-frame tent", w: "アイス", e: "🍦" },
    { c: "イ", r: "i", m: "Two strokes like a person walking", w: "イヤホン", e: "🎧" },
    { c: "ウ", r: "u", m: "A hook with a roof over it", w: "ウインナー", e: "🌭" },
    { c: "エ", r: "e", m: "Three flat bars stacked like the letter E on its side", w: "エレベーター", e: "🛗" },
    { c: "オ", r: "o", m: "A figure with arms thrown up, shouting oh", w: "オートバイ", e: "🏍️" },
  ]},
  { label: "k-row", cells: [
    { c: "カ", r: "ka", m: "A sharp angled shape, like a can opener", w: "カメラ", e: "📷" },
    { c: "キ", r: "ki", m: "A key shape with sharp edges", w: "キウイ", e: "🥝" },
    { c: "ク", r: "ku", m: "A boomerang angle flying past", w: "クリスマス", e: "🎄" },
    { c: "ケ", r: "ke", m: "A figure kicking one leg out", w: "ケーキ", e: "🎂" },
    { c: "コ", r: "ko", m: "A bracket shape, like an open box", w: "コアラ", e: "🐨" },
  ]},
  { label: "s-row", cells: [
    { c: "サ", r: "sa", m: "A cross with a tail — a sharp sah", w: "サラダ", e: "🥗" },
    { c: "シ", r: "shi", m: "Three small drips falling, a quiet shh", w: "シャツ", e: "👕" },
    { c: "ス", r: "su", m: "A single sharp swoosh", w: "スキー", e: "⛷️" },
    { c: "セ", r: "se", m: "A small chair shape — time to set it down", w: "セーター", e: "🧥" },
    { c: "ソ", r: "so", m: "A single falling drip — so small", w: "ソファ", e: "🛋️" },
  ]},
  { label: "t-row", cells: [
    { c: "タ", r: "ta", m: "A flag waving on a pole — ta-da", w: "タクシー", e: "🚕" },
    { c: "チ", r: "chi", m: "A check mark shape — all correct, chi", w: "チーズ", e: "🧀" },
    { c: "ツ", r: "tsu", m: "Three small waves, like a mini tsunami", w: "ツナ", e: "🥫" },
    { c: "テ", r: "te", m: "A flat table shape", w: "テレビ", e: "📺" },
    { c: "ト", r: "to", m: "A door frame shape", w: "トマト", e: "🍅" },
  ]},
  { label: "n-row", cells: [
    { c: "ナ", r: "na", m: "A simple cross shape", w: "ナイフ", e: "🔪" },
    { c: "ニ", r: "ni", m: "Two flat bars, like a bent knee", w: "ニット", e: "🧶" },
    { c: "ヌ", r: "nu", m: "A loop with a trailing tail — tangled noodles", w: "ヌードル", e: "🍜" },
    { c: "ネ", r: "ne", m: "A shrine-gate shape — neko, cat sound", w: "ネックレス", e: "📿" },
    { c: "ノ", r: "no", m: "A single downward slash, a no-entry mark", w: "ノート", e: "📓" },
  ]},
  { label: "h-row", cells: [
    { c: "ハ", r: "ha", m: "Two legs standing apart, laughing ha-ha", w: "ハムスター", e: "🐹" },
    { c: "ヒ", r: "hi", m: "A simple smiling curve", w: "ヒーロー", e: "🦸" },
    { c: "フ", r: "fu", m: "A single curved hook, like a small Fuji peak", w: "フルーツ", e: "🍇" },
    { c: "ヘ", r: "he", m: "A simple peak shape", w: "ヘリコプター", e: "🚁" },
    { c: "ホ", r: "ho", m: "A pillar with a cross beam — ho ho ho", w: "ホテル", e: "🏨" },
  ]},
  { label: "m-row", cells: [
    { c: "マ", r: "ma", m: "A hook with a flick at the end", w: "マスク", e: "😷" },
    { c: "ミ", r: "mi", m: "Three small strokes stacked", w: "ミルク", e: "🥛" },
    { c: "ム", r: "mu", m: "A shape like a cow mouth — moo", w: "ムービー", e: "🎬" },
    { c: "メ", r: "me", m: "A crossed shape, like a closed eye — me", w: "メロン", e: "🍈" },
    { c: "モ", r: "mo", m: "A shape like a small sprouting plant", w: "モノレール", e: "🚝" },
  ]},
  { label: "y-row", cells: [
    { c: "ヤ", r: "ya", m: "A slingshot shape, ready to shout yah", w: "タイヤ", e: "🛞" },
    null,
    { c: "ユ", r: "yu", m: "A hook shape, like a u-turn", w: "ユニフォーム", e: "🎽" },
    null,
    { c: "ヨ", r: "yo", m: "Three flat bars — a casual yo", w: "ヨーヨー", e: "🪀" },
  ]},
  { label: "r-row", cells: [
    { c: "ラ", r: "ra", m: "A hook with a flick, ready to rope something", w: "ライオン", e: "🦁" },
    { c: "リ", r: "ri", m: "Two strokes flowing down like a small river", w: "リボン", e: "🎀" },
    { c: "ル", r: "ru", m: "A hook with a curled tail", w: "ルーレット", e: "🎰" },
    { c: "レ", r: "re", m: "A single bent line", w: "レストラン", e: "🍽️" },
    { c: "ロ", r: "ro", m: "A closed square box — a small room", w: "ロボット", e: "🤖" },
  ]},
  { label: "w-row", cells: [
    { c: "ワ", r: "wa", m: "A loop shape, like a gentle wave", w: "ワンピース", e: "👗" },
    null, null, null,
    { c: "ヲ", r: "wo", m: "A rarely used, fancy loop" },
  ]},
  { label: "n", cells: [
    null, null,
    { c: "ン", r: "n", m: "A single curved stroke, the smallest sound", w: "ラーメン", e: "🍥" },
    null, null,
  ]},
];

export const KATAKANA_VOICED = [
  { label: "g-row", cells: ["ガ ga","ギ gi","グ gu","ゲ ge","ゴ go"] },
  { label: "z-row", cells: ["ザ za","ジ ji","ズ zu","ゼ ze","ゾ zo"] },
  { label: "d-row", cells: ["ダ da","ヂ ji","ヅ zu","デ de","ド do"] },
  { label: "b-row", cells: ["バ ba","ビ bi","ブ bu","ベ be","ボ bo"] },
  { label: "p-row", cells: ["パ pa","ピ pi","プ pu","ペ pe","ポ po"] },
];
