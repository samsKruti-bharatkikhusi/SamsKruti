import type { GuideBookData } from "./types";

// ── Translations ──────────────────────────────────────────────────────────
// A book is authored once in English. `translateBook` deep-walks it and swaps
// any string it finds in the dictionary; anything missing falls back to English
// automatically — so a partial translation still produces a usable book. IDs,
// image paths, URLs and variant keys are never in a dictionary, so they're
// never touched (ticks + images stay stable across languages).
//
// STATUS: Hindi is a full pass; Telugu is headers only. All machine-authored —
// to be verified by a native speaker (like the illustrative maker names).

type Dict = Record<string, string>;

function walk(v: unknown, dict: Dict): unknown {
  if (typeof v === "string") return dict[v] ?? v;
  if (Array.isArray(v)) return v.map((x) => walk(x, dict));
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const k of Object.keys(v as object)) o[k] = walk((v as Record<string, unknown>)[k], dict);
    return o;
  }
  return v;
}

export function translateBook(book: GuideBookData, dict: Dict): GuideBookData {
  return {
    ...book,
    topLabel: dict[book.topLabel] ?? book.topLabel,
    pages: walk(book.pages, dict) as GuideBookData["pages"],
  };
}

// ── हिंदी (full pass) ──
export const HI: Dict = {
  "Varanasi · Three Days": "वाराणसी · तीन दिन",
  "Three Days · A Guided Workbook": "तीन दिन · एक मार्गदर्शक पुस्तिका",
  "काशी · The city that guides · First Edition": "काशी · वह शहर जो राह दिखाता है · प्रथम संस्करण",
  "For the traveller who has three days — and does not want to waste one.": "उस यात्री के लिए जिसके पास तीन दिन हैं — और जो एक भी बरबाद नहीं करना चाहता।",
  "How to use this book": "इस किताब का उपयोग",
  "It becomes yours": "यह आपकी अपनी बन जाती है",
  "Not a book to only read — a book to walk with, and to fill.": "सिर्फ़ पढ़ने की किताब नहीं — साथ चलने की, और भरने की किताब।",
  "Tick each thing as you do it; the book remembers. Paste your photos into the frames.": "जो करें उस पर निशान लगाएँ; किताब याद रखती है। अपनी तस्वीरें ख़ानों में चिपकाएँ।",
  "Every code is a door — scan it for the full story behind a face, or for live help the moment you feel lost.": "हर कोड एक दरवाज़ा है — किसी चेहरे की पूरी कहानी के लिए उसे स्कैन करें, या खोने पर तुरंत मदद के लिए।",
  "☑  tick as you go   ✂  paste your photos   ▣  scan for more": "☑  निशान लगाएँ   ✂  तस्वीरें चिपकाएँ   ▣  और के लिए स्कैन करें",
  "The journey": "यात्रा",
  "Three days of Kashi": "काशी के तीन दिन",
  "The river and its ghats · the makers' lanes · Sarnath. Your three days, marked.": "नदी और उसके घाट · कारीगरों की गलियाँ · सारनाथ। आपके तीन दिन, अंकित।",

  "Day One": "पहला दिन",
  "Day Two": "दूसरा दिन",
  "Day Three": "तीसरा दिन",
  "Your first hours": "आपके पहले घंटे",
  "Early morning": "तड़के सुबह",
  "Afternoon": "दोपहर",
  "Evening": "शाम",
  "Morning": "सुबह",
  "Late morning": "देर सुबह",
  "Midday": "दोपहर",
  "Late afternoon": "पिछले पहर",
  "Night": "रात",
  "Dusk": "साँझ",
  "Lunch": "दोपहर का भोजन",
  "On arrival": "पहुँचते ही",
  "After the boat": "नाव के बाद",
  "Before 6:15": "6:15 से पहले",
  "If you miss it": "अगर छूट जाए",

  "You hit the jackpot — Kashi's finest hour is happening now. Don't settle in; go straight to the river.": "आप भाग्यशाली हैं — काशी का सबसे सुंदर पहर अभी चल रहा है। रुकिए मत; सीधे नदी की ओर जाइए।",
  "The city is hot and loud, and so are you. Ease in — don't fight it. The river keeps its magic for dawn tomorrow.": "शहर गरम और शोरगुल भरा है, और आप भी। धीरे से घुलिए — जल्दी मत कीजिए। नदी अपना जादू कल भोर के लिए सँभाले रखती है।",
  "You arrive as the city lights its fire. Move fast for the Aarti, or rest easy — either is right.": "आप उस पल पहुँचे हैं जब शहर अपनी ज्वाला जलाता है। आरती के लिए तेज़ चलिए, या आराम कीजिए — दोनों ठीक हैं।",

  "Drop bags, go straight to a sunrise boat": "सामान रखिए, सीधे भोर की नाव पर जाइए",
  "The whole city rises from the water; the light won't wait.": "पूरा शहर पानी से जागता है; रोशनी इंतज़ार नहीं करती।",
  "Kachori-sabzi and a kulhad of chai": "कचौड़ी-सब्ज़ी और एक कुल्हड़ चाय",
  "Banaras breakfasts like a king.": "बनारस राजाओं की तरह नाश्ता करता है।",
  "Rest through the heat — not optional": "गरमी में आराम कीजिए — यह ज़रूरी है",
  "Kashi at noon is brutal; return at dusk.": "दोपहर की काशी कठोर है; साँझ को लौटिए।",
  "Kashi Vishwanath, via the corridor": "गलियारे से काशी विश्वनाथ",
  "The golden heart of the city.": "शहर का स्वर्ण हृदय।",
  "Ganga Aarti at Dashashwamedh": "दशाश्वमेध पर गंगा आरती",
  "Fire, brass, a thousand voices to the river.": "अग्नि, पीतल, नदी को अर्पित हज़ार स्वर।",
  "Check in, eat, rest an hour": "ठहरिए, खाइए, एक घंटा आराम कीजिए",
  "Let the heat and the journey settle.": "गरमी और सफ़र को थमने दीजिए।",
  "A gentle first walk along the ghats": "घाटों के किनारे एक धीमी पहली सैर",
  "No agenda — just meet the river.": "कोई योजना नहीं — बस नदी से मिलिए।",
  "Your first big moment.": "आपका पहला बड़ा पल।",
  "Eat well, sleep early, set an alarm": "अच्छा खाइए, जल्दी सोइए, अलार्म लगाइए",
  "Tomorrow you wake before dawn for the boat.": "कल भोर से पहले नाव के लिए उठना है।",
  "Drop your bags fast": "अपना सामान जल्दी रखिए",
  "The city's most theatrical hour is starting.": "शहर का सबसे नाटकीय पहर शुरू हो रहा है।",
  "If you can, go straight to the Aarti": "हो सके तो सीधे आरती पर जाइए",
  "Arrive as fire meets the river.": "पहुँचिए जब अग्नि नदी से मिलती है।",
  "A quiet ghat and a street-food walk": "एक शांत घाट और चाट-पकवान की सैर",
  "Chaat, a lassi, the lanes at night.": "चाट, एक लस्सी, रात की गलियाँ।",
  "Sleep early, set an alarm": "जल्दी सोइए, अलार्म लगाइए",
  "Dawn on the water, first thing tomorrow.": "कल सबसे पहले, पानी पर भोर।",

  "You are entering Kashi": "आप काशी में प्रवेश कर रहे हैं",
  "Older than history — and twice as old as it looks.": "इतिहास से भी पुरानी — और जितनी दिखती है, उससे दुगुनी पुरानी।",
  "The evening fire": "साँझ की ज्वाला",
  "Stand at the back, or watch it burn from a boat.": "पीछे खड़े रहिए, या नाव से इसे जलते देखिए।",
  "The makers' hands": "कारीगरों के हाथ",
  "A century of colour, spun onto wood.": "एक सदी का रंग, लकड़ी पर उतरा।",
  "One last look": "एक आख़िरी नज़र",
  "You leave changed.": "आप बदलकर लौटते हैं।",
  "Kashi teaches you to feel everything at once. You leave changed.": "काशी सब कुछ एक साथ महसूस करना सिखाती है। आप बदल कर लौटते हैं।",
  "Banarasi silk": "बनारसी रेशम",
  "Gold thread on silk; six months to a saree.": "रेशम पर सोने का धागा; एक साड़ी में छह महीने।",
  "The river's clay": "नदी की मिट्टी",
  "Thrown, used once, returned to the earth.": "गढ़ा, एक बार बरता, मिट्टी को लौटाया।",
  "Hold onto this": "इसे सँभालकर रखिए",
  "The fire, the river, the morning you'll never forget.": "वह अग्नि, वह नदी, वह भोर जो कभी नहीं भूलेगी।",
  "Kashi remembers you": "काशी आपको याद रखती है",
  "Every page has a soul. · SamsKruti, made in Kashi.": "हर पन्ने में एक आत्मा है। · संस्कृति, काशी में बना।",

  "The lanes, the makers, the flavours": "गलियाँ, कारीगर, ज़ायके",
  "Find the pit looms of Madanpura": "मदनपुरा के गड्ढे-करघे खोजिए",
  "Six months become a single Banarasi saree.": "छह महीने एक बनारसी साड़ी बन जाते हैं।",
  "Hear the hammers of Thatheri Bazar": "ठठेरी बाज़ार के हथौड़े सुनिए",
  "Copper and brass, beaten by hand.": "ताँबा और पीतल, हाथ से पीटे हुए।",
  "Kachori-sabzi, then a thick lassi": "कचौड़ी-सब्ज़ी, फिर गाढ़ी लस्सी",
  "Banaras breakfasts like a king — and argues about it.": "बनारस राजाओं-सा खाता है — और उस पर बहस भी करता है।",
  "Fold a Banarasi paan into your cheek": "एक बनारसी पान गाल में दबाइए",
  "The city's full stop: sweet, cool, and slow.": "शहर का पूर्ण विराम: मीठा, ठंडा, धीमा।",
  "Watch wood spun into toys at Khojwan": "खोजवाँ में लकड़ी को खिलौनों में ढलते देखिए",
  "Soft gular wood, sealed in red and gold lac.": "नरम गूलर की लकड़ी, लाल-सुनहरी लाख में बंद।",

  "The Weaver": "बुनकर",
  "Raheem Ansari · Madanpura": "रहीम अंसारी · मदनपुरा",
  "Raheem sits at a loom his grandfather built. Each motif carries centuries of memory — none of it written down, all of it learned by watching.": "रहीम अपने दादा के बनाए करघे पर बैठते हैं। हर बूटी में सदियों की स्मृति है — कुछ भी लिखा नहीं, सब देखकर सीखा।",
  "Five centuries, six months, one saree.": "पाँच सदियाँ, छह महीने, एक साड़ी।",
  "Raheem's whole story — the loom his grandfather built, the son studying in Pune, the craft slowly fading.": "रहीम की पूरी कहानी — दादा का बनाया करघा, पुणे में पढ़ता बेटा, धीरे-धीरे मिटती कला।",
  "Scan for the full story →": "पूरी कहानी के लिए स्कैन करें →",
  "The Potter": "कुम्हार",
  "Shyam Prajapati · Bhadaini": "श्याम प्रजापति · भदैनी",
  "From the clay of the Ganga's banks, the kumhars throw the kulhads that give ghat chai its earth-smell. Shaped in seconds, used once, returned to the earth.": "गंगा किनारे की मिट्टी से कुम्हार वे कुल्हड़ गढ़ते हैं जो घाट की चाय को माटी की गंध देते हैं। पल में बनते, एक बार बरते, मिट्टी को लौटते।",
  "Shaped from the river, returned to it.": "नदी से गढ़ी, नदी को लौटाई।",
  "The potter's dawn — clay pulled from the Ganga's banks, a wheel older than memory, a cup used once.": "कुम्हार की भोर — गंगा किनारे की मिट्टी, स्मृति से पुराना चाक, एक बार बरता कुल्हड़।",

  "Sarnath, and farewell": "सारनाथ, और विदाई",
  "Travel to Sarnath — the deer park": "सारनाथ चलिए — मृगदाव",
  "Where the Buddha first taught: ten miles, and a world, away.": "जहाँ बुद्ध ने पहला उपदेश दिया: दस मील, और एक दुनिया, दूर।",
  "Circle the Dhamek Stupa in silence": "धमेक स्तूप की मौन परिक्रमा कीजिए",
  "Fifteen hundred years of stone, and a great stillness.": "पंद्रह सौ वर्षों का पत्थर, और गहरा सन्नाटा।",
  "Meet the Ashoka lion capital": "अशोक की सिंह-लाट देखिए",
  "The four lions that became a nation's emblem.": "वे चार सिंह जो राष्ट्र का प्रतीक बने।",
  "Walk one last unfamous lane": "एक आख़िरी अनजान गली में टहलिए",
  "Say goodbye to the city the slow way.": "शहर को धीरे से विदा कहिए।",
  "Float a diya on the Ganga, and let go": "गंगा में दीया बहाइए, और छोड़ दीजिए",
  "Leave a little light on the water behind you.": "अपने पीछे पानी पर थोड़ी रोशनी छोड़ जाइए।",

  "Your Kashi": "आपकी काशी",
  "Did you…": "क्या आपने…",
  "Enter Kashi Vishwanath": "काशी विश्वनाथ के दर्शन किए",
  "Take a boat at first light": "पहली रोशनी में नाव ली",
  "Drink chai from a clay kulhad": "मिट्टी के कुल्हड़ में चाय पी",
  "Watch a Banarasi saree being woven": "बनारसी साड़ी बुनते देखी",
  "Hear the metal-beaters of Thatheri Bazar": "ठठेरी बाज़ार के ठठेरे सुने",
  "Eat a Banarasi paan": "बनारसी पान खाया",
  "Stand at the Dhamek Stupa, Sarnath": "सारनाथ के धमेक स्तूप पर खड़े हुए",
  "Float a diya at dusk": "साँझ को दीया प्रवाहित किया",

  "Your memories": "आपकी यादें",
  "The city, in your hand": "शहर, आपकी हथेली में",
  "Paste the moments you want to keep.": "जिन पलों को सहेजना चाहें, उन्हें चिपकाएँ।",

  "If the city turns": "अगर शहर उलझा दे",
  "You are never lost": "आप कभी खोए नहीं हैं",
  "A lane will end where you were sure it turned. A temple will be closed. This is not the plan failing — it is the city being itself.": "गली वहीं ख़त्म होगी जहाँ आपको मोड़ का यक़ीन था। कोई मंदिर बंद मिलेगा। यह योजना की चूक नहीं — यह शहर का अपना स्वभाव है।",
  "When it happens, take out your phone. A real guide who knows this exact corner will walk the next step with you, live.": "ऐसा हो तो फ़ोन निकालिए। इसी कोने को जानने वाला एक असली मार्गदर्शक अगला क़दम आपके साथ चलेगा, तुरंत।",
  "Lost right now? Scan this. Tell us where you're standing — we'll tell you exactly what to do, and where to go next.": "अभी खो गए? इसे स्कैन करें। बताइए आप कहाँ खड़े हैं — हम ठीक-ठीक बताएँगे क्या करें, और कहाँ जाएँ।",
  "Scan if you're lost →": "खो जाएँ तो स्कैन करें →",
};

