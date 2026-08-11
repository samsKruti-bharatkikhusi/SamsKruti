// ── Content & Research library ────────────────────────────
// The actual store of researched content, organised by the project hierarchy:
//   District → Segment → Entry → the six facets.
// This is the data we HAVE. The internal page renders it as a collapsible
// library. Fill an entry's facets as research is done; flip `status` as it
// moves todo → researching → draft → published. When published, the entry is
// also written into src/data/districts/<city>/<segment>.json for the app.

export type FacetKey =
  | "history"
  | "memory"
  | "continuity"
  | "stories"
  | "people"
  | "experience";

export type EntryStatus = "todo" | "researching" | "draft" | "published";

// Content is bilingual from the start — English + Hindi. Language and audience
// are the focus: write each natively, not as a stiff translation.
export type LocalizedText = { en: string; hi: string };

export type EntryImage = {
  src: string;            // served from /public, e.g. /content/varanasi/<slug>/<file>
  alt: string;            // for accessibility / when the file is missing
  caption: string;        // English caption
  hindiCaption?: string;  // Hindi caption
  credit?: string;
  pending?: boolean;      // true until the actual photo is added
};

// History for a Place is not one blob — it's "why this place" plus the named
// stories mapped into it (each person/event is its own story, with an image
// prompt to generate art later).
export type StorySection = {
  id: string;
  title: string;
  hindiTitle?: string;
  en: string;
  hi: string;
  imagePrompt?: string;   // generate the image for this story later
};

export type EntryHistory = {
  intro?: LocalizedText;      // why this place / why this city
  sections: StorySection[];   // the stories mapped into it
  sources?: { label: string; url: string }[];
};

export type LibEntry = {
  name: string;
  hindiName?: string;
  slug: string;
  subject: "Place" | "Food" | "Craft";
  type?: string;                          // place type / food role / craft family
  vitality?: "Living" | "Fading" | "Endangered" | "Nearly Lost";
  status: EntryStatus;
  images?: EntryImage[];                  // at least 5 per entry
  history?: EntryHistory;                 // why this place → its stories (with image prompts)
  facets: Partial<Record<FacetKey, LocalizedText>>;
  sources?: { label: string; url: string }[];   // always links — traceable
  clipPrompt?: string;                            // prompt to generate the story clip
  connects?: { slug: string; label: string; note: string }[];   // the dots — related entries
};

export type LibSegment = {
  segment: "galiyan" | "parampara" | "hriday";
  label: string;
  color: string;
  entries: LibEntry[];
};

export type LibDistrict = {
  district: string;
  slug: string;
  origin?: EntryHistory;      // why this city exists — the root all entries trace to
  segments: LibSegment[];
};

// ── Chapter 1: the 12 Jyotirlinga ─────────────────────────
// The cities we build are the 12 Jyotirlinga, beginning with Varanasi. This is
// the chapter root — why the Jyotirlingas exist at all — above each city's origin.
export const CHAPTER_TITLE = "Chapter 1 · The 12 Jyotirlinga";

