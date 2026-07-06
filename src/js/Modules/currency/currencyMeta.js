// currencyMeta.js
// The ExchangeRate-API only gives currency codes and numbers - no names or flags.
// This file fills that gap with a lookup dictionary for the currencies we care about.

export const CURRENCY_INFO = {
  USD: { name: "US Dollar", countryCode: "us" },
  EUR: { name: "Euro", countryCode: "eu" },
  GBP: { name: "British Pound", countryCode: "gb" },
  EGP: { name: "Egyptian Pound", countryCode: "eg" },
  AED: { name: "UAE Dirham", countryCode: "ae" },
  SAR: { name: "Saudi Riyal", countryCode: "sa" },
  JPY: { name: "Japanese Yen", countryCode: "jp" },
  CAD: { name: "Canadian Dollar", countryCode: "ca" },
  INR: { name: "Indian Rupee", countryCode: "in" },
  CHF: { name: "Swiss Franc", countryCode: "ch" },
  CNY: { name: "Chinese Yuan", countryCode: "cn" },
  AUD: { name: "Australian Dollar", countryCode: "au" },
  KWD: { name: "Kuwaiti Dinar", countryCode: "kw" },
  BHD: { name: "Bahraini Dinar", countryCode: "bh" },
  OMR: { name: "Omani Rial", countryCode: "om" },
  QAR: { name: "Qatari Riyal", countryCode: "qa" },
  JOD: { name: "Jordanian Dinar", countryCode: "jo" },
  MAD: { name: "Moroccan Dirham", countryCode: "ma" },
  TRY: { name: "Turkish Lira", countryCode: "tr" },
  SEK: { name: "Swedish Krona", countryCode: "se" },
  NOK: { name: "Norwegian Krone", countryCode: "no" },
  DKK: { name: "Danish Krone", countryCode: "dk" },
  PLN: { name: "Polish Zloty", countryCode: "pl" },
  ZAR: { name: "South African Rand", countryCode: "za" },
  BRL: { name: "Brazilian Real", countryCode: "br" },
  MXN: { name: "Mexican Peso", countryCode: "mx" },
  RUB: { name: "Russian Ruble", countryCode: "ru" },
  KRW: { name: "South Korean Won", countryCode: "kr" },
  SGD: { name: "Singapore Dollar", countryCode: "sg" },
  HKD: { name: "Hong Kong Dollar", countryCode: "hk" },
  NZD: { name: "New Zealand Dollar", countryCode: "nz" },
  THB: { name: "Thai Baht", countryCode: "th" },
  IDR: { name: "Indonesian Rupiah", countryCode: "id" },
  MYR: { name: "Malaysian Ringgit", countryCode: "my" },
  PHP: { name: "Philippine Peso", countryCode: "ph" },
  VND: { name: "Vietnamese Dong", countryCode: "vn" },
  PKR: { name: "Pakistani Rupee", countryCode: "pk" },
  BDT: { name: "Bangladeshi Taka", countryCode: "bd" },
  NGN: { name: "Nigerian Naira", countryCode: "ng" },
  KES: { name: "Kenyan Shilling", countryCode: "ke" },
  ILS: { name: "Israeli Shekel", countryCode: "il" },
  LKR: { name: "Sri Lankan Rupee", countryCode: "lk" },
};

// Returns info for a currency code, or a safe fallback if it's not in our dictionary
// (the API supports 160+ currencies, we don't need to hardcode every single one)
export function getCurrencyInfo(code) {
  if (CURRENCY_INFO[code]) {
    return CURRENCY_INFO[code];
  }
  return { name: code, countryCode: null };
}

// Currencies shown in the "Quick Convert" section
export const POPULAR_CURRENCY_CODES = [
  "EUR",
  "GBP",
  "EGP",
  "AED",
  "SAR",
  "JPY",
  "CAD",
  "INR",
];

// Converts the API's "time_last_update_utc" (e.g. "Sat, 25 Jan 2026 00:00:01 +0000")
// into a readable label like "January 25, 2026"
export function formatUpdateDate(utcString) {
  const dateObj = new Date(utcString);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    monthNames[dateObj.getMonth()] +
    " " +
    dateObj.getDate() +
    ", " +
    dateObj.getFullYear()
  );
}
