export const clayTones = {
  violet: { from: "#A78BFA", to: "#7C3AED", rgb: "124, 58, 237" },
  pink: { from: "#F9A8D4", to: "#DB2777", rgb: "219, 39, 119" },
  sky: { from: "#7DD3FC", to: "#0EA5E9", rgb: "14, 165, 233" },
  emerald: { from: "#6EE7B7", to: "#10B981", rgb: "16, 185, 129" },
  amber: { from: "#FCD34D", to: "#F59E0B", rgb: "245, 158, 11" },
  blue: { from: "#93C5FD", to: "#2563EB", rgb: "37, 99, 235" },
  cyan: { from: "#67E8F9", to: "#0891B2", rgb: "8, 145, 178" },
}

export const getTone = (tone) => clayTones[tone] ?? clayTones.violet

export const toneGradient = (tone) => {
  const { from, to } = getTone(tone)
  return { backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }
}

/** 4-layer clay stack for colored gradient orbs (top-left light source). */
export const clayOrbShadow = (tone) => {
  const { rgb } = getTone(tone)
  return {
    boxShadow: `12px 12px 24px rgba(${rgb}, 0.35), -8px -8px 16px rgba(255, 255, 255, 0.7), inset 4px 4px 8px rgba(255, 255, 255, 0.45), inset -4px -4px 8px rgba(0, 0, 0, 0.12)`,
  }
}

/** Pressed variant — orbs sink into the clay. */
export const clayOrbShadowPressed = (tone) => {
  const { rgb } = getTone(tone)
  return {
    boxShadow: `inset 7px 7px 14px rgba(${rgb}, 0.45), inset -7px -7px 14px rgba(255, 255, 255, 0.35)`,
  }
}
