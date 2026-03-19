// ---------------------------------------------------------------------------
// Language aliases -> canonical name
// ---------------------------------------------------------------------------

export const LANGUAGE_ALIASES: Record<string, string> = {
  // Telugu
  telugu: 'Telugu',
  tel: 'Telugu',
  te: 'Telugu',
  // Hindi / Indian (generic "INDIAN" maps to Hindi)
  hindi: 'Hindi',
  hin: 'Hindi',
  hi: 'Hindi',
  indian: 'Hindi',
  bollywood: 'Hindi',
  'south indian hindi dubbed': 'Hindi',
  // English
  english: 'English',
  eng: 'English',
  en: 'English',
  // Tamil
  tamil: 'Tamil',
  tam: 'Tamil',
  ta: 'Tamil',
  // Kannada
  kannada: 'Kannada',
  kan: 'Kannada',
  ka: 'Kannada',
  // Malayalam
  malayalam: 'Malayalam',
  mal: 'Malayalam',
  ml: 'Malayalam',
  // Bengali (including BANGLA alias)
  bengali: 'Bengali',
  ben: 'Bengali',
  bn: 'Bengali',
  bangla: 'Bengali',
  // Marathi
  marathi: 'Marathi',
  mar: 'Marathi',
  mr: 'Marathi',
  // Punjabi
  punjabi: 'Punjabi',
  pan: 'Punjabi',
  pa: 'Punjabi',
  // Gujarati (including common misspelling)
  gujarati: 'Gujarati',
  gujrati: 'Gujarati',
  guj: 'Gujarati',
  gu: 'Gujarati',
  // Urdu
  urdu: 'Urdu',
  urd: 'Urdu',
  ur: 'Urdu',
  // Pakistani (maps to Urdu for language grouping)
  pakistan: 'Pakistani',
  pakistani: 'Pakistani',
  // Korean
  korean: 'Korean',
  kor: 'Korean',
  ko: 'Korean',
  // Japanese
  japanese: 'Japanese',
  jpn: 'Japanese',
  ja: 'Japanese',
  // Arabic
  arabic: 'Arabic',
  ara: 'Arabic',
  ar: 'Arabic',
  // Spanish
  spanish: 'Spanish',
  spa: 'Spanish',
  es: 'Spanish',
  // French
  french: 'French',
  fra: 'French',
  fr: 'French',
  // German
  german: 'German',
  deu: 'German',
  de: 'German',
  // Portuguese
  portuguese: 'Portuguese',
  por: 'Portuguese',
  pt: 'Portuguese',
  // Italian
  italian: 'Italian',
  ita: 'Italian',
  it: 'Italian',
  // Chinese
  chinese: 'Chinese',
  zho: 'Chinese',
  zh: 'Chinese',
  // Russian
  russian: 'Russian',
  rus: 'Russian',
  ru: 'Russian',
  // Turkish
  turkish: 'Turkish',
  tur: 'Turkish',
  tr: 'Turkish',
  // Thai
  thai: 'Thai',
  tha: 'Thai',
  th: 'Thai',
  // Dutch
  dutch: 'Dutch',
  nld: 'Dutch',
  nl: 'Dutch',
  // Polish
  polish: 'Polish',
  pol: 'Polish',
  pl: 'Polish',
};

// ---------------------------------------------------------------------------
// Series: TV channel / platform -> language mapping
// ---------------------------------------------------------------------------

