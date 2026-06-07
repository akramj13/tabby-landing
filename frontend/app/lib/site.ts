// Single source of truth for site-wide constants.

export const SITE_URL = "https://cotabby.app";
export const SITE_NAME = "Cotabby";
export const GITHUB_REPO = "FuJacob/cotabby";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
export const DOWNLOAD_URL = `${GITHUB_URL}/releases/latest/download/Cotabby.dmg`;

// Rounded-down lifetime download count, shown as hero social proof. Bump by
// hand and keep it under the real number so it stays true between updates.
export const DOWNLOAD_COUNT = 6000;

export const DISCORD_URL = "https://discord.gg/qBq5RHcruX";
export const SUPPORT_URL = "https://ko-fi.com/cotabby";
export const SUPPORT_EMAIL = "hello@cotabby.app";

export const CREATOR = {
  name: "Jacob Fu",
  linkedin: "https://www.linkedin.com/in/fujacob/",
  x: "https://x.com/fujacobb",
  xHandle: "@fujacobb",
} as const;
