const merchantMap = {
  NETFLIX: "Netflix",
  "PAYPAL *NETFLIX": "Netflix",
  "NETFLIX.COM": "Netflix",

  SPOTIFY: "Spotify",
  "SPOTIFY USA": "Spotify",

  AMAZON: "Amazon",
  "AMAZON PRIME": "Amazon Prime",

  GOOGLE: "Google",
  "GOOGLE ONE": "Google One",

  DROPBOX: "Dropbox",

  APPLE: "Apple",
  "APPLE.COM": "Apple",
  "APPLE SERVICES": "Apple",

  MICROSOFT: "Microsoft",
  MSFT: "Microsoft",
  OFFICE365: "Microsoft 365",

  ADOBE: "Adobe",

  OPENAI: "OpenAI",
  CHATGPT: "ChatGPT",
};

const normalizeMerchant = (merchant = "") => {
  const value = merchant.toUpperCase().trim();

  for (const key in merchantMap) {
    if (value.includes(key)) {
      return merchantMap[key];
    }
  }

  return merchant.trim();
};

module.exports = {
  normalizeMerchant,
};