export const CHANNEL_TO_LANGUAGE: Record<string, string> = {
  // --- Telugu channels ---
  'star maa': 'Telugu',
  'zee telugu': 'Telugu',
  'gemini': 'Telugu',
  'etv': 'Telugu',
  'etv telugu': 'Telugu',
  'sony telugu': 'Telugu',
  'aha': 'Telugu',
  'etv plus': 'Telugu',
  'maa movies': 'Telugu',
  'maa gold': 'Telugu',
  'maa tv': 'Telugu',

  // --- Hindi channels ---
  'colors hindi': 'Hindi',
  'colors': 'Hindi',
  'sony (set)': 'Hindi',
  'sony set': 'Hindi',
  'star plus': 'Hindi',
  'star bharat': 'Hindi',
  'zee tv': 'Hindi',
  'sab': 'Hindi',
  'and tv': 'Hindi',
  'mtv hindi': 'Hindi',
  'mtv': 'Hindi',
  'sun neo hindi': 'Hindi',
  'hindi tv series': 'Hindi',
  'indian reality shows': 'Hindi',
  'bigg boss ott': 'Hindi',
  'dangal tv': 'Hindi',
  'ishara tv': 'Hindi',
  'shemaroo': 'Hindi',
  'epic tv': 'Hindi',
  'dd national': 'Hindi',
  'dd bharati': 'Hindi',
  'zee anmol': 'Hindi',
  'sony pal': 'Hindi',
  'big magic': 'Hindi',
  'bindass': 'Hindi',
  'zee cinema': 'Hindi',
  'star gold': 'Hindi',
  'sony max': 'Hindi',
  'bollywood': 'Hindi',

  // --- Tamil channels ---
  'star vijay': 'Tamil',
  'vijay': 'Tamil',
  'zee tamil': 'Tamil',
  'sun tamil': 'Tamil',
  'sun tv': 'Tamil',
  'color tamil': 'Tamil',
  'colors tamil': 'Tamil',
  'sony tamil': 'Tamil',
  'tamil tv series': 'Tamil',
  'ktv': 'Tamil',
  'jaya tv': 'Tamil',
  'polimer': 'Tamil',
  'raj tv': 'Tamil',
  'adithya tv': 'Tamil',

  // --- Malayalam channels ---
  'asianet': 'Malayalam',
  'zee malayalam': 'Malayalam',
  'surya malayalam': 'Malayalam',
  'surya tv': 'Malayalam',
  'mazhavil manorama': 'Malayalam',
  'flowers tv': 'Malayalam',
  'manorama': 'Malayalam',
  'amrita tv': 'Malayalam',
  'kairali tv': 'Malayalam',

  // --- Kannada channels ---
  'star suvarna': 'Kannada',
  'zee kannada': 'Kannada',
  'colors kannada': 'Kannada',
  'udaya kannada': 'Kannada',
  'udaya tv': 'Kannada',
  'public tv': 'Kannada',
  'kasturi tv': 'Kannada',

  // --- Marathi channels ---
  'star pravah': 'Marathi',
  'zee marathi': 'Marathi',
  'colors marathi': 'Marathi',
  'sony marathi': 'Marathi',
  'sun marathi': 'Marathi',
  'fakt marathi': 'Marathi',

  // --- Bengali channels ---
  'star jalsha': 'Bengali',
  'zee bangla': 'Bengali',
  'sun bangla': 'Bengali',
  'colors bangla': 'Bengali',
  'sony aath': 'Bengali',
  'hoichoi': 'Bengali',
  'chorki/bangla': 'Bengali',
  'chorki': 'Bengali',
  'jalsha movies': 'Bengali',

  // --- Gujarati channels ---
  'colors gujarati': 'Gujarati',

  // --- Punjabi channels ---
  'zee punjabi': 'Punjabi',
  'punjabi tv series': 'Punjabi',
  'chaupal': 'Punjabi',
  'ptc punjabi': 'Punjabi',

  // --- Urdu channels ---
  'urdu 1': 'Urdu',
  'urdu flix': 'Urdu',
  'urdu tv series': 'Urdu',

  // --- Pakistani channels (grouped under Pakistani) ---
  'hum tv': 'Pakistani',
  'geo tv': 'Pakistani',
  'ary digital': 'Pakistani',
  'green tv entertainment': 'Pakistani',
  'express tv': 'Pakistani',
  'geo news': 'Pakistani',
  'play entertainment': 'Pakistani',
  'mun tv': 'Pakistani',
  'tv one': 'Pakistani',
  'ptv home': 'Pakistani',
  'aplus tv': 'Pakistani',
  'aan tv': 'Pakistani',
  'aur life': 'Pakistani',
  'pakistani drama': 'Pakistani',
  'ary news': 'Pakistani',
  'ary zindagi': 'Pakistani',
  'hum sitaray': 'Pakistani',
  'a-plus': 'Pakistani',

  // --- Multi-language / OTT platforms (English/Mixed) ---
  'netflix': 'English',
  'netflix (multi language)': 'English',
  'netflix movies hindi': 'Hindi',
  'netflix movies english': 'English',
  'amazon prime': 'English',
  'hbo max': 'English',
  'disney+hotstar': 'Hindi',
  'disney+ hotstar': 'Hindi',
  'hotstar': 'Hindi',
  'jio cinema': 'Hindi',
  'jio': 'Hindi',
  'zee5+alt balaji': 'Hindi',
  'zee5': 'Hindi',
  'alt balaji': 'Hindi',
  'sony liv': 'Hindi',
  'mx player': 'Hindi',
  'voot': 'Hindi',
  'hungama play': 'Hindi',
  'starz': 'English',
  'apple tv+': 'English',
  'apple tv': 'English',
  'eros now': 'Hindi',
  'lionsgate play': 'English',
  'paramount+': 'English',
  'peacock': 'English',
  'hulu': 'English',
  'crunchyroll': 'Japanese',

  // --- English / International channels ---
  'bbc': 'English',
  'nbc': 'English',
  'abc': 'English',
  'cbs': 'English',
  'fox': 'English',
  'fx': 'English',
  'hbo': 'English',
  'showtime': 'English',
  'amc': 'English',
  'cw': 'English',
  'usa network': 'English',
  'syfy': 'English',
  'tnt': 'English',
  'tbs': 'English',
  'bravo': 'English',
  'discovery': 'English',
  'history': 'English',
  'tlc': 'English',
  'nat geo': 'English',
  'national geographic': 'English',
  'lifetime': 'English',
  'hallmark': 'English',
  'a&e': 'English',
  'comedy central': 'English',
  'cartoon network': 'English',
  'nickelodeon': 'English',
  'disney': 'English',
  'espn': 'English',
  'sky': 'English',
  'itv': 'English',
  'channel 4': 'English',
  'channel 5': 'English',
  'dave': 'English',

  // --- Turkish ---
  'turkish': 'Turkish',

  // --- Korean ---
  'korean (multi language)': 'Korean',
  'jtbc': 'Korean',
  'tving': 'Korean',
  'kbs': 'Korean',
  'mbc': 'Korean',
  'sbs': 'Korean',
  'tvn': 'Korean',
};