// ── తెలుగు (headers only — machine, unverified) ──
export const TE: Dict = {
  "Varanasi · Three Days": "వారాణసి · మూడు రోజులు",
  "Three Days · A Guided Workbook": "మూడు రోజులు · ఒక మార్గదర్శక పుస్తకం",
  "For the traveller who has three days — and does not want to waste one.": "మూడు రోజులున్న ప్రయాణికుడి కోసం — ఒక్క రోజునూ వృథా చేయకూడదనుకునేవాడి కోసం.",
  "How to use this book": "ఈ పుస్తకాన్ని ఎలా వాడాలి",
  "It becomes yours": "ఇది మీదే అవుతుంది",
  "The journey": "ప్రయాణం",
  "Three days of Kashi": "కాశీ మూడు రోజులు",
  "Day One": "మొదటి రోజు",
  "Day Two": "రెండవ రోజు",
  "Day Three": "మూడవ రోజు",
  "Your first hours": "మీ మొదటి గంటలు",
  "Early morning": "తెల్లవారుజాము",
  "Afternoon": "మధ్యాహ్నం",
  "Evening": "సాయంత్రం",
  "You are entering Kashi": "మీరు కాశీలోకి అడుగుపెడుతున్నారు",
  "The evening fire": "సాయంకాల అగ్ని",
  "The makers' hands": "చేతివృత్తుల చేతులు",
  "One last look": "చివరి చూపు",
  "The lanes, the makers, the flavours": "సందులు, చేతివృత్తులు, రుచులు",
  "Sarnath, and farewell": "సారనాథ్, మరియు వీడ్కోలు",
  "The Weaver": "నేతకారుడు",
  "The Potter": "కుమ్మరి",
  "Your Kashi": "మీ కాశీ",
  "Did you…": "మీరు చేశారా…",
  "Your memories": "మీ జ్ఞాపకాలు",
  "If the city turns": "నగరం తికమక పెడితే",
  "You are never lost": "మీరు ఎప్పటికీ తప్పిపోరు",
};
