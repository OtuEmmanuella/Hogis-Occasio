// ============================================================
// ALL NIGERIAN PUBLIC HOLIDAYS + INTERNATIONALLY RECOGNISED
// DATES ACCURATE FOR 2026
// Islamic dates calculated for 2026 (approx, moon-sighting based)
// Christian dates calculated for 2026 (Easter = April 5, 2026)
// ============================================================

export type HolidayData = {
  name: string
  date: string        // YYYY-MM-DD
  country_code: string
  type: 'national' | 'religious' | 'cultural' | 'custom'
  emoji: string
  defaultMessage: string
  isPublicHoliday: boolean
}

// ─────────────────────────────────────────────
// OFFICIAL NIGERIAN FEDERAL GOVERNMENT HOLIDAYS
// ─────────────────────────────────────────────
export const NIGERIA_PUBLIC_HOLIDAYS_2026: HolidayData[] = [
  {
    name: "New Year's Day",
    date: "2026-01-01",
    country_code: "NG", type: "national", emoji: "🎆", isPublicHoliday: true,
    defaultMessage: "Happy New Year 2026! 🎆 May this new year bring you abundant joy, renewed strength, and unstoppable progress. From all of us at Hogis, we celebrate you!",
  },
  {
    name: "Eid al-Fitr (Sallah)",
    date: "2026-03-20",
    country_code: "NG", type: "religious", emoji: "🌙", isPublicHoliday: true,
    defaultMessage: "Eid Mubarak! 🌙✨ As Ramadan concludes, may Allah accept your prayers, fasting, and good deeds. Wishing you and your entire family a joyous Eid celebration!",
  },
  {
    name: "Eid al-Fitr Holiday",
    date: "2026-03-21",
    country_code: "NG", type: "religious", emoji: "🌙", isPublicHoliday: true,
    defaultMessage: "Eid Mubarak! 🌙 Continuing the celebrations — may the blessings of this Eid remain with you and your loved ones throughout the year. Taqabbalallahu minna wa minkum.",
  },
  {
    name: "Good Friday",
    date: "2026-04-03",
    country_code: "NG", type: "religious", emoji: "✝️", isPublicHoliday: true,
    defaultMessage: "Good Friday Greetings. Today we reflect on sacrifice, love, and redemption. May this holy day bring you peace and spiritual renewal. God bless you.",
  },
  {
    name: "Easter Monday",
    date: "2026-04-06",
    country_code: "NG", type: "religious", emoji: "🌅", isPublicHoliday: true,
    defaultMessage: "Happy Easter! He is Risen! 🌅✨ May the joy and hope of the resurrection season fill your life with light, new beginnings, and lasting peace!",
  },
  {
    name: "Workers' Day",
    date: "2026-05-01",
    country_code: "NG", type: "national", emoji: "⚒️", isPublicHoliday: true,
    defaultMessage: "Happy Workers' Day! ⚒️ Your dedication, resilience, and hard work are the true backbone of our nation. Today we honor every working Nigerian. You are valued!",
  },
  {
    name: "Eid al-Adha (Ileya)",
    date: "2026-05-27",
    country_code: "NG", type: "religious", emoji: "🕌", isPublicHoliday: true,
    defaultMessage: "Eid ul-Adha Mubarak! 🕌 May this blessed occasion of sacrifice bring you peace, happiness, and prosperity. Taqabbalallahu minna wa minkum!",
  },
  {
    name: "Eid al-Adha Holiday",
    date: "2026-05-28",
    country_code: "NG", type: "religious", emoji: "🕌", isPublicHoliday: true,
    defaultMessage: "Eid ul-Adha Mubarak! 🕌 As the celebrations continue, may the spirit of sacrifice and unity guide your heart. Blessed Ileya from the Hogis family!",
  },
  {
    name: "Democracy Day",
    date: "2026-06-12",
    country_code: "NG", type: "national", emoji: "🇳🇬", isPublicHoliday: true,
    defaultMessage: "Happy Democracy Day! 🇳🇬 We celebrate Nigeria's democratic journey and the power of every Nigerian voice. Long live the Federal Republic of Nigeria!",
  },
  {
    name: "Independence Day",
    date: "2026-10-01",
    country_code: "NG", type: "national", emoji: "🦅", isPublicHoliday: true,
    defaultMessage: "Happy Independence Day Nigeria! 🇳🇬🦅 We celebrate 66 years of sovereignty and the indomitable spirit of our great nation. Nigeria will be great!",
  },
  {
    name: "Christmas Day",
    date: "2026-12-25",
    country_code: "NG", type: "religious", emoji: "🎄", isPublicHoliday: true,
    defaultMessage: "Merry Christmas! 🎄✨ May the peace, love, and joy of this season fill your home and heart. Wishing you a truly blessed Christmas from the entire Hogis family!",
  },
  {
    name: "Boxing Day",
    date: "2026-12-26",
    country_code: "NG", type: "national", emoji: "🎁", isPublicHoliday: true,
    defaultMessage: "Happy Boxing Day! 🎁 A day of generosity, gratitude, and celebration. May your spirit of giving return to you manifold. Enjoy the extended holiday season!",
  },
]

