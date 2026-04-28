/**
 * Maps an industry string to a small palette of muted, sophisticated colors.
 * Used for map pins and card accents — deliberately desaturated to keep the
 * page from looking like a kid's web form.
 */

export interface IndustryColor {
  /** Map-pin fill, also used as a small dot on cards */
  pin: string;
  /** Tinted background — large surfaces (cards on hover, hero backdrop) */
  tint: string;
  /** Foreground text color when used on tint */
  fg: string;
  /** Human label for the color group (debugging / future legend) */
  group: string;
}

const PALETTE: Record<string, IndustryColor> = {
  bronze: { pin: "#d04a17", tint: "#fdeee5", fg: "#8a3014", group: "bronze" },
  amber:  { pin: "#d4920f", tint: "#fbf2dc", fg: "#7d550d", group: "amber"  },
  rust:   { pin: "#b34530", tint: "#fbeae5", fg: "#5e2618", group: "rust"   },
  forest: { pin: "#2d7349", tint: "#eaf5ec", fg: "#214428", group: "forest" },
  sky:    { pin: "#2f7eaa", tint: "#e6f1f8", fg: "#244c66", group: "sky"    },
  navy:   { pin: "#1d4a85", tint: "#e6ecf6", fg: "#11254a", group: "navy"   },
  plum:   { pin: "#7a4276", tint: "#f3e6f0", fg: "#41263e", group: "plum"   },
  sand:   { pin: "#b8862e", tint: "#f8f0dd", fg: "#6f5320", group: "sand"   },
};

const RULES: Array<[RegExp, keyof typeof PALETTE]> = [
  [/coffee|roast|cafe|tea/i, "bronze"],
  [/brew|beer|distill|spirits|wine/i, "amber"],
  [/knife|blade|forge|cutlery|wood|leather|maker|artisan|smith/i, "rust"],
  [/construct|contract|remodel|build|carpentry|millwork/i, "rust"],
  [/farm|agricultur|syrup|honey|orchard|ranch|livestock/i, "forest"],
  [/charter|boat|marine|sail|dive|kayak|tour|eco/i, "sky"],
  [/dog|k9|train|outdoor|gear|hunt|fish|guide|range/i, "forest"],
  [/real estate|property|broker|home|realtor|mortgage|loan|lending/i, "sky"],
  [/freight|logistic|transport|trucking|shipping/i, "sky"],
  [/security|protect|defense|safety|compliance/i, "navy"],
  [/cyber|tech|software|info|data|saas|engineer|developer/i, "navy"],
  [/account|financ|cfo|cpa|tax|book|wealth|invest|advisor/i, "navy"],
  [/coach|consult|advis|strategy/i, "navy"],
  [/design|brand|creative|studio|agency|market/i, "plum"],
  [/apparel|clothing|fashion|lifestyle/i, "sand"],
  [/food|restaurant|bbq|kitchen|bakery|catering/i, "amber"],
];

export function industryColor(industry?: string): IndustryColor {
  if (!industry) return PALETTE.bronze;
  for (const [re, key] of RULES) if (re.test(industry)) return PALETTE[key];
  return PALETTE.bronze;
}
