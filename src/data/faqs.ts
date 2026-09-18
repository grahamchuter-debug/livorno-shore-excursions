import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "Where do cruise ships dock in Livorno?",
    answer:
      "At the commercial cruise terminal, a short walk from Livorno Centrale train station. Coaches meet passengers at the terminal exit.",
  },
  {
    question: "How long does it take to reach Florence from Livorno?",
    answer:
      "90–120 minutes by coach or private transfer along the A12 and A11 motorways. Allow a full day for Florence sightseeing.",
  },
  {
    question: "Can I visit Cinque Terre without a shore excursion?",
    answer:
      "Yes — regional trains from Livorno Centrale reach Manarola in about 10 minutes. Buy Cinque Terre park passes if walking coastal paths. Allow 90 minutes return buffer.",
  },
  {
    question: "What is the best Tuscany excursion for first-time visitors?",
    answer:
      "Florence Highlights on 9+ hour calls — Duomo, Signoria and Ponte Vecchio. Cinque Terre Highlights if you prefer coastal scenery.",
  },
  {
    question: "Should I book excursions through my cruise line?",
    answer:
      "Ship tours guarantee the vessel waits if their excursion is late. Reputable independent operators track all-aboard with buffers — often smaller groups and lower prices.",
  },
  {
    question: "Is a Livorno port day long enough for Florence and Pisa?",
    answer:
      "Only on 10+ hour calls via organised combo excursions. On standard 8–9 hour calls, choose one destination.",
  },
  {
    question: "How early should I return to Livorno from Florence?",
    answer:
      "Coaches typically leave Florence by 15:00–15:30. Independent travellers should be at Livorno terminal 60–90 minutes before all-aboard.",
  },
  {
    question: "What currency is used in Tuscany?",
    answer:
      "The euro. Cards work in Florence and major villages; carry cash for taxis, regional trains and small trattorias.",
  },
  {
    question: "Are Tuscany shore excursions suitable for limited mobility?",
    answer:
      "Pisa Piazza dei Miracoli and Cinque Terre harbours are relatively accessible. Florence cobbles and village steps can be challenging — small-group tours with flexible pacing work better.",
  },
  {
    question: "When is peak cruise season in Livorno?",
    answer:
      "April through October, with heaviest ship traffic May to September. Book Tuscany excursions before sailing in July and August.",
  },
  {
    question: "Is Portovenere worth visiting from Livorno?",
    answer:
      "Yes — a beautiful harbour village at the tip of the gulf, often quieter than the main Cinque Terre villages. Reachable by seasonal ferry or coach.",
  },
  {
    question: "Florence or Cinque Terre from Livorno?",
    answer:
      "Florence for Renaissance art and first-time Tuscany visitors. Cinque Terre for coastal scenery, photography and a more relaxed day with shorter transfers.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