export const JYOTIRLINGA_ORIGIN: EntryHistory = {
  intro: {
    en: "Our first chapter is the twelve Jyotirlinga — the twelve places across India where Shiva is said to have appeared not as an image but as an infinite pillar of light. They are the holiest of Shiva's shrines, and they are our map: over the years we build these twelve cities, one at a time, beginning with Varanasi. To understand any of them, first understand why a 'linga of light' exists at all.",
    hi: "हमारा पहला अध्याय है बारह ज्योतिर्लिंग — भारत भर के वे बारह स्थान जहाँ शिव किसी मूर्ति के रूप में नहीं, बल्कि अनंत प्रकाश-स्तंभ के रूप में प्रकट हुए माने जाते हैं। ये शिव के सबसे पवित्र धाम हैं, और यही हमारा मानचित्र है: वर्षों में हम इन बारह नगरियों को एक-एक कर रचेंगे, वाराणसी से आरंभ करते हुए। इनमें से किसी को समझने के लिए, पहले समझें कि 'प्रकाश का लिंग' है ही क्यों।",
  },
  sections: [
    {
      id: "pillar-of-light",
      title: "The pillar of light",
      hindiTitle: "प्रकाश का स्तंभ",
      en: "The Shiva Purana tells it this way. Brahma the creator and Vishnu the preserver once quarrelled over who was supreme. To end it, Shiva pierced the three worlds as a column of fire with no beginning and no end. The two gods set out to find its limit — Vishnu diving down as the boar Varaha, Brahma flying up on his swan — and neither could reach the top or the base. The pillar was infinite. A 'jyotirlinga' is that column remembered in stone: the formless, limitless Shiva made visible so the world could find him.",
      hi: "शिव पुराण इसे यूँ कहता है। सृष्टिकर्ता ब्रह्मा और पालनकर्ता विष्णु एक बार श्रेष्ठता पर विवाद कर बैठे। इसे समाप्त करने के लिए शिव अग्नि के एक ऐसे स्तंभ के रूप में तीनों लोकों को भेद गए जिसका न आदि था न अंत। दोनों देव उसकी सीमा खोजने चले — विष्णु वराह रूप में नीचे, ब्रह्मा हंस पर ऊपर — पर न कोई शिखर पा सका, न तल। स्तंभ अनंत था। 'ज्योतिर्लिंग' वही स्तंभ है जो पत्थर में स्मरण किया जाता है: निराकार, असीम शिव को दृश्य रूप में, ताकि संसार उन्हें पा सके।",
      imagePrompt: "Cosmic Lingodbhava illustration — an infinite blazing pillar of light piercing three worlds; Vishnu as the boar Varaha diving into the depths below, Brahma on a swan ascending into the sky above, neither reaching the end; Shiva's form faint within the column; deep indigo cosmos, molten gold light, vast scale.",
    },
    {
      id: "brahma-lie-vishnu-truth",
      title: "Brahma's lie, Vishnu's truth",
      hindiTitle: "ब्रह्मा का असत्य, विष्णु का सत्य",
      en: "There is a moral folded into the light. Vishnu returned and admitted, honestly, that he had found no end. Brahma returned and lied — claiming he had reached the top, with a ketaki flower as false witness. Shiva, who is truth, cursed Brahma to have almost no worship anywhere, and blessed the honest Vishnu to be revered forever. The lesson the jyotirlinga keeps: before the infinite, the only fitting posture is humility — and a single lie can cost a god his temples.",
      hi: "इस प्रकाश में एक शिक्षा भी छिपी है। विष्णु लौटे और सच्चाई से स्वीकार किया कि उन्हें कोई अंत नहीं मिला। ब्रह्मा लौटे और झूठ बोला — कि वे शिखर तक पहुँच गए, और केतकी के फूल को झूठा साक्षी बनाया। शिव, जो स्वयं सत्य हैं, ने ब्रह्मा को शाप दिया कि उनकी कहीं पूजा न हो, और सच्चे विष्णु को सदा पूजित होने का वर दिया। ज्योतिर्लिंग यही पाठ सहेजता है: अनंत के सम्मुख एकमात्र उचित भाव है विनम्रता — और एक झूठ देवता से उसके मंदिर छीन सकता है।",
      imagePrompt: "Symbolic scene — Shiva emerging from the pillar of fire in judgement; a humbled Brahma holding a ketaki flower turning away, Vishnu bowing in honest reverence; dramatic chiaroscuro, gold and shadow, mythic gravity.",
    },
    {
      id: "twelve-points-of-light",
      title: "Twelve points of light",
      hindiTitle: "प्रकाश के बारह बिंदु",
      en: "Where that column of light touched the earth, shrines arose. Tradition counts sixty-four such places, but twelve are held supreme — the dwadasha jyotirlinga — each a distinct manifestation of the one Shiva, scattered from the Himalaya to the southern sea. Kashi Vishwanath, the heart of Varanasi, is among them. To walk the twelve is to trace the infinite as it pressed, twelve times, into stone and place.",
      hi: "जहाँ वह प्रकाश-स्तंभ धरती को छू गया, वहाँ धाम उठे। परंपरा ऐसे चौंसठ स्थान गिनती है, पर बारह सर्वोच्च माने जाते हैं — द्वादश ज्योतिर्लिंग — हर एक उसी एक शिव का भिन्न रूप, हिमालय से दक्षिण सागर तक बिखरे हुए। काशी विश्वनाथ, वाराणसी का हृदय, उन्हीं में है। बारह की यात्रा अनंत को उन बारह बिंदुओं पर खोजना है जहाँ वह पत्थर और स्थान में उतरा।",
      imagePrompt: "A dark map of India with twelve points of golden light glowing from the Himalaya to the southern coast, faint lines connecting them — a luminous map of the dwadasha jyotirlinga; reverent, cosmic-cartographic, gold on deep indigo.",
    },
  ],
  sources: [
    { label: "Jyotirlinga — Wikipedia", url: "https://en.wikipedia.org/wiki/Jyotirlinga" },
    { label: "Legend of the Jyotirlinga — The Indian Panorama", url: "https://www.theindianpanorama.news/spirituality/legend-of-the-jyotirlinga/" },
  ],
};

