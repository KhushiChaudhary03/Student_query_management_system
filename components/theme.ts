export const C = {
  bg0: "#07111F",
  bg1: "#0D1B2E",
  bg2: "#13263D",
  bg3: "#1A3350",
  bgSoft: "#0F2137",

  border: "#214162",
  borderLight: "#31567D",

  t1: "#F4F8FF",
  t2: "#AAC0DA",
  t3: "#6D87A7",

  accent: "#3B82F6",
  accentDim: "#3B82F622",
  accentText: "#D9E8FF",
  accentAlt: "#22C55E",
  accentAltDim: "#22C55E1A",
  rose: "#F43F5E",
  roseDim: "#F43F5E1A",
  sun: "#F59E0B",
  sunDim: "#F59E0B1A",
  cyan: "#06B6D4",
  cyanDim: "#06B6D41A",

  green: "#34D399",
  greenDim: "#22C55E15",
  amber: "#FBBF24",
  amberDim: "#F59E0B15",
  red: "#F87171",
  redDim: "#EF444415",

  subjects: {
    Mathematics: ["#463218", "#FFD166"],
    Physics: ["#14395C", "#76C7FF"],
    Chemistry: ["#44215C", "#F0ABFC"],
    "Computer Science": ["#1E2D7A", "#A5B4FC"],
    "Data Structures": ["#22388A", "#7DD3FC"],
    "Computer Networks": ["#0E4D4A", "#5EEAD4"],
    "Electrical Engineering": ["#5A1E28", "#FDA4AF"],
    "Mechanical Engineering": ["#5A2F12", "#FDBA74"],
    Economics: ["#204D2E", "#86EFAC"],
    Management: ["#103C59", "#67E8F9"],
  } as Record<string, [string, string]>,
};

export const R = { xs: 6, sm: 10, md: 14, lg: 18, full: 999 };
export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };

export const T = {
  h1: { fontSize: 24, fontWeight: "800" as const, color: C.t1, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: "700" as const, color: C.t1 },
  h3: { fontSize: 15, fontWeight: "700" as const, color: C.t1, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: "400" as const, color: C.t2, lineHeight: 21 },
  small: { fontSize: 12, fontWeight: "400" as const, color: C.t3 },
  label: { fontSize: 11, fontWeight: "700" as const, color: C.t3, letterSpacing: 0.8, textTransform: "uppercase" as const },
  cap: { fontSize: 11, fontWeight: "600" as const, color: C.t2 },
};