// ─────────────────────────────────────────────
// INTERNATIONALLY RECOGNISED DAYS (2026)
// ─────────────────────────────────────────────
export const INTERNATIONAL_DAYS_2026: HolidayData[] = [
  {
    name: "New Year's Eve",
    date: "2026-12-31",
    country_code: "INTL", type: "cultural", emoji: "🥂", isPublicHoliday: false,
    defaultMessage: "Happy New Year's Eve! 🥂✨ As we count down the final hours of 2026, cheers to new beginnings — see you on the other side!",
  },
  {
    name: "Valentine's Day",
    date: "2026-02-14",
    country_code: "INTL", type: "cultural", emoji: "❤️", isPublicHoliday: false,
    defaultMessage: "Happy Valentine's Day! ❤️💕 May this day remind you of all the beautiful love that surrounds you. Sending warmth from the entire Hogis family!",
  },
  {
    name: "International Women's Day",
    date: "2026-03-08",
    country_code: "INTL", type: "cultural", emoji: "👩‍💼", isPublicHoliday: false,
    defaultMessage: "Happy International Women's Day! 🌸 To every woman who leads, nurtures, dares, and inspires — today the whole world celebrates YOU!",
  },
  {
    name: "World Water Day",
    date: "2026-03-22",
    country_code: "INTL", type: "cultural", emoji: "💧", isPublicHoliday: false,
    defaultMessage: "Happy World Water Day! 💧 Water is life. Today we celebrate and reflect on the importance of clean water for every human being.",
  },
  {
    name: "Earth Day",
    date: "2026-04-22",
    country_code: "INTL", type: "cultural", emoji: "🌍", isPublicHoliday: false,
    defaultMessage: "Happy Earth Day! 🌍🌿 Our planet is our home. Today we commit to protecting and celebrating the beautiful earth we share. Go green!",
  },
  {
    name: "Africa Day",
    date: "2026-05-25",
    country_code: "INTL", type: "cultural", emoji: "✊", isPublicHoliday: false,
    defaultMessage: "Happy Africa Day! 🌍✊ Celebrating the rich culture, resilience, and limitless potential of the African continent. Nigeria stands proud as the Giant of Africa!",
  },
  {
    name: "International Children's Day",
    date: "2026-06-01",
    country_code: "INTL", type: "cultural", emoji: "🧒", isPublicHoliday: false,
    defaultMessage: "Happy Children's Day! 🧒🎈 Every child deserves love, education, and a bright future. Today we celebrate the joy and limitless potential of every child!",
  },
  {
    name: "World Environment Day",
    date: "2026-06-05",
    country_code: "INTL", type: "cultural", emoji: "🌿", isPublicHoliday: false,
    defaultMessage: "Happy World Environment Day! 🌿 Let's commit to sustainable living, cleaner communities, and protecting nature for future generations.",
  },
  {
    name: "World Youth Day",
    date: "2026-08-12",
    country_code: "INTL", type: "cultural", emoji: "🎓", isPublicHoliday: false,
    defaultMessage: "Happy World Youth Day! 🎓✨ Nigeria's youth are our greatest asset. Empowered, skilled, and unstoppable — the future belongs to you!",
  },
  {
    name: "Nelson Mandela Day",
    date: "2026-07-18",
    country_code: "INTL", type: "cultural", emoji: "✊", isPublicHoliday: false,
    defaultMessage: "Happy Mandela Day! ✊ Honour one of Africa's greatest sons today. Give 67 minutes of service to someone in need. Ubuntu — I am because we are.",
  },
  {
    name: "World Humanitarian Day",
    date: "2026-08-19",
    country_code: "INTL", type: "cultural", emoji: "🤝", isPublicHoliday: false,
    defaultMessage: "Happy World Humanitarian Day! 🤝 Celebrating those who serve others in need. True humanity is giving without expecting anything in return.",
  },
  {
    name: "World Tourism Day",
    date: "2026-09-27",
    country_code: "INTL", type: "cultural", emoji: "✈️", isPublicHoliday: false,
    defaultMessage: "Happy World Tourism Day! ✈️🌍 Explore, discover, and celebrate the beauty of human diversity. Nigeria is a treasure — from Yankari to Idanre Hills!",
  },
  {
    name: "Halloween",
    date: "2026-10-31",
    country_code: "INTL", type: "cultural", emoji: "🎃", isPublicHoliday: false,
    defaultMessage: "Happy Halloween! 🎃👻 May your day be filled with treats (not tricks!) and spooky fun. From the Hogis family — have a frighteningly good time!",
  },
  {
    name: "World Children's Day (UN)",
    date: "2026-11-20",
    country_code: "INTL", type: "cultural", emoji: "🌈", isPublicHoliday: false,
    defaultMessage: "Happy World Children's Day! 🌈 The UN reaffirms its commitment to the rights and wellbeing of every child on earth. Love a child today!",
  },
  {
    name: "World AIDS Day",
    date: "2026-12-01",
    country_code: "INTL", type: "cultural", emoji: "🎗️", isPublicHoliday: false,
    defaultMessage: "World AIDS Day. 🎗️ A day of solidarity with those living with HIV/AIDS. Let's fight stigma, promote testing, and support one another. Together we end AIDS.",
  },
  {
    name: "Human Rights Day",
    date: "2026-12-10",
    country_code: "INTL", type: "cultural", emoji: "⚖️", isPublicHoliday: false,
    defaultMessage: "Happy Human Rights Day! ⚖️ Every person — regardless of tribe, religion, or status — deserves dignity, freedom, and justice. Let's protect each other.",
  },
  {
    name: "New Year's Eve 2026",
    date: "2026-12-31",
    country_code: "INTL", type: "cultural", emoji: "🥂", isPublicHoliday: false,
    defaultMessage: "Happy New Year's Eve 2026! 🥂✨ What a year it has been! As we count down to 2027, may your next chapter be your best one yet. Cheers!",
  },
]

