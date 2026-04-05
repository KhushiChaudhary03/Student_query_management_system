export const C = {
  // Backgrounds
  bg0: "#0B1120",     // deepest bg — page
  bg1: "#111827",     // screen surface
  bg2: "#1F2937",     // card surface
  bg3: "#273549",     // elevated input / chip

  // Borders
  border: "#2D3B50",
  borderLight: "#374357",

  // Text
  t1: "#F9FAFB",      // primary
  t2: "#9CA3AF",      // secondary
  t3: "#4B5563",      // muted / placeholder

  // Accent — indigo/blue
  accent:     "#4F6EF7",
  accentDim:  "#4F6EF720",
  accentText: "#93AAFC",

  // Status
  green:    "#22C55E",
  greenDim: "#22C55E15",
  amber:    "#F59E0B",
  amberDim: "#F59E0B15",
  red:      "#EF4444",
  redDim:   "#EF444415",

  // Subject pill colours (bg hex, text hex)
  subjects: {
    "Mathematics":              ["#78350F20", "#FCD34D"],
    "Physics":                  ["#1E3A5F20", "#60A5FA"],
    "Chemistry":                ["#4A044E20", "#E879F9"],
    "Computer Science":         ["#1E1B4B20", "#A5B4FC"],
    "Data Structures":          ["#1E1B4B20", "#818CF8"],
    "Computer Networks":        ["#064E3B20", "#34D399"],
    "Electrical Engineering":   ["#450A0A20", "#F87171"],
    "Mechanical Engineering":   ["#43140720", "#FB923C"],
    "Economics":                ["#14532D20", "#86EFAC"],
    "Management":               ["#0C4A6E20", "#38BDF8"],
  } as Record<string, [string, string]>,
};

export const R = { xs: 6, sm: 10, md: 14, lg: 18, full: 999 };
export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };

export const T = {
  h1:    { fontSize: 24, fontWeight: "800" as const, color: C.t1, letterSpacing: -0.3 },
  h2:    { fontSize: 18, fontWeight: "700" as const, color: C.t1 },
  h3:    { fontSize: 15, fontWeight: "700" as const, color: C.t1, lineHeight: 22 },
  body:  { fontSize: 14, fontWeight: "400" as const, color: C.t2, lineHeight: 21 },
  small: { fontSize: 12, fontWeight: "400" as const, color: C.t3 },
  label: { fontSize: 11, fontWeight: "700" as const, color: C.t3, letterSpacing: 0.8, textTransform: "uppercase" as const },
  cap:   { fontSize: 11, fontWeight: "600" as const, color: C.t2 },
};
