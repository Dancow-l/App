export interface IslamicQuote {
  text: string;
  source: string;
}

export const islamicQuotes: IslamicQuote[] = [
  { text: "Indeed, with hardship comes ease.", source: "Surah Ash-Sharh 94:5" },
  { text: "And He found you lost and guided [you].", source: "Surah Ad-Duha 93:7" },
  { text: "So remember Me; I will remember you.", source: "Surah Al-Baqarah 2:152" },
  { text: "And Allah is the best of providers.", source: "Surah Al-Jumu'ah 62:11" },
  { text: "Verily, in the remembrance of Allah do hearts find rest.", source: "Surah Ar-Ra'd 13:28" },
  { text: "And Allah is with the patient.", source: "Surah Al-Baqarah 2:153" },
  { text: "The strong believer is better and more beloved to Allah than the weak believer.", source: "Sahih Muslim" },
  { text: "None of you truly believes until he loves for his brother what he loves for himself.", source: "Sahih Bukhari" },
  { text: "The best among you are those who have the best manners and character.", source: "Sahih Bukhari" },
  { text: "Take benefit of five before five: your youth before your old age...", source: "Hasan" },
  { text: "Whoever does not thank people has not thanked Allah.", source: "Sunan Abu Dawud" },
  { text: "Make things easy and do not make them difficult.", source: "Sahih Bukhari" },
  { text: "The most beloved deeds to Allah are those done regularly, even if they are small.", source: "Sahih Bukhari" },
  { text: "Do not despair of the mercy of Allah.", source: "Surah Az-Zumar 39:53" },
  { text: "And say, 'My Lord, increase me in knowledge.'", source: "Surah Taha 20:114" },
  { text: "Allah does not burden a soul beyond that it can bear.", source: "Surah Al-Baqarah 2:286" },
  { text: "And whoever relies upon Allah - then He is sufficient for him.", source: "Surah At-Talaq 65:3" },
  { text: "Speak good or remain silent.", source: "Sahih Bukhari" },
  { text: "The best of you is the one who learns the Quran and teaches it.", source: "Sahih Bukhari" },
  { text: "A kind word is charity.", source: "Sahih Bukhari" },
];

export function getRandomQuote(): IslamicQuote {
  const index = Math.floor(Math.random() * islamicQuotes.length);
  return islamicQuotes[index];
}

export function getDailyQuote(): IslamicQuote {
  const today = new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed += today.charCodeAt(i);
  }
  const index = seed % islamicQuotes.length;
  return islamicQuotes[index];
}