// ─────────────────────────────────────────────
// NIGERIAN CULTURAL FESTIVALS
// ─────────────────────────────────────────────
export const NIGERIA_CULTURAL_2026: HolidayData[] = [
  {
    name: "Argungu Fishing Festival",
    date: "2026-02-20",
    country_code: "NG", type: "cultural", emoji: "🎣", isPublicHoliday: false,
    defaultMessage: "Happy Argungu Fishing Festival! 🎣 One of Nigeria's most iconic cultural events, celebrating the heritage and community spirit of Kebbi State. Proud to be Nigerian!",
  },
  {
    name: "Eyo Festival (Lagos)",
    date: "2026-04-11",
    country_code: "NG", type: "cultural", emoji: "🎭", isPublicHoliday: false,
    defaultMessage: "Happy Eyo Festival! 🎭 Lagos comes alive with spectacular Yoruba masquerades and cultural pride. Lagos is life — Nigeria is culture!",
  },
  {
    name: "Durbar Festival",
    date: "2026-06-14",
    country_code: "NG", type: "cultural", emoji: "🐎", isPublicHoliday: false,
    defaultMessage: "Happy Durbar Festival! 🐎 A magnificent display of northern Nigerian emirate culture, royal pageantry, and proud heritage. One Nigeria!",
  },
  {
    name: "New Yam Festival (Iri Ji)",
    date: "2026-08-15",
    country_code: "NG", type: "cultural", emoji: "🌽", isPublicHoliday: false,
    defaultMessage: "Happy New Yam Festival! 🌽 Iri Ji is a joyous Igbo celebration of harvest and thanksgiving. Onye wetara oji wetara ndụ — one who brings kola brings life!",
  },
  {
    name: "Osun-Osogbo Festival",
    date: "2026-08-07",
    country_code: "NG", type: "cultural", emoji: "🌊", isPublicHoliday: false,
    defaultMessage: "Happy Osun-Osogbo Festival! 🌊 A UNESCO World Heritage celebration honoring the Yoruba goddess of fertility. Nigeria's cultural heritage is priceless!",
  },
  {
    name: "Calabar Carnival",
    date: "2026-12-01",
    country_code: "NG", type: "cultural", emoji: "🎉", isPublicHoliday: false,
    defaultMessage: "Happy Calabar Carnival! 🎉 Africa's biggest street party kicks off — a month of colour, costumes, music, and pure Nigerian energy. Cross River State, we celebrate you!",
  },
]

// ─────────────────────────────────────────────
// COMBINED & SORTED
// ─────────────────────────────────────────────
export const ALL_HOLIDAYS_2026: HolidayData[] = [
  ...NIGERIA_PUBLIC_HOLIDAYS_2026,
  ...INTERNATIONAL_DAYS_2026,
  ...NIGERIA_CULTURAL_2026,
].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

/** Exact days from today (midnight) to the holiday */
export function daysUntilHoliday(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const holiday = new Date(dateStr)
  holiday.setHours(0, 0, 0, 0)
  return Math.round((holiday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/** Returns upcoming holidays within the next N days, sorted by date */
export function getUpcomingHolidays(withinDays = 60): HolidayData[] {
  return ALL_HOLIDAYS_2026.filter(h => {
    const d = daysUntilHoliday(h.date)
    return d >= 0 && d <= withinDays
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/** Format a date nicely: "Fri, 25 Dec 2026" */
export function formatHolidayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}