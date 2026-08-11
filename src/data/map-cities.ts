// Jyotirlinga cities plotted on the India map — shared by the home-page dot
// overlay (city-dots.tsx) and the full-screen maps explorer.

export interface MapCity {
  id:       string;
  hindi:    string;
  temple:   string;
  templeHi: string;
  city:     string;
  state:    string;
  lat:      number;
  lng:      number;
  active:   boolean;
  tagline?: string;
  image?:   string;
}

export const MAP_CITIES: MapCity[] = [
  { id: "varanasi",     hindi: "वाराणसी",    temple: "Kashi Vishwanath",  templeHi: "काशी विश्वनाथ",  city: "Varanasi",     state: "Uttar Pradesh",  lat: 25.3109, lng: 83.0104, active: true,  tagline: "The world's oldest living city", image: "/data/images/varanasi/kashi-vishwanath.jpg" },
  { id: "kedarnath",    hindi: "केदारनाथ",   temple: "Kedarnath",         templeHi: "केदारनाथ",       city: "Kedarnath",    state: "Uttarakhand",    lat: 30.7346, lng: 79.0669, active: false },
  { id: "deoghar",      hindi: "देवघर",      temple: "Vaidyanath",        templeHi: "वैद्यनाथ",       city: "Deoghar",      state: "Jharkhand",      lat: 24.4922, lng: 86.6944, active: false },
  { id: "somnath",      hindi: "सोमनाथ",     temple: "Somnath",           templeHi: "सोमनाथ",         city: "Somnath",      state: "Gujarat",        lat: 20.8880, lng: 70.4014, active: false },
  { id: "dwarka",       hindi: "द्वारका",    temple: "Nageshwar",         templeHi: "नागेश्वर",       city: "Dwarka",       state: "Gujarat",        lat: 22.2394, lng: 68.9568, active: false },
  { id: "bhimashankar", hindi: "भीमाशंकर",   temple: "Bhimashankar",      templeHi: "भीमाशंकर",       city: "Bhimashankar", state: "Maharashtra",    lat: 19.0728, lng: 73.5362, active: false },
  { id: "nashik",       hindi: "नाशिक",      temple: "Trimbakeshwar",     templeHi: "त्र्यंबकेश्वर",  city: "Nashik",       state: "Maharashtra",    lat: 19.9351, lng: 73.5308, active: false },
  { id: "aurangabad",   hindi: "औरंगाबाद",   temple: "Grishneshwar",      templeHi: "घृष्णेश्वर",     city: "Aurangabad",   state: "Maharashtra",    lat: 20.0225, lng: 75.1792, active: false },
  { id: "srisailam",    hindi: "श्रीशैलम",   temple: "Mallikarjuna",      templeHi: "मल्लिकार्जुन",   city: "Srisailam",    state: "Andhra Pradesh", lat: 16.0727, lng: 78.8681, active: false },
  { id: "ujjain",       hindi: "उज्जैन",     temple: "Mahakaleshwar",     templeHi: "महाकालेश्वर",    city: "Ujjain",       state: "Madhya Pradesh", lat: 23.1828, lng: 75.7682, active: false },
  { id: "omkareshwar",  hindi: "ओंकारेश्वर", temple: "Omkareshwar",       templeHi: "ओंकारेश्वर",     city: "Omkareshwar",  state: "Madhya Pradesh", lat: 22.2456, lng: 76.1519, active: false },
  { id: "rameswaram",   hindi: "रामेश्वरम्", temple: "Ramanathaswamy",    templeHi: "रामनाथस्वामी",   city: "Rameswaram",   state: "Tamil Nadu",     lat:  9.2885, lng: 79.3129, active: false },
];
