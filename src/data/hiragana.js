// Hiragana character data: shape mnemonics + acrophonic word/emoji pairs.
export const HIRAGANA_ROWS = [
  { label: "a-row", cells: [
    { c: "あ", r: "a", m: "A single loop opening wide, like a mouth calling out ah", w: "あか", e: "🟥" },
    { c: "い", r: "i", m: "Two thin strokes standing side by side like chopsticks", w: "いぬ", e: "🐶" },
    { c: "う", r: "u", m: "A curve sliding down and away, like an oo sound trailing off", w: "うさぎ", e: "🐰" },
    { c: "え", r: "e", m: "A curled hook with a flourish, like a surprised eh", w: "えんぴつ", e: "✏️" },
    { c: "お", r: "o", m: "A loop finished with a flick, like a fancy cursive o", w: "おにぎり", e: "🍙" },
  ]},
  { label: "k-row", cells: [
    { c: "か", r: "ka", m: "A sharp chop with a curl, like a karate ka strike", w: "かさ", e: "☂️" },
    { c: "き", r: "ki", m: "A key with teeth on a ring", w: "きりん", e: "🦒" },
    { c: "く", r: "ku", m: "A sharp angled beak, like a bird calling ku", w: "くも", e: "☁️" },
    { c: "け", r: "ke", m: "A person kneeling with one leg stretched out", w: "けむり", e: "💨" },
    { c: "こ", r: "ko", m: "Two short curved strokes stacked, like co co", w: "こおり", e: "🧊" },
  ]},
  { label: "s-row", cells: [
    { c: "さ", r: "sa", m: "A hook with a slash, like a fishhook — sailors shout sah", w: "さかな", e: "🐟" },
    { c: "し", r: "shi", m: "One smooth swoosh, like a quiet shh", w: "しか", e: "🦌" },
    { c: "す", r: "su", m: "A spiral swirl, like wind going soo", w: "すいか", e: "🍉" },
    { c: "せ", r: "se", m: "A small table with a leg — time to set the table", w: "せかい", e: "🌍" },
    { c: "そ", r: "so", m: "A zigzag line with many turns — so many turns", w: "そら", e: "⛅" },
  ]},
  { label: "t-row", cells: [
    { c: "た", r: "ta", m: "A cross with a flick, like a ta-da pose", w: "たこ", e: "🐙" },
    { c: "ち", r: "chi", m: "A curled hook, like a curled cheese chip", w: "ちず", e: "🗺️" },
    { c: "つ", r: "tsu", m: "A single wave crest, like a small tsunami", w: "つき", e: "🌙" },
    { c: "て", r: "te", m: "A bent arm, like reaching for the telephone", w: "て", e: "✋" },
    { c: "と", r: "to", m: "A hook shape, like a coat hanger", w: "とり", e: "🐦" },
  ]},
  { label: "n-row", cells: [
    { c: "な", r: "na", m: "A knot with a loop, tying something natural", w: "なす", e: "🍆" },
    { c: "に", r: "ni", m: "Two strokes bent like a knee bending twice", w: "にんじん", e: "🥕" },
    { c: "ぬ", r: "nu", m: "A loop with a tangled tail, like noodles", w: "ぬいぐるみ", e: "🧸" },
    { c: "ね", r: "ne", m: "A curled tail, like a cat stretching — neko", w: "ねこ", e: "🐱" },
    { c: "の", r: "no", m: "A single spiral loop, like a no-entry symbol", w: "のみもの", e: "🥤" },
  ]},
  { label: "h-row", cells: [
    { c: "は", r: "ha", m: "A person standing legs apart, laughing ha-ha", w: "はな", e: "🌸" },
    { c: "ひ", r: "hi", m: "A smiling curved line, a happy hee", w: "ひこうき", e: "✈️" },
    { c: "ふ", r: "fu", m: "Two soft humps, like the twin peaks of Fuji", w: "ふね", e: "🚢" },
    { c: "へ", r: "he", m: "A simple bent line, like a small mountain peak", w: "へび", e: "🐍" },
    { c: "ほ", r: "ho", m: "Like は with an extra stroke — ho ho ho", w: "ほん", e: "📕" },
  ]},
  { label: "m-row", cells: [
    { c: "ま", r: "ma", m: "A knot with a loop, like tying back hair", w: "まど", e: "🪟" },
    { c: "み", r: "mi", m: "A curled ribbon shape", w: "みかん", e: "🍊" },
    { c: "む", r: "mu", m: "A looped shape like a cow face — moo", w: "むし", e: "🐛" },
    { c: "め", r: "me", m: "A crossed loop, shaped like an eye", w: "めがね", e: "👓" },
    { c: "も", r: "mo", m: "A hook with a line trailing down, like a fishing line", w: "もも", e: "🍑" },
  ]},
  { label: "y-row", cells: [
    { c: "や", r: "ya", m: "A slingshot shape, ready to shout yah", w: "やま", e: "⛰️" },
    null,
    { c: "ゆ", r: "yu", m: "A hook curling into a loop, like a u-turn", w: "ゆき", e: "❄️" },
    null,
    { c: "よ", r: "yo", m: "A hook with two lines, like a casual yo greeting", w: "よる", e: "🌃" },
  ]},
  { label: "r-row", cells: [
    { c: "ら", r: "ra", m: "A hook like a lasso, ready to rope something", w: "らっぱ", e: "🎺" },
    { c: "り", r: "ri", m: "Two strokes flowing down like a river", w: "りんご", e: "🍎" },
    { c: "る", r: "ru", m: "A loose spiral loop", w: "るすばん", e: "📞" },
    { c: "れ", r: "re", m: "A bent line with a small flick at the end", w: "れいぞうこ", e: "🥶" },
    { c: "ろ", r: "ro", m: "A single open loop, like a rope circle", w: "ろうそく", e: "🕯️" },
  ]},
  { label: "w-row", cells: [
    { c: "わ", r: "wa", m: "A loop with a small tail, like a gentle wave", w: "わに", e: "🐊" },
    null, null, null,
    { c: "を", r: "wo", m: "A fancy loop, rarely used — marks an object", w: "てをあらう", e: "🤲" },
  ]},
  { label: "n", cells: [
    null, null,
    { c: "ん", r: "n", m: "A single soft curl, the smallest sound in the language", w: "にほん", e: "🇯🇵" },
    null, null,
  ]},
];

export const HIRAGANA_VOICED = [
  { label: "g-row", cells: ["が ga","ぎ gi","ぐ gu","げ ge","ご go"] },
  { label: "z-row", cells: ["ざ za","じ ji","ず zu","ぜ ze","ぞ zo"] },
  { label: "d-row", cells: ["だ da","ぢ ji","づ zu","で de","ど do"] },
  { label: "b-row", cells: ["ば ba","び bi","ぶ bu","べ be","ぼ bo"] },
  { label: "p-row", cells: ["ぱ pa","ぴ pi","ぷ pu","ぺ pe","ぽ po"] },
];
