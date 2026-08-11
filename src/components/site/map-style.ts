// SamsKruti dark-earth Google Maps style
// Matches the deep-earth / terracotta / ochre palette
export const SAMSKRUTI_DARK: google.maps.MapTypeStyle[] = [
  // ── Base ─────────────────────────────────────────────
  { elementType: "geometry",             stylers: [{ color: "#0A0807" }] },
  { elementType: "labels.text.stroke",   stylers: [{ color: "#0A0807" }] },
  { elementType: "labels.text.fill",     stylers: [{ color: "#6B5A4A" }] },

  // ── Administrative borders ────────────────────────────
  { featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3A2818" }, { weight: 0.6 }] },
  { featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#5A3A20" }, { weight: 1.2 }] },
  { featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3A2818" }, { weight: 0.8 }] },
  // State & city names — ochre
  { featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#B8893E" }] },
  { featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7A6550" }] },

  // ── POIs — hide most, keep temples/ghats subtly ───────
  { featureType: "poi",                  stylers: [{ visibility: "off" }] },
  { featureType: "poi.place_of_worship",
    elementType: "labels",
    stylers: [{ visibility: "simplified" }, { color: "#C8652A" }] },
  { featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0D0B08" }] },

  // ── Roads ────────────────────────────────────────────
  { featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1F0F06" }] },
  { featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2C1F12" }] },
  { featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4A3728" }] },
  { featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#2C1F12" }] },
  { featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3A2818" }] },
  { featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2C1F12" }] },
  { featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6B5A4A" }] },
  { featureType: "road.local",
    elementType: "labels",
    stylers: [{ visibility: "off" }] },

  // ── Transit — hide ───────────────────────────────────
  { featureType: "transit",             stylers: [{ visibility: "off" }] },

  // ── Water — Ganga must be legible ────────────────────
  { featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0D1520" }] },
  { featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3D5A80" }] },

  // ── Landscape ────────────────────────────────────────
  { featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#0D0B08" }] },
  { featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#100A06" }] },
];