export const CONTENT_LIBRARY: LibDistrict[] = [
  {
    district: "Varanasi",
    slug: "varanasi",
    origin: {
      intro: {
        en: "The chapter ended where the pillar of light broke into the earth in twelve places. The foremost touched here, on a north-turning bend of the Ganga — and everything grew from it. The city took the light's own name, Kashi, 'the luminous,' and rose around the very spot where it fell — the shrine we now call Kashi Vishwanath. So the Varanasi story does not begin with a king or a trade route. It begins with that light — and from it run the histories of what happened, and why.",
        hi: "अध्याय वहीं समाप्त हुआ जहाँ प्रकाश-स्तंभ बारह स्थानों पर धरती में उतरा। उनमें सर्वप्रमुख यहीं उतरा, गंगा के उत्तर-वाहिनी मोड़ पर — और सब कुछ उसी से उपजा। नगर ने प्रकाश का ही नाम लिया, काशी, 'देदीप्यमान,' और ठीक उसी स्थान के चारों ओर उठा जहाँ वह गिरा — वह धाम जिसे आज हम काशी विश्वनाथ कहते हैं। इसलिए वाराणसी की कथा किसी राजा या व्यापार-मार्ग से नहीं शुरू होती। वह उसी प्रकाश से आरंभ होती है — और उसी से बहती हैं वे कथाएँ कि क्या हुआ, और क्यों।",
      },
      sections: [
        {
          id: "the-first-light",
          title: "The first light — the City of Light",
          hindiTitle: "प्रथम प्रकाश — प्रकाश की नगरी",
          en: "Kashi means 'to shine,' and it is no metaphor: the city is named for that very pillar of light from the chapter — the formless Shiva made visible — which is said to have first risen here. Lit, the texts say, not by the sun but by the inner light of Shiva's wisdom. To stand in Kashi is to stand where the infinite once touched the ground.",
          hi: "काशी का अर्थ है 'चमकना,' और यह कोई उपमा नहीं: नगर का नाम उसी प्रकाश-स्तंभ पर है जिसकी बात अध्याय में हुई — निराकार शिव का दृश्य रूप — जो कहा जाता है कि सर्वप्रथम यहीं उठा। शास्त्र कहते हैं, सूर्य से नहीं, बल्कि शिव के ज्ञान के भीतरी प्रकाश से प्रकाशित। काशी में खड़ा होना वहाँ खड़ा होना है जहाँ अनंत ने कभी धरती को छुआ।",
          imagePrompt: "A radiant pillar of light rising from the Ganga at Kashi at dawn, ghats in silhouette, the city glowing from within rather than from the sun; ethereal, luminous; soft gold and white.",
        },
        {
          id: "between-two-rivers",
          title: "Between two rivers",
          hindiTitle: "दो नदियों के बीच",
          en: "If Kashi is the soul-name given by the light, Varanasi is the body-name given by the land. The old city sits on the Ganga's rare north-turning crescent, cradled between two small rivers — the Varuna to the north, the Asi to the south. Varuna + Asi = Varanasi. The light chose the spot; the rivers drew its edges.",
          hi: "यदि काशी प्रकाश से मिला आत्मा-नाम है, तो वाराणसी भूमि से मिला देह-नाम। पुराना नगर गंगा के दुर्लभ उत्तर-वाहिनी अर्धचंद्र पर बसा है, दो छोटी नदियों के बीच — उत्तर में वरुणा, दक्षिण में असि। वरुणा + असि = वाराणसी। प्रकाश ने स्थान चुना; नदियों ने उसकी सीमाएँ खींचीं।",
          imagePrompt: "Aerial map-like view of old Varanasi on the Ganga's north-turning crescent, the Varuna river entering at the north and the Asi stream at the south, the dense old city between; warm cartographic-meets-photographic style.",
        },
        {
          id: "city-of-liberation",
          title: "The city of liberation",
          hindiTitle: "मुक्ति की नगरी",
          en: "Why would the infinite touch down here, of all places? Tradition gives an answer: so that mortals could be freed. Kashi is the great crossing — the one city where death itself is auspicious. To die here is to be released from the cycle of rebirth, for Shiva whispers the taraka, the ferry-mantra, into the ear of the dying. The light that made the city is also its parting gift.",
          hi: "अनंत यहीं, सब स्थानों में से, क्यों उतरे? परंपरा उत्तर देती है: ताकि मरणधर्मा मुक्त हो सकें। काशी महान तीर्थ है — वह एकमात्र नगरी जहाँ मृत्यु भी शुभ है। यहाँ मरना जन्म-चक्र से मुक्त होना है, क्योंकि शिव मरणासन्न के कान में तारक — पार उतारने वाला मंत्र — फूँकते हैं। जिस प्रकाश ने नगर रचा, वही उसका विदाई-वरदान भी है।",
          imagePrompt: "A quiet, reverent scene at a Varanasi cremation ghat at dawn — rising smoke, the Ganga, an old figure in white watching; dignified and peaceful rather than morbid; muted warm tones, contemplative.",
        },
        {
          id: "the-city-that-never-dies",
          title: "The city that never dies",
          hindiTitle: "वह नगरी जो कभी नहीं मरती",
          en: "Light does not perish, and neither, the city believes, does Kashi. Tradition says Shiva holds it aloft on his trident, above even the dissolution of the worlds, so that when everything ends, Kashi alone remains. On the ground this reads as simple endurance — one of the oldest living cities on earth, inhabited without a break for three thousand years and more. Broken and rebuilt, it has never once stopped being itself.",
          hi: "प्रकाश नष्ट नहीं होता, और न ही, नगर का विश्वास है, काशी। परंपरा कहती है कि शिव इसे अपने त्रिशूल पर धारण किए हैं, लोकों के प्रलय से भी ऊपर, ताकि जब सब समाप्त हो, अकेली काशी बची रहे। धरातल पर यह सीधी सहनशीलता है — पृथ्वी की सबसे पुरानी जीवित नगरियों में एक, तीन हज़ार वर्षों से भी अधिक से अविच्छिन्न बसी। टूटी और फिर बनी, पर एक बार भी स्वयं होना नहीं छोड़ा।",
          imagePrompt: "Mythic cosmic illustration — the city of Kashi resting upon Lord Shiva's upheld trishula above the swirling waters of dissolution, ghats and temple spires glowing, Shiva serene behind; deep indigo and gold, devotional, vast scale.",
        },
      ],
      sources: [
        { label: "Varanasi — Wikipedia", url: "https://en.wikipedia.org/wiki/Varanasi" },
        { label: "Kashi — where Varuna & Asi meet the Ganga — Holy Dham", url: "https://www.holydham.com/the-kasi-where-river-varuna-asi-merges-with-ganges/" },
      ],
    },
    segments: [
      {
        segment: "galiyan",
        label: "Sheher Ki Galiyan — Places",
        color: "#3D7050",
        entries: [
          {
            name: "Kashi Vishwanath Temple",
            hindiName: "काशी विश्वनाथ",
            slug: "kashi-vishwanath",
            subject: "Place",
            type: "Temples & Shrines",
            vitality: "Living",
            status: "draft",
            history: {
              intro: {
                en: "If the chapter's pillar of light touched the earth twelve times, in Varanasi it touched here. Kashi Vishwanath is the city's Jyotirlinga — Shiva as Vishwanath, 'Lord of the Universe' — and the still point the whole city turns around. The Varanasi story begins at this shrine; every lane, ghat, and rite is, in some sense, a path to or from it.",
                hi: "यदि अध्याय का प्रकाश-स्तंभ धरती को बारह बार छू गया, तो वाराणसी में वह यहीं उतरा। काशी विश्वनाथ नगरी का ज्योतिर्लिंग है — शिव विश्वनाथ रूप में, 'विश्व के स्वामी' — और वह स्थिर केंद्र जिसके चारों ओर पूरा नगर घूमता है। वाराणसी की कथा इसी मंदिर से आरंभ होती है; हर गली, घाट और अनुष्ठान, किसी न किसी रूप में, इसी की ओर या इसी से एक राह है।",
              },
              sections: [
                {
                  id: "where-the-light-touched",
                  title: "Vishwanath — where the light touched",
                  hindiTitle: "विश्वनाथ — जहाँ प्रकाश उतरा",
                  en: "Of the twelve places where Shiva rose as the endless column of light, this is the one in Kashi. Here he is Vishwanath, Vishweshwara — 'Lord of the Universe.' The temple is small, but it is the axis: pilgrims hold that a single darshan here, or a death within its city, carries the soul across. The infinite, the chapter said, pressed into stone and place — and in Varanasi, this is the stone, this is the place.",
                  hi: "बारह स्थानों में जहाँ शिव अनंत प्रकाश-स्तंभ के रूप में उठे, काशी का स्थान यही है। यहाँ वे विश्वनाथ हैं, विश्वेश्वर — 'विश्व के स्वामी।' मंदिर छोटा है, पर यही धुरी है: तीर्थयात्री मानते हैं कि यहाँ एक दर्शन, या इस नगरी में मृत्यु, आत्मा को पार ले जाती है। अनंत, अध्याय ने कहा था, पत्थर और स्थान में उतरा — और वाराणसी में, यही पत्थर है, यही स्थान।",
                  imagePrompt: "The inner sanctum of Kashi Vishwanath — a dark stone Shiva-linga bathed in milk, marigold and bilva leaves, a golden spire above catching light, devotees' hands reaching in; intimate, sacred, gold and shadow, candle-lit reverence.",
                },
                {
                  id: "destroyed-and-raised-again",
                  title: "Destroyed, and raised again",
                  hindiTitle: "ध्वस्त, और फिर खड़ा",
                  en: "No shrine in India has been broken and rebuilt as often as this one. In 1669 the Mughal emperor Aurangzeb demolished the temple, and the Gyanvapi Mosque rose on the old site by 1678. For over a century there was no temple — until 1780, when Ahilyabai Holkar, the Maratha queen of Indore, built the present shrine beside the mosque. In 1835 Maharaja Ranjit Singh of the Sikh Empire gave a tonne of gold to plate its spire — the 'Golden Temple' of Kashi. A jyotirlinga, the city insists, cannot finally be destroyed; it only waits to be raised again.",
                  hi: "भारत में किसी धाम को इतनी बार नहीं तोड़ा और फिर बनाया गया जितना इसे। 1669 में मुगल बादशाह औरंगज़ेब ने मंदिर ध्वस्त किया, और 1678 तक पुराने स्थल पर ज्ञानवापी मस्जिद खड़ी हो गई। एक सदी से अधिक कोई मंदिर नहीं रहा — जब तक 1780 में इंदौर की मराठा रानी अहिल्याबाई होल्कर ने मस्जिद के पास वर्तमान मंदिर बनवाया। 1835 में सिख साम्राज्य के महाराजा रणजीत सिंह ने इसके शिखर पर सोना मढ़ने के लिए एक टन स्वर्ण दिया — काशी का 'स्वर्ण मंदिर।' नगर का विश्वास है: ज्योतिर्लिंग अंततः नष्ट नहीं किया जा सकता; वह केवल फिर उठने की प्रतीक्षा करता है।",
                  imagePrompt: "The golden spire of Kashi Vishwanath rising above the dense rooftops of the old city at sunrise, gold gleaming, narrow lanes and other temple tops around; historical-documentary realism, warm light, a sense of endurance.",
                },
                {
                  id: "the-corridor",
                  title: "The corridor — the river meets the lord",
                  hindiTitle: "कॉरिडोर — नदी और विश्वनाथ का मिलन",
                  en: "For centuries the temple sat buried deep in a maze of lanes, almost hidden. In December 2021 the Kashi Vishwanath Dham — a broad corridor — was opened, clearing a path from the temple straight down to the Ganga at the ghats. Now the river and the lord face each other directly. It changed how the city is entered: light and crowds, where there were only alleys.",
                  hi: "सदियों तक मंदिर गलियों की भूलभुलैया में गहरे, लगभग छिपा बैठा रहा। दिसंबर 2021 में काशी विश्वनाथ धाम — एक चौड़ा कॉरिडोर — खुला, जिसने मंदिर से सीधे घाटों पर गंगा तक राह बना दी। अब नदी और विश्वनाथ आमने-सामने हैं। इसने नगर में प्रवेश का ढंग बदल दिया: जहाँ केवल तंग गलियाँ थीं, वहाँ अब प्रकाश और जनसमूह।",
                  imagePrompt: "The modern Kashi Vishwanath Corridor — a broad sandstone plaza connecting the golden-spired temple to the Ganga ghats, pilgrims walking, the river beyond at dusk; clean wide-angle, monumental yet reverent.",
                },
              ],
              sources: [
                { label: "Kashi Vishwanath Temple — Wikipedia (1669 · 1780 · 1835 · 2021)", url: "https://en.wikipedia.org/wiki/Kashi_Vishwanath_Temple" },
                { label: "Jyotirlinga — Wikipedia", url: "https://en.wikipedia.org/wiki/Jyotirlinga" },
              ],
            },
            facets: {
              experience: {
                en: "The spiritual centre of Varanasi, deep in Vishwanath Gali. Since the 2021 corridor you can approach from the Ganga (near Lalita / Manikarnika ghats) or through the lanes. Expect security checks and long queues — leave phones and leather behind, dress modestly; early morning (mangala aarti) and late evening are the great darshans. Pair it with a short walk to Dashashwamedh for the evening Ganga Aarti.",
                hi: "वाराणसी का आध्यात्मिक केंद्र, विश्वनाथ गली में गहरे। 2021 के कॉरिडोर के बाद आप गंगा की ओर से (ललिता / मणिकर्णिका घाट के पास) या गलियों से पहुँच सकते हैं। सुरक्षा जाँच और लंबी कतारें मिलेंगी — मोबाइल और चमड़ा साथ न रखें, शालीन वस्त्र पहनें; प्रातःकाल (मंगला आरती) और देर संध्या के दर्शन श्रेष्ठ हैं। साथ में दशाश्वमेध तक टहलें, संध्या गंगा आरती के लिए।",
              },
            },
            connects: [
              { slug: "dashashwamedh-ghat", label: "Dashashwamedh Ghat", note: "The 2021 corridor links the temple straight to the Ganga here; the evening aarti is a short walk down." },
              { slug: "divodaseshwara", label: "Divodaseshwara", note: "The linga of King Divodasa — whose liberation let Shiva, as Vishwanath, return to rule Kashi." },
              { slug: "manikarnika-ghat", label: "Manikarnika Ghat", note: "The cremation ghat nearby — where Vishwanath's promise of liberation is kept at life's end." },
            ],
          },
          {
            name: "Dashashwamedh Ghat",
            hindiName: "दशाश्वमेध घाट",
            slug: "dashashwamedh-ghat",
            subject: "Place",
            type: "Ghats & Waterfront",
            vitality: "Living",
            status: "draft",
            images: [
              { src: "/data/images/varanasi/galiyan/dashashwamedh-ghat/ganga-aarti-night.jpg",  alt: "The evening Ganga Aarti — priests with flaming lamps before a crowd", caption: "The Ganga Aarti, performed each evening", hindiCaption: "हर संध्या होने वाली गंगा आरती" },
              { src: "/data/images/varanasi/galiyan/dashashwamedh-ghat/ghat-lit-at-night.jpg",   alt: "The lit ghat and temple spires at night, seen from the river",        caption: "The ghat lit at night, from the river",   hindiCaption: "रात में जगमगाता घाट, नदी से" },
              { src: "/data/images/varanasi/galiyan/dashashwamedh-ghat/aerial-golden-hour.jpg",  alt: "Aerial view of the ghat and moored boats at golden hour",             caption: "The ghat from above at golden hour",      hindiCaption: "स्वर्णिम बेला में ऊपर से घाट" },
              { src: "/data/images/varanasi/galiyan/dashashwamedh-ghat/boats-by-day.jpg",        alt: "Boats and umbrellas along the ghat steps by day",                     caption: "Boats and umbrellas by day",              hindiCaption: "दिन में नावें और छतरियाँ" },
              { src: "/data/images/varanasi/galiyan/dashashwamedh-ghat/aerial-twilight.jpg",     alt: "Aerial view of the riverfront at twilight",                           caption: "The riverfront at twilight, from above",  hindiCaption: "साँझ में ऊपर से तट" },
            ],
            history: {
              intro: {
                en: "Kashi's most central ghat — where the lanes spill out onto the Ganga and, every dusk, the river turns to fire and prayer. Its name carries a divine bargain; its steps carry four centuries of kings and queens. Three stories live inside it.",
                hi: "काशी का सबसे केंद्रीय घाट — जहाँ गलियाँ गंगा तक उतर आती हैं और हर साँझ नदी अग्नि और प्रार्थना में बदल जाती है। इसका नाम एक दैवी सौदा समेटे है; इसकी सीढ़ियाँ चार सदियों के राजा-रानियों को। इसके भीतर तीन कहानियाँ बसती हैं।",
              },
              sections: [
                {
                  id: "divodasa-shiva-brahma",
                  title: "Divodasa, Shiva & Brahma",
                  hindiTitle: "दिवोदास, शिव और ब्रह्मा",
                  en: "When the righteous king Divodasa ruled Kashi, he won a boon from Brahma that no god might enter the city while he reigned — and ruled so perfectly that Kashi rivalled heaven. Exiled to Mount Mandara, Shiva ached for his city and sent emissary after emissary to lure the king into fault — sixty-four yoginis, then the sun-god Surya, then Brahma (who performed ten horse-sacrifices here, giving the ghat its name) — but each, enchanted by Kashi, simply stayed. The king could not be tripped. So he was not defeated — he was freed. Ganesha came disguised as an astrologer and unsettled him with one quiet truth: he had everything, yet no peace. Then Vishnu came as a teacher and led him, through discourse on the impermanence of power, into vairagya — detachment. At Vishnu's word the king installed a Shiva-linga so the lord could return; on the seventh day a celestial vimana carried Divodasa to Shiva's abode in liberation. Only then did Shiva come home. The linga the king raised still stands near this ghat, named for him — Divodaseshwara.",
                  hi: "जब धर्मनिष्ठ राजा दिवोदास काशी पर राज करते थे, उन्होंने ब्रह्मा से वर पाया कि उनके शासनकाल में कोई देव काशी में प्रवेश न करे — और उन्होंने इतना अच्छा राज किया कि काशी स्वर्ग की प्रतिद्वंद्वी बन गई। मंदराचल पर रोके गए शिव अपनी नगरी के लिए तरसते रहे और राजा को भूल कराने के लिए एक के बाद एक दूत भेजे — चौंसठ योगिनियाँ, फिर सूर्यदेव, फिर ब्रह्मा (जिन्होंने यहीं दस अश्वमेध यज्ञ किए और घाट को उसका नाम दिया) — पर हर कोई काशी पर मोहित होकर वहीं रह गया। राजा को डिगाया न जा सका। इसलिए वे पराजित नहीं हुए — वे मुक्त हुए। गणेश ज्योतिषी के वेश में आए और एक शांत सत्य से उन्हें विचलित किया: सब कुछ होते हुए भी उनके मन में शांति नहीं थी। फिर विष्णु गुरु बनकर आए और सत्ता की क्षणभंगुरता के उपदेश से उन्हें वैराग्य की ओर ले गए। विष्णु के कहने पर राजा ने शिव-लिंग की स्थापना की ताकि भगवान लौट सकें; सातवें दिन एक दिव्य विमान दिवोदास को मुक्ति देते हुए शिव-धाम ले गया। तभी शिव अपने घर लौटे। राजा का स्थापित वह लिंग आज भी इस घाट के पास है, उन्हीं के नाम पर — दिवोदासेश्वर।",
                  imagePrompt: "Mythic Indian illustration — Brahma as an aged brahmin tending a ten-horse fire-yajna on the stone steps of a Ganga ghat in Kashi at dawn; Lord Shiva watching longingly from a distant Himalayan peak; gold divine light, miniature-painting detail with cinematic depth.",
                },
                {
                  id: "raja-dushasan-shah",
                  title: "Raja Dushasan Shah — the first stone",
                  hindiTitle: "राजा दूषासन शाह — पहला पत्थर",
                  en: "Myth keeps no date; stone does. The record places the first built ghat here around 1569, under Raja Dushasan Shah. Before the lamps and the crowds, there were simply steps cut into the bank — so a city could reach its river.",
                  hi: "कथा की कोई तिथि नहीं; पत्थर की है। अभिलेखों के अनुसार यहाँ पहला निर्मित घाट लगभग 1569 में, राजा दूषासन शाह के समय बना। दीपों और भीड़ से पहले, बस तट में कटी सीढ़ियाँ थीं — ताकि एक नगर अपनी नदी तक पहुँच सके।",
                  imagePrompt: "16th-century historical scene — a regional Indian raja overseeing masons cutting the first sandstone steps of a riverside ghat on the Ganga; period dress, dust, chisels, soft morning light; grounded historical realism.",
                },
                {
                  id: "ahilyabai-holkar",
                  title: "Ahilyabai Holkar — the queen who rebuilt Kashi",
                  hindiTitle: "अहिल्याबाई होल्कर — काशी को फिर रचने वाली रानी",
                  en: "The steps you climb today are Maratha work. Peshwa Balaji Baji Rao laid the present ghat in 1748; then in 1774 Ahilyabai Holkar, the widowed queen of Indore, rebuilt it — one act in her lifelong restoration of Kashi's ghats and temples after centuries of ruin. Much of the Kashi a pilgrim loves today is her quiet gift.",
                  hi: "आज जिन सीढ़ियों पर आप चढ़ते हैं, वे मराठा निर्माण हैं। पेशवा बालाजी बाजीराव ने 1748 में वर्तमान घाट बनवाया; फिर 1774 में इंदौर की विधवा रानी अहिल्याबाई होल्कर ने इसे पुनर्निर्मित किया — सदियों के विध्वंस के बाद काशी के घाटों और मंदिरों के उनके आजीवन जीर्णोद्धार का एक अंश। आज तीर्थयात्री जिस काशी से प्रेम करते हैं, उसका बहुत कुछ उनकी मौन देन है।",
                  imagePrompt: "Dignified 18th-century portrait scene — Ahilyabai Holkar, widowed Maratha queen in simple white, directing artisans restoring the stone ghats and temple spires of Kashi by the Ganga; warm sandstone tones, period detail, reverent mood.",
                },
              ],
            },
            facets: {
              memory: {
                en: "The beating heart of the riverfront and the stage of the grand Ganga Aarti each evening — rows of young priests moving large brass lamps in unison to drums, conch, and incense, watched by thousands from the steps and from boats. At dawn the same ghat is quiet: pilgrims bathe, sadhus sit, boatmen push off for sunrise rides, and leaf-boat diyas drift on the water.",
                hi: "यह घाट वाराणसी के तट का हृदय है और हर संध्या होने वाली भव्य गंगा आरती का मंच — युवा पुजारी एक साथ बड़े पीतल के दीप घुमाते हैं, ढोल, शंख और धूप के बीच, और हज़ारों लोग सीढ़ियों तथा नावों से देखते हैं। भोर में वही घाट शांत रहता है: तीर्थयात्री स्नान करते हैं, साधु बैठते हैं, नाविक सूर्योदय की सैर पर निकलते हैं, और पत्तों के दीये जल पर बहते हैं।",
              },
              continuity: {
                en: "Thriving and heavily visited — almost too much so. The evening aarti is organised and performed daily by seva groups (e.g. Ganga Seva Nidhi) who train young pandits, so the ritual is actively transmitted, not fading. The real risk is commercialisation crowding out the quiet, private river-worship older Banarasis still keep.",
                hi: "घाट समृद्ध और अत्यधिक व्यस्त है — शायद कुछ ज़्यादा ही। संध्या आरती प्रतिदिन सेवा-समितियों (जैसे गंगा सेवा निधि) द्वारा होती है, जो युवा पंडितों को प्रशिक्षित करती हैं — इसलिए परंपरा सक्रिय रूप से आगे बढ़ रही है, मिट नहीं रही। असली ख़तरा है व्यावसायीकरण, जो बनारस के पुराने लोगों की मौन, निजी गंगा-पूजा को पीछे धकेल देता है।",
              },
              stories: {
                en: "The contrast is the story: the choreographed spectacle the cameras capture, and a few steps away an old man floating a single diya for a dead relative, asking nothing of the crowd. The boatmen families who have rowed the same stretch for generations. The flower-and-leaf diya sellers who set the river alight at dusk.",
                hi: "असली कहानी इसी विरोधाभास में है: एक ओर कैमरों में क़ैद होता भव्य तमाशा, और कुछ ही सीढ़ियाँ दूर एक बूढ़ा अपने दिवंगत के लिए अकेला दीया बहाता हुआ, भीड़ से कुछ न माँगते हुए। पीढ़ियों से उसी तट पर नाव खेते नाविक परिवार। साँझ को नदी को रोशन करते फूल-पत्ती के दीये बेचने वाले।",
              },
              people: {
                en: "The aarti pandits and the seva samiti who run it; the majhi (boatmen) families; the flower- and diya-sellers; the riverside pandas; and the pilgrims who come to bathe, pray, and immerse.",
                hi: "आरती के पंडित और उसे चलाने वाली सेवा समिति; माझी (नाविक) परिवार; फूल और दीया बेचने वाले; तटवर्ती पंडे; और स्नान, पूजा व विसर्जन के लिए आते तीर्थयात्री।",
              },
              experience: {
                en: "Visit twice: at dawn for a quiet sunrise boat ride, and at dusk for the Ganga Aarti — it runs about 45 minutes, starting near 7pm in summer and 6pm in winter. Free to watch from the steps; arrive ~45 min early, or hire a boat to watch from the water. Walk in via Godowlia / Dashashwamedh Road; short walk from Kashi Vishwanath. Crowded and lively; mind your pockets.",
                hi: "दो बार आइए: भोर में शांत सूर्योदय नौका-विहार के लिए, और साँझ को गंगा आरती के लिए — यह लगभग 45 मिनट चलती है, गर्मियों में करीब 7 बजे और सर्दियों में 6 बजे शुरू होती है। सीढ़ियों से देखना नि:शुल्क; लगभग 45 मिनट पहले पहुँचें, या नाव लेकर जल से देखें। गोदौलिया / दशाश्वमेध मार्ग से पैदल आएँ; काशी विश्वनाथ पास ही है। भीड़भाड़; जेब का ध्यान रखें।",
              },
            },
            sources: [
              { label: "Dashashwamedh Ghat — Wikipedia (dates: 1569, 1748, 1774)", url: "https://en.wikipedia.org/wiki/Dashashwamedh_Ghat" },
              { label: "Dashashwamedh Ghat — Kashi Official Portal", url: "https://kashi.gov.in/listing-details/dashashwamedh-ghat" },
              { label: "The legend of Brahma's ten yajnas & King Divodasa — Varanasi Guru", url: "https://www.varanasiguru.com/dashashwamedh-ghat/" },
              { label: "King Divodasa & Shiva's return (Ganesha, Vishnu, moksha) — Wikipedia", url: "https://en.wikipedia.org/wiki/Divodasa" },
              { label: "Ghats in Varanasi — Wikipedia", url: "https://en.wikipedia.org/wiki/Ghats_in_Varanasi" },
            ],
            clipPrompt:
              "Cinematic 20s vertical clip telling Dashashwamedh Ghat's story across one day. First light: mist on the Ganga, a lone boatman rowing, worn stone steps climbing to old temple spires. Day: bright wooden boats, marigold and diya sellers, pilgrims under umbrellas. Dusk — the grand Ganga Aarti: young priests in saffron swinging tiered brass lamps in unison, fire trails, conch and bells, thousands watching from steps and boats. Close on one leaf-diya drifting away on the dark river. Warm golden tones, incense haze, volumetric light, handheld documentary 35mm, shallow depth of field. Reverent, timeless, not touristy. On-screen line — EN: \"Two stories give this ghat its name. Both forget the date. The river never does.\" / हिं: \"इस घाट को नाम दो कथाएँ देती हैं। दोनों तिथि भूल जाती हैं। नदी कभी नहीं भूलती।\"",
            connects: [
              { slug: "divodaseshwara", label: "Divodaseshwara", note: "The Shiva-linga King Divodasa raised before his liberation — its story begins here; the shrine itself is a short walk away near Mir Ghat." },
            ],
          },
          {
            name: "Divodaseshwara",
            hindiName: "दिवोदासेश्वर",
            slug: "divodaseshwara",
            subject: "Place",
            type: "Temples & Shrines",
            vitality: "Living",
            status: "researching",
            history: {
              intro: {
                en: "An almost-hidden Shiva shrine a short walk from Mir Ghat — the linga that closes the Dashashwamedh story.",
                hi: "मीर घाट से थोड़ी ही दूर एक लगभग छिपा शिव-मंदिर — वही लिंग जो दशाश्वमेध की कथा को पूर्ण करता है।",
              },
              sections: [
                {
                  id: "the-linga-that-brought-shiva-home",
                  title: "The linga that brought Shiva home",
                  hindiTitle: "वह लिंग जो शिव को घर लाया",
                  en: "When King Divodasa, led to detachment by Vishnu, prepared to leave his kingdom, he installed a Shiva-linga so the lord could return to Kashi — and on the seventh day a celestial vimana carried the king to liberation. That linga is remembered here as Divodaseshwara, 'the lord of Divodasa.' A black stone emblem of Shiva, it shares its small shrine with Vishbahuka, a twenty-handed divinity set in a wall niche. Tradition is divided in a touching way: some say the king built it and dedicated it to Shiva; others say the king himself, deified with time, is the one worshipped here — the devotee become the deity.",
                  hi: "जब विष्णु द्वारा वैराग्य की ओर ले जाए गए राजा दिवोदास अपना राज्य छोड़ने को हुए, तब उन्होंने एक शिव-लिंग की स्थापना की ताकि भगवान काशी लौट सकें — और सातवें दिन एक दिव्य विमान राजा को मुक्ति की ओर ले गया। वही लिंग यहाँ दिवोदासेश्वर — 'दिवोदास के ईश्वर' — के रूप में स्मरण किया जाता है। काले पत्थर का यह शिव-प्रतीक अपने छोटे मंदिर में विश्वबाहु (बीस भुजाओं वाले देव) के साथ है, जो दीवार के एक आले में स्थापित हैं। परंपरा एक मार्मिक ढंग से बँटी है: कुछ कहते हैं राजा ने इसे बनवाकर शिव को समर्पित किया; कुछ कहते हैं समय के साथ देवता बने स्वयं राजा ही यहाँ पूजे जाते हैं — भक्त ही देव बन गया।",
                  imagePrompt: "A small, dim, ancient Shiva shrine in a Varanasi lane near Mir Ghat — a black stone linga draped in marigold and bilva leaves, a brass oil-lamp glowing, a twenty-armed deity carved in a wall niche behind; candle-lit, intimate, hidden, reverent — not grand.",
                },
              ],
            },
            facets: {
              experience: {
                en: "A short walk from Mir Ghat, tucked near Vishwa Bhuja Gauri / Vishalakshi. Easy to miss — come on foot through the Dashashwamedh or Bansphatak Vishwanath lanes and ask for Divodaseshwar. A quiet stop, best paired with the Vishalakshi Shakti Peetha nearby.",
                hi: "मीर घाट से थोड़ी दूर, विश्व भुजा गौरी / विशालाक्षी के पास छिपा हुआ। आसानी से छूट जाता है — दशाश्वमेध या बाँसफाटक विश्वनाथ गली से पैदल आएँ और दिवोदासेश्वर पूछें। एक शांत पड़ाव, पास की विशालाक्षी शक्तिपीठ के साथ देखें।",
              },
            },
            sources: [
              { label: "Divodaseshwar Temple — Optima Travels (location & timings)", url: "https://www.optimatravels.com/varanasi-uttar-pradesh/divodaseshwar-temple-varanasi-uttar-pradesh-india.aspx" },
              { label: "Divodaseshwar — Varanasi Temples", url: "http://varanasitemples.in/shiva-temples/divodaseshwar/" },
              { label: "Story of King Divodasa — Holy Dham", url: "https://www.holydham.com/story-of-king-divodasa-and-return-back-of-lord-shiva-to-his-own-city/" },
            ],
            connects: [
              { slug: "dashashwamedh-ghat", label: "Dashashwamedh Ghat", note: "Where the Divodasa legend that names this linga is told — and where Brahma's ten yajnas were performed." },
            ],
          },
          { name: "Manikarnika Ghat", slug: "manikarnika-ghat", subject: "Place", type: "Ghats & Waterfront", status: "todo", facets: {} },
          { name: "Assi Ghat", slug: "assi-ghat", subject: "Place", type: "Ghats & Waterfront", status: "todo", facets: {} },
          { name: "Sarnath", slug: "sarnath", subject: "Place", type: "Sacred / Pilgrim Site", status: "todo", facets: {} },
          { name: "Ramnagar Fort", slug: "ramnagar-fort", subject: "Place", type: "Monuments & Forts", status: "todo", facets: {} },
        ],
      },
      {
        segment: "parampara",
        label: "Sheher Ka Swaad — Food",
        color: "#A83828",
        entries: [
          { name: "Banarasi Paan", slug: "banarasi-paan", subject: "Food", type: "Ritual & Temple", status: "todo", facets: {} },
          { name: "Kachori Sabzi", slug: "kachori-sabzi", subject: "Food", type: "Street Invention", status: "todo", facets: {} },
          { name: "Malaiyo", slug: "malaiyo", subject: "Food", type: "Sweets & Mithai", status: "todo", facets: {} },
          { name: "Banarasi Thandai", slug: "banarasi-thandai", subject: "Food", type: "Ritual & Temple", status: "todo", facets: {} },
        ],
      },
      {
        segment: "hriday",
        label: "Sheher Ka Hriday — Crafts & Culture",
        color: "#4F76B0",
        entries: [
          { name: "Banarasi Silk Weaving", slug: "banarasi-silk", subject: "Craft", type: "Weaving & Textiles", status: "todo", facets: {} },
          { name: "Gulabi Meenakari", slug: "gulabi-meenakari", subject: "Craft", type: "Metal & Ornament", status: "todo", facets: {} },
          { name: "Wooden Lacquer Toys", slug: "wooden-lacquer-toys", subject: "Craft", type: "Wood, Leather & Folk", status: "todo", facets: {} },
        ],
      },
    ],
  },
];
