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
  bronze: { pin: "#a8431d", tint: "#fbf3ed", fg: "#7a3115", group: "bronze" },
  amber:  { pin: "#b8801f", tint: "#fbf5e6", fg: "#7d550d", group: "amber"  },
  rust:   { pin: "#8a3a2a", tint: "#fbeee8", fg: "#5e2618", group: "rust"   },
  forest: { pin: "#2f5d3e", tint: "#eef5ee", fg: "#214428", group: "forest" },
  sky:    { pin: "#3a6a8a", tint: "#eef3f8", fg: "#244c66", group: "sky"    },
  navy:   { pin: "#1d3a5f", tint: "#eaeff5", fg: "#11254a", group: "navy"   },
  plum:   { pin: "#5d3a5a", tint: "#f3eaf2", fg: "#41263e", group: "plum"   },
  sand:   { pin: "#a07a3a", tint: "#f8f1e3", fg: "#6f5320", group: "sand"   },
};

const RULES: Array<[RegExp, keyof typeof PALETTE]> = [
  [/coffee|roast|cafe|tea/i, "bronze"],
  [/brew|beer|distill|spirits|wine/i, "amber"],
  [/knife|blade|forge|cutlery|wood|leather|maker|artisan|smith/i, "rust"],
  [/construct|contract|remodel|build|carpentry|millwork/i, "rust"],
  [/dog|k9|train|outdoor|gear|hunt|fish|guide|range/i, "forest"],
  [/real estate|property|broker|home|realtor/i, "sky"],
  [/freight|logistic|transport|trucking|shipping/i, "sky"],
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