// ---------------------------------------------------------------------------
// Live TV: keyword/prefix -> language mapping
// ---------------------------------------------------------------------------

export const LIVE_CATEGORY_MAP: Record<string, string> = {
  // Telugu
  'telugu': 'Telugu',
  'telugu movies 24/7': 'Telugu',

  // Hindi / Indian
  'india entertainment': 'Hindi',
  'india hindi movies': 'Hindi',
  'india documentary': 'Hindi',
  'india music': 'Hindi',
  'indian news': 'Hindi',
  'indian sd': 'Hindi',
  'indian active': 'Hindi',
  'bollywood movies/actors 24/7': 'Hindi',
  'bollywood singers 24/7': 'Hindi',
  'bollywood movies 24/7': 'Hindi',
  'hindi web series 24x7': 'Hindi',
  'india english movies': 'English',

  // Tamil
  'tamil': 'Tamil',
  'tamil | news': 'Tamil',
  'tamil | entertainment': 'Tamil',
  'tamil | movies': 'Tamil',

  // Malayalam
  'malayalam | movies': 'Malayalam',
  'malayalam | news': 'Malayalam',
  'malayalam | songs': 'Malayalam',
  'malayalam | entrtnmnt': 'Malayalam',

  // Kannada
  'kannada': 'Kannada',
  'kannada movies 24/7': 'Kannada',

  // English
  'english news': 'English',
  'uk| entertainment': 'English',
  'uk| movies': 'English',
  'english movies 24/7': 'English',
  'uk entertainment': 'English',
  'uk movies': 'English',
  'us entertainment': 'English',
  'us movies': 'English',
};

// ---------------------------------------------------------------------------
// Priority order for display (Telugu first as user's primary)
// ---------------------------------------------------------------------------

export const LANGUAGE_PRIORITY: string[] = [
  'Telugu', 'Hindi', 'English', 'Tamil', 'Kannada', 'Malayalam',
  'Bengali', 'Marathi', 'Punjabi', 'Gujarati', 'Urdu', 'Pakistani',
  'Korean', 'Japanese', 'Arabic', 'Spanish', 'French', 'German',
  'Turkish', 'Thai', 'Chinese', 'Russian', 'Portuguese', 'Italian',
  'Dutch', 'Polish',
];